const { executeQuery } = require("../models/connect_sql");
// const Event = require("../models/event");

class AdminService {
  async getStats() {
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
    summary,
    image,
    directors,
    actors
  ) {
    await executeQuery(
      `
            INSERT INTO Phim (ma_phim, ten_phim, thoi_luong, ngay_khoi_chieu, ngay_ket_thuc, do_tuoi, trailer, ngon_ngu, trang_thai, tom_tat, hinh_anh)
            VALUES (NULL , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        title,
        duration,
        releaseDate,
        endDate,
        ageRating,
        trailer,
        language,
        status,
        summary,
        image,
      ]
    );

    const lastMovie = await executeQuery(
      `SELECT ma_phim FROM Phim ORDER BY ma_phim DESC LIMIT 1`
    );
    let newId = lastMovie[0].ma_phim;
    // Insert directors
    if (directors && Array.isArray(directors) && directors.length > 0) {
      for (const director of directors) {
        await executeQuery(
          `INSERT INTO DaoDien (ma_phim, ten_dao_dien) VALUES (?, ?)`,
          [newId, director]
        );
      }
    }

    // Insert actors
    if (actors && Array.isArray(actors) && actors.length > 0) {
      for (const actor of actors) {
        await executeQuery(
          `INSERT INTO DienVien (ma_phim, ten_dien_vien) VALUES (?, ?)`,
          [newId, actor]
        );
      }
    }

    return newId;
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
    summary,
    image,
    directors,
    actors
  ) {
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
      image: "hinh_anh",
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
      image,
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

    // Update movie fields if any
    if (fieldsToUpdate.length > 0) {
      values.push(id);
      const query = `
            UPDATE Phim
            SET ${fieldsToUpdate.join(", ")}
            WHERE ma_phim = ?
        `;
      await executeQuery(query, values);
    }

    // Update directors if provided
    if (directors !== undefined && Array.isArray(directors)) {
      // Delete existing directors
      await executeQuery(`DELETE FROM DaoDien WHERE ma_phim = ?`, [id]);
      // Insert new directors
      for (const director of directors) {
        await executeQuery(
          `INSERT INTO DaoDien (ma_phim, ten_dao_dien) VALUES (?, ?)`,
          [id, director]
        );
      }
    }

    // Update actors if provided
    if (actors !== undefined && Array.isArray(actors)) {
      // Delete existing actors
      await executeQuery(`DELETE FROM DienVien WHERE ma_phim = ?`, [id]);
      // Insert new actors
      for (const actor of actors) {
        await executeQuery(
          `INSERT INTO DienVien (ma_phim, ten_dien_vien) VALUES (?, ?)`,
          [id, actor]
        );
      }
    }
  }
  async deleteMovie(id) {
    // Delete related directors first
    await executeQuery(`DELETE FROM DaoDien WHERE ma_phim=?`, [id]);
    // Delete related actors
    await executeQuery(`DELETE FROM DienVien WHERE ma_phim=?`, [id]);
    // Delete the movie
    await executeQuery(`DELETE FROM Phim WHERE ma_phim=?`, [id]);
  }

  // cinemas CRUD
  async createCinema(name, status, address) {
    await executeQuery(
      `
            INSERT INTO RapChieu (ma_rap, ten_rap, trang_thai, dia_chi)
            VALUES (NULL, ?, ?, ?)
        `,
      [name, status, address]
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
    // Kiểm tra trạng thái phòng
    const status = await executeQuery(
      `SELECT trang_thai FROM PhongChieu WHERE ma_phong = ?`,
      [roomId]
    );

    if (status.length === 0) {
      throw new Error("Không tìm thấy phòng chiếu!");
    }

    if (status[0].trang_thai !== "active") {
      throw new Error("Phòng chiếu không khả dụng!");
    }

    // Lấy thông tin phim
    const film = await executeQuery(
      "SELECT ngay_khoi_chieu, ngay_ket_thuc FROM Phim WHERE ma_phim = ?",
      [movieId]
    );

    if (film.length === 0) {
      throw new Error("Không tìm thấy phim!");
    }

    // Kiểm tra ngày chiếu có nằm trong khoảng công chiếu không
    const filmData = film[0];

    // date, filmData.ngay_khoi_chieu, filmData.ngay_ket_thuc đều là DATE (YYYY-MM-DD)
    if (date < filmData.ngay_khoi_chieu) {
      throw new Error(
        `Ngày chiếu ${date} sớm hơn ngày khởi chiếu ${filmData.ngay_khoi_chieu}`
      );
    }

    if (date > filmData.ngay_ket_thuc) {
      throw new Error(
        `Ngày chiếu ${date} muộn hơn ngày kết thúc ${filmData.ngay_ket_thuc}`
      );
    }

    // Kiểm tra thời gian hợp lệ (startTime < endTime)
    if (startTime >= endTime) {
      throw new Error("Thời gian bắt đầu phải sớm hơn thời gian kết thúc");
    }

    // 5. Kiểm tra trùng lịch chiếu trong phòng
    const checkConflictQuery = `
        SELECT COUNT(*) as count 
        FROM SuatChieu 
        WHERE ma_phong = ? 
          AND ngay_chieu = ?
          AND (
            (gio_bat_dau < ? AND gio_ket_thuc > ?) OR
            (gio_bat_dau < ? AND gio_ket_thuc > ?) OR
            (gio_bat_dau >= ? AND gio_ket_thuc <= ?)
          )
    `;

    const conflict = await executeQuery(checkConflictQuery, [
      roomId,
      date,
      endTime,
      startTime, // Điều kiện 1
      startTime,
      endTime, // Điều kiện 2
      startTime,
      endTime, // Điều kiện 3
    ]);

    if (conflict[0].count > 0) {
      throw new Error("Phòng đã có suất chiếu trong khung giờ này!");
    }

    // Tạo suất chiếu - Trigger sẽ tự tạo ma_suat_chieu
    await executeQuery(
      `INSERT INTO SuatChieu (ma_suat_chieu, ma_phong, ma_phim, ngay_chieu, gio_bat_dau, gio_ket_thuc)
         VALUES (NULL, ?, ?, ?, ?, ?)`,
      [roomId, movieId, date, startTime, endTime]
    );
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
