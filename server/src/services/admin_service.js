const { executeQuery } = require("../models/connect_sql");
// const Event = require("../models/event");

class AdminService {
  async getStats() {
    // const result = await executeQuery(`
    //     -- ghi gì vào đây để gọi procedure, ví dụ sp_GetMonthlyRevenue ?
    // `);
    const raw_movieCount = await executeQuery(
      "SELECT COUNT(ma_phim) AS count FROM Phim"
    );
    const raw_showingCount = await executeQuery(
      "SELECT COUNT(ma_phim) AS count FROM Phim WHERE trang_thai='showing'"
    );
    const raw_commingSoonCount = await executeQuery(
      "SELECT COUNT(ma_phim) AS count FROM Phim WHERE trang_thai='upcoming'"
    );
    const raw_totalCinemaCount = await executeQuery(
      "SELECT COUNT(ma_rap) AS count FROM RapChieu"
    );
    // tính 2 con số dưới đây thế nào?
    // const monthlyRevenue = await executeQuery("")
    // const bookingThisMonth =
    const movieCount = this.getCountNumber(raw_movieCount);
    const showingCount = this.getCountNumber(raw_showingCount);
    const commingSoonCount = this.getCountNumber(raw_commingSoonCount);
    const totalCinemaCount = this.getCountNumber(raw_totalCinemaCount);
    return {
      total_movies: movieCount,
      now_showing: showingCount,
      coming_soon: commingSoonCount,
      total_cinemas: totalCinemaCount,
      monthly_revenue: 50000000,
      bookings_this_month: 120,
    };
  }
  getCountNumber(countTable) {
    return countTable[0].count;
  }
  async createMovie(
    title,
    duration,
    releaseDate,
    endDate,
    ageRating,
    trailer,
    language,
    status,
    summary
  ) {
    // Generate new movie ID (PHM + 5 digits, total 8 chars like PHM00001)
    const lastMovie = await executeQuery(
      `SELECT ma_phim FROM Phim ORDER BY ma_phim DESC LIMIT 1`
    );
    let newId = "PHM00001";
    if (lastMovie && lastMovie.length > 0) {
      const lastId = lastMovie[0].ma_phim;
      // Extract numeric part after "PHM" prefix (3 chars)
      const numPart = parseInt(lastId.substring(3)) + 1;
      newId = "PHM" + numPart.toString().padStart(5, "0");
    }

    await executeQuery(
      `
            INSERT INTO Phim (ma_phim, ten_phim, thoi_luong, ngay_khoi_chieu, ngay_ket_thuc, do_tuoi, trailer, ngon_ngu, trang_thai, tom_tat)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        newId,
        title,
        duration,
        releaseDate,
        endDate,
        ageRating,
        trailer,
        language,
        status,
        summary,
      ]
    );
  }
  async updateMovie(
    id,
    title,
    duration,
    releaseDate,
    endDate,
    ageRating,
    trailer,
    language,
    status,
    summary
  ) {
    // const result = await executeQuery(`
    //     UPDATE Phim
    //     SET ...
    //     WHERE ma_phim=?
    // `, [id]);
    // Map tham số với tên cột trong database
    const fieldMap = {
      title: "ten_phim",
      duration: "thoi_luong",
      releaseDate: "ngay_khoi_chieu",
      endDate: "ngay_ket_thuc",
      ageRating: "do_tuoi",
      trailer: "trailer",
      language: "ngon_ngu",
      status: "trang_thai",
      summary: "tom_tat",
    };

    // Object chứa các giá trị cần update
    const updates = {
      title,
      duration,
      releaseDate,
      endDate,
      ageRating,
      trailer,
      language,
      status,
      summary,
    };

    // Lọc các trường không null/undefined
    const fieldsToUpdate = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== null && value !== undefined) {
        fieldsToUpdate.push(`${fieldMap[key]} = ?`);
        values.push(value);
      }
    }

    // Kiểm tra có trường nào để update không
    if (fieldsToUpdate.length === 0) {
      throw new Error("No fields to update!");
    }

    // Thêm id vào cuối mảng values
    values.push(id);

    // Tạo câu query
    const query = `
            UPDATE Phim
            SET ${fieldsToUpdate.join(", ")}
            WHERE ma_phim = ?
        `;

    await executeQuery(query, values);
  }
  async deleteMovie(id) {
    await executeQuery(`DELETE FROM Phim WHERE ma_phim=?`, [id]);
  }

  // cinemas CRUD
  async createCinema(name, status, address) {
    // Generate new cinema ID (RAP + 5 digits, total 8 chars like RAP00001)
    const lastCinema = await executeQuery(
      `SELECT ma_rap FROM RapChieu ORDER BY ma_rap DESC LIMIT 1`
    );
    let newId = "RAP00001";
    if (lastCinema && lastCinema.length > 0) {
      const lastId = lastCinema[0].ma_rap;
      // Extract numeric part after "RAP" prefix (3 chars)
      const numPart = parseInt(lastId.substring(3)) + 1;
      newId = "RAP" + numPart.toString().padStart(5, "0");
    }

    await executeQuery(
      `
            INSERT INTO RapChieu (ma_rap, ten_rap, trang_thai, dia_chi)
            VALUES (?, ?, ?, ?)
        `,
      [newId, name, status, address]
    );
  }
  async updateCinema(id, name, status, address) {
    const fieldMap = {
      name: "ten_rap",
      status: "trang_thai",
      address: "dia_chi",
    };

    const updates = { name, status, address };

    const fieldsToUpdate = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== null && value !== undefined) {
        fieldsToUpdate.push(`${fieldMap[key]} = ?`);
        values.push(value);
      }
    }

    if (fieldsToUpdate.length === 0) {
      throw new Error("No fields to update!");
    }

    values.push(id);

    const query = `
            UPDATE RapChieu
            SET ${fieldsToUpdate.join(", ")}
            WHERE ma_rap = ?
        `;

    await executeQuery(query, values);
  }
  async deleteCinema(id) {
    await executeQuery(`DELETE FROM RapChieu WHERE ma_rap=?`, [id]);
  }

  // showtimes CRUD
  async createShowtime(roomId, movieId, date, startTime, endTime) {
    const status = await executeQuery(
      `
            SELECT trang_thai FROM PhongChieu WHERE ma_phong=?
        `,
      [roomId]
    );

    console.log("___ ctrl");
    if (status[0].trang_thai != "active") {
      throw new Error("The indicated room is full!"); // báo lỗi nếu phòng ko trống
    }

    // Generate new showtime ID (SCH + 5 digits, total 8 chars like SCH00001)
    const lastShowtime = await executeQuery(
      `SELECT ma_suat_chieu FROM SuatChieu ORDER BY ma_suat_chieu DESC LIMIT 1`
    );
    let newId = "SCH00001";
    if (lastShowtime && lastShowtime.length > 0) {
      const lastId = lastShowtime[0].ma_suat_chieu;
      // Extract numeric part after "SCH" prefix (3 chars)
      const numPart = parseInt(lastId.substring(3)) + 1;
      newId = "SCH" + numPart.toString().padStart(5, "0");
    }

    await executeQuery(
      `
            INSERT INTO SuatChieu (ma_suat_chieu, ma_phong, ma_phim, ngay_chieu, gio_bat_dau, gio_ket_thuc)
            VALUES (?, ?, ?, ?, ?, ?)
        `,
      [newId, roomId, movieId, date, startTime, endTime]
    );
    return newId;
  }
  async updateShowtime(id, roomId, movieId, date, startTime, endTime) {
    const fieldMap = {
      roomId: "ma_phong",
      movieId: "ma_phim",
      date: "ngay_chieu",
      startTime: "gio_bat_dau",
      endTime: "gio_ket_thuc",
    };

    const updates = { roomId, movieId, date, startTime, endTime };

    const fieldsToUpdate = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== null && value !== undefined) {
        fieldsToUpdate.push(`${fieldMap[key]} = ?`);
        values.push(value);
      }
    }

    if (fieldsToUpdate.length === 0) {
      throw new Error("No fields to update!");
    }

    values.push(id);

    const query = `
            UPDATE SuatChieu
            SET ${fieldsToUpdate.join(", ")}
            WHERE ma_suat_chieu = ?
        `;
    console.log(query, values);
    await executeQuery(query, values);
  }
  async deleteShowtime(id) {
    await executeQuery(`DELETE FROM SuatChieu WHERE ma_suat_chieu=?`, [id]);
  }

  async getShowtimeById(id) {
    const result = await executeQuery(
      `SELECT ma_suat_chieu, ma_phong, ma_phim, ngay_chieu, gio_bat_dau, gio_ket_thuc 
       FROM SuatChieu WHERE ma_suat_chieu = ?`,
      [id]
    );
    if (result.length === 0) {
      throw new Error("Showtime not found");
    }
    const row = result[0];
    return {
      showtime_id: row.ma_suat_chieu,
      room_id: row.ma_phong,
      movie_id: row.ma_phim,
      start_date: row.ngay_chieu,
      start_time: row.gio_bat_dau,
      end_time: row.gio_ket_thuc,
    };
  }
}

module.exports = new AdminService();
