//const { user } = require("../config/sql_server");
const { executeQuery } = require("../models/connect_sql");
// const Booking = require("../models/booking_model");
const Bill = require("../models/bill_model");

class BookingService {
  async createBooking(userPhone, showtimeId, seats, foods, voucherId) {
    const PRICE = 75000;
    // Bước 0: kiểm tra tính hợp lệ của các thành phần
    let total = 0;
    for (const s of seats) {
      const seatCheck = await executeQuery(
        `
                SELECT R.ma_phong, hang_ghe, so_ghe, loai_ghe, S.trang_thai 
                FROM SuatChieu NATURAL JOIN PhongChieu R 
                INNER JOIN GheNgoi S ON R.ma_phong=S.ma_phong 
                WHERE ma_suat_chieu=? AND hang_ghe=? AND so_ghe=?
            `,
        [showtimeId, s.row, s.col]
      );
      if (seatCheck.length <= 0) {
        throw new Error("Illegal seat!");
      }
      total += s.price;
    }
    // Tổng hợp giá tiền
    if (foods) {
      for (const f of foods) {
        total += f.price;
      }
    }
    // Bước 1: create bill
    let result = await executeQuery(
      `
            INSERT INTO HoaDon (so_dien_thoai, ngay_tao, tong_tien)
            VALUES (?, ?, ?)
        `,
      [userPhone, this.getCurrentDateTimeStr(), total]
    );
    // get bill id
    result = await executeQuery(
      "SELECT ma_hoa_don FROM HoaDon ORDER BY ma_hoa_don DESC LIMIT 1"
    );
    const billId = result[0].ma_hoa_don;

    // bước 2: create ticket
    // get info to create ticket
    result = await executeQuery(
      `
            SELECT ma_phim, ten_phim, ma_suat_chieu, ngay_chieu, gio_ket_thuc, ma_phong
            FROM SuatChieu NATURAL JOIN Phim
            WHERE ma_suat_chieu=?
        `,
      [showtimeId]
    );
    const movieName = result[0].ten_phim; // Dùng tên phim thay vì mã phim
    const creationDatetime = this.getCurrentDateTimeStr();
    // Xử lý ngày chiếu - có thể là Date object hoặc string
    const rawExpireDate = result[0].ngay_chieu;
    const expireDate =
      rawExpireDate instanceof Date
        ? rawExpireDate.toISOString().split("T")[0]
        : String(rawExpireDate).split("T")[0];
    const expireTime = result[0].gio_ket_thuc;
    const roomId = result[0].ma_phong;
    // add
    for (const s of seats) {
      result = await executeQuery(
        `
                INSERT INTO Ve
                VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)    
            `,
        [
          movieName,
          s.price,
          creationDatetime,
          expireDate + " " + expireTime,
          billId,
          roomId,
          s.row,
          s.col,
          showtimeId,
        ]
      );
    }

    // Bước 3: create food if any
    const today = this.getCurrentDateStr();
    const futureDate = this.getFutureDateStr(30); // 30 ngày sau
    for (const f of foods) {
      result = await executeQuery(
        `
                INSERT INTO DoAn (ma_do_an, ma_hoa_don, ten_do_an, gia_ban, ngay_san_xuat, ngay_het_han)
                VALUES (NULL, ?, ?, ?, ?, ?)    
            `,
        [billId, f.name, f.price * f.quantity, today, futureDate]
      );
    }
    // Bước 4-5: update voucher & tính tổng cuối cùng
    if (voucherId) {
      // implement voucher logic into price.
      // Default: 10% off
      total *= 0.9;
      result = await executeQuery(
        `
                UPDATE HoaDon
                SET tong_tien=?
                WHERE ma_hoa_don=?
                `,
        [total, billId]
      );
      result = await executeQuery(
        `
                UPDATE Voucher
                SET trang_thai='used'
                WHERE ma_voucher=?    
            `,
        [voucherId]
      );
    }

    const totalTable = await executeQuery(
      `
            SELECT tinh_tong_hoa_don(?) AS total
        `,
      [billId]
    );
    const totalNumber = totalTable[0].total;
    // Tạo Bill object để return
    return new Bill(billId, userPhone, creationDatetime, totalNumber);
  }
  async getHistory(phone) {
    const result = await executeQuery(
      `
            SELECT * FROM HoaDon WHERE so_dien_thoai=? ORDER BY ma_hoa_don DESC
        `,
      [phone]
    );
    return result.map(
      (row) =>
        new Bill(row.ma_hoa_don, row.so_dien_thoai, row.ngay_tao, row.tong_tien)
    );
  }
  getCurrentDateTimeStr() {
    const now = new Date();
    return (
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      " " +
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0") +
      ":" +
      String(now.getSeconds()).padStart(2, "0")
    );
  }
  getCurrentDateStr() {
    const now = new Date();
    return (
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0")
    );
  }
  getFutureDateStr(days) {
    const future = new Date();
    future.setDate(future.getDate() + days);
    return (
      future.getFullYear() +
      "-" +
      String(future.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(future.getDate()).padStart(2, "0")
    );
  }
}

module.exports = new BookingService();
