const { executeQuery, pool } = require("../models/connect_sql");
const Bill = require("../models/bill_model");

class BookingService {
  async createBooking(userPhone, showtimeId, seats, foods, voucherId) {
    let total = 0;
    let connection;

    try {
      // Lấy connection từ pool
      connection = await pool.getConnection();

      // Kiểm tra ghế trống
      const availableSeats = await executeQuery(`CALL lay_ds_ghe_trong(?)`, [
        showtimeId,
      ]);
      const seatsList = availableSeats[0] || [];

      for (const s of seats) {
        const seatExists = seatsList.find(
          (seat) => seat.hang_ghe === s.row && seat.so_ghe === s.col
        );
        if (!seatExists) {
          throw new Error(
            `Ghế ${s.row}${s.col} đã được đặt hoặc không khả dụng!`
          );
        }
        total += s.price;
      }

      // Tính tổng đồ ăn
      if (foods && foods.length > 0) {
        for (const f of foods) {
          total += f.price * f.quantity;
        }
      }

      // Bắt đầu transaction
      await connection.beginTransaction();

      // Tạo hóa đơn
      const creationDatetime = this.getCurrentDateTimeStr();

      await connection.execute(
        `INSERT INTO HoaDon (ma_hoa_don, so_dien_thoai, ngay_tao, tong_tien)
         VALUES (NULL, ?, ?, ?)`,
        [userPhone, creationDatetime, total]
      );

      // Lấy bill id
      const [billResult] = await connection.execute(
        `SELECT ma_hoa_don FROM HoaDon WHERE so_dien_thoai = ? ORDER BY ma_hoa_don DESC LIMIT 1`,
        [userPhone]
      );
      const billId = billResult[0].ma_hoa_don;

      // Lấy thông tin suất chiếu
      const [showtimeInfo] = await connection.execute(
        `SELECT sc.ma_phim, p.ten_phim, sc.ngay_chieu, sc.gio_ket_thuc, sc.ma_phong
         FROM SuatChieu sc
         JOIN Phim p ON sc.ma_phim = p.ma_phim
         WHERE sc.ma_suat_chieu = ?`,
        [showtimeId]
      );

      if (showtimeInfo.length === 0) {
        throw new Error("Không tìm thấy thông tin suất chiếu!");
      }

      const info = showtimeInfo[0];
      const movieName = info.ten_phim;

      // Format ngày hết hạn
      const rawExpireDate = info.ngay_chieu;
      const expireDate =
        rawExpireDate instanceof Date
          ? rawExpireDate.toISOString().split("T")[0]
          : String(rawExpireDate).split("T")[0];
      const expireDateTime = `${expireDate} ${info.gio_ket_thuc}`;
      const roomId = info.ma_phong;

      // Tạo vé (trigger sẽ kiểm tra độ tuổi)
      for (const s of seats) {
        await connection.execute(
          `INSERT INTO Ve (ma_ve, ten_phim, gia_ve, ngay_mua, ngay_het_han, ma_hoa_don, ma_phong, hang_ghe, so_ghe, ma_suat_chieu)
           VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            movieName,
            s.price,
            creationDatetime,
            expireDateTime,
            billId,
            roomId,
            s.row,
            s.col,
            showtimeId,
          ]
        );
      }

      // Tạo đồ ăn nếu có
      if (foods && foods.length > 0) {
        const today = this.getCurrentDateStr();
        const futureDate = this.getFutureDateStr(30);

        for (const f of foods) {
          for (let i = 0; i < f.quantity; i++) {
            await connection.execute(
              `INSERT INTO DoAn (ma_do_an, ma_hoa_don, ten_do_an, gia_ban, ngay_san_xuat, ngay_het_han)
               VALUES (NULL, ?, ?, ?, ?, ?)`,
              [billId, f.name, f.price, today, futureDate]
            );
          }
        }
      }

      // Xử lý voucher nếu có
      if (voucherId) {
        await this.processVoucher(
          connection,
          billId,
          voucherId,
          userPhone,
          total
        );
      }

      // Cập nhật trạng thái ghế
      for (const s of seats) {
        await connection.execute(
          `UPDATE GheNgoi 
           SET trang_thai = 'occupied' 
           WHERE ma_phong = ? AND hang_ghe = ? AND so_ghe = ?`,
          [roomId, s.row, s.col]
        );
      }

      // Tính tổng cuối cùng
      const [finalTotalResult] = await connection.execute(
        `SELECT tinh_tong_hoa_don(?) AS total`,
        [billId]
      );
      const finalTotal = finalTotalResult[0].total;

      // Cập nhật tổng tiền
      await connection.execute(
        `UPDATE HoaDon SET tong_tien = ? WHERE ma_hoa_don = ?`,
        [finalTotal, billId]
      );

      // Commit transaction
      await connection.commit();

      return new Bill(billId, userPhone, creationDatetime, finalTotal);
    } catch (error) {
      // Rollback nếu có lỗi
      if (connection) {
        await connection.rollback();
      }

      console.error("Booking error:", error.message);

      // Xử lý lỗi từ trigger
      if (
        error.message.includes("chua du tuoi") ||
        error.message.includes("du tuoi")
      ) {
        throw new Error("Khách hàng chưa đủ tuổi để xem phim này!");
      }

      if (error.message.includes("Ghế")) {
        throw error;
      }

      throw new Error(`Lỗi đặt vé: ${error.message}`);
    } finally {
      // Release connection
      if (connection) {
        connection.release();
      }
    }
  }

  async processVoucher(connection, billId, voucherId, userPhone, total) {
    const [voucherInfo] = await connection.execute(
      `SELECT v.ma_voucher, v.trang_thai, km.ma_khuyen_mai,
              gg.phan_tram_giam, gg.gia_toi_da_giam
       FROM Voucher v
       JOIN KhuyenMai km ON v.ma_khuyen_mai = km.ma_khuyen_mai
       LEFT JOIN GiamGia gg ON km.ma_khuyen_mai = gg.ma_khuyen_mai
       WHERE v.ma_voucher = ? AND v.so_dien_thoai = ?`,
      [voucherId, userPhone]
    );

    if (voucherInfo.length === 0) {
      throw new Error(
        "Voucher không tồn tại hoặc không thuộc về người dùng này!"
      );
    }

    const voucher = voucherInfo[0];

    if (voucher.trang_thai !== "active") {
      throw new Error(
        `Voucher đã ${
          voucher.trang_thai === "used" ? "được sử dụng" : "hết hạn"
        }!`
      );
    }

    let discountApplied = 0;

    if (voucher.phan_tram_giam) {
      discountApplied = total * (voucher.phan_tram_giam / 100);

      if (
        voucher.gia_toi_da_giam &&
        discountApplied > voucher.gia_toi_da_giam
      ) {
        discountApplied = voucher.gia_toi_da_giam;
      }
    }

    // Tạo hóa đơn khuyến mãi
    await connection.execute(
      `INSERT INTO HoaDonKhuyenMai (ma_hoa_don_km, ma_hoa_don)
       VALUES (NULL, ?)`,
      [billId]
    );

    // Cập nhật trạng thái voucher
    await connection.execute(
      `UPDATE Voucher SET trang_thai = 'used' WHERE ma_voucher = ?`,
      [voucherId]
    );

    return discountApplied;
  }

  async getHistory(phone) {
    try {
      const result = await executeQuery(
        `SELECT * FROM HoaDon WHERE so_dien_thoai = ? ORDER BY ngay_tao DESC`,
        [phone]
      );

      return result.map(
        (row) =>
          new Bill(
            row.ma_hoa_don,
            row.so_dien_thoai,
            row.ngay_tao,
            row.tong_tien
          )
      );
    } catch (error) {
      console.error("Error getting booking history:", error);
      throw new Error("Không thể lấy lịch sử đặt vé");
    }
  }

  async getBookingDetails(billId) {
    try {
      const billInfo = await executeQuery(
        `SELECT * FROM HoaDon WHERE ma_hoa_don = ?`,
        [billId]
      );

      if (billInfo.length === 0) {
        throw new Error("Không tìm thấy hóa đơn!");
      }

      const tickets = await executeQuery(
        `SELECT * FROM Ve WHERE ma_hoa_don = ?`,
        [billId]
      );

      const foods = await executeQuery(
        `SELECT * FROM DoAn WHERE ma_hoa_don = ?`,
        [billId]
      );

      return {
        bill: new Bill(
          billInfo[0].ma_hoa_don,
          billInfo[0].so_dien_thoai,
          billInfo[0].ngay_tao,
          billInfo[0].tong_tien
        ),
        tickets: tickets,
        foods: foods,
      };
    } catch (error) {
      console.error("Error getting booking details:", error);
      throw error;
    }
  }

  // Helper functions
  getCurrentDateTimeStr() {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace("T", " ");
  }

  getCurrentDateStr() {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }

  getFutureDateStr(days) {
    const future = new Date();
    future.setDate(future.getDate() + days);
    return future.toISOString().split("T")[0];
  }
}

module.exports = new BookingService();
