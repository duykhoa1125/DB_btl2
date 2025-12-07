const { executeQuery } = require("../models/connect_sql");
const Movie = require("../models/movie_model");
const MovieDetail = require("../models/movie_detail");

class MovieService {
  async getAll(status = null) {
    let query = "SELECT * FROM Phim";
    let params = [];

    if (status) {
      query += " WHERE trang_thai = ?";
      params.push(status);
    }

    const result = await executeQuery(query, params);
    return result.map((row) => new Movie(row));
  }

  async getById(id) {
    const movies = await executeQuery("SELECT * FROM Phim WHERE ma_phim = ?", [
      id,
    ]);

    if (movies.length <= 0) {
      return null;
    }

    const directors = await executeQuery(
      "SELECT ten_dao_dien FROM DaoDien WHERE ma_phim = ?",
      [id]
    );

    const actors = await executeQuery(
      "SELECT ten_dien_vien FROM DienVien WHERE ma_phim = ?",
      [id]
    );

    const ratings = await executeQuery(
      "SELECT COUNT(*) AS count, SUM(so_sao) AS total_stars FROM DanhGiaPhim WHERE ma_phim = ?",
      [id]
    );

    let reviews = [];
    try {
      const reviewsResult = await executeQuery("CALL xem_danh_gia(?, NULL)", [
        id,
      ]);
      reviews = reviewsResult[0] || [];
    } catch (error) {
      console.log(`No reviews found for movie ${id}:`, error.message);
      reviews = [];
    }

    let avgRating = 0;
    if (
      ratings.length > 0 &&
      ratings[0].count > 0 &&
      ratings[0].total_stars !== null
    ) {
      avgRating = ratings[0].total_stars / ratings[0].count;
    }

    const director_list = directors.map((row) => row.ten_dao_dien);
    const actor_list = actors.map((row) => row.ten_dien_vien);
    const review_list = reviews.map((row) => ({
      phone_number: row.so_dien_thoai,
      star_rating: row.so_sao,
      date_written: row.ngay_viet,
      review_content: row.noi_dung_danh_gia,
    }));

    const result = new MovieDetail(
      movies[0],
      director_list,
      actor_list,
      avgRating,
      review_list
    );
    return result;
  }
  async getTopRevenue() {
    const result = await executeQuery("CALL loc_top_phim_doanh_thu(?)", [5]);

    if (result.length === 0) {
      return null;
    }
    return result[0];
  }
}

module.exports = new MovieService();
