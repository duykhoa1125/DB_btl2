// services/reviewService.js
const { executeQuery } = require("../models/connect_sql");
const Review = require("../models/review_model");

class ReviewService {
  // Lấy tất cả đánh giá của một phim
  async getReviewsByMovie(movieId, options = {}) {
    try {
      let query = `
        SELECT dg.*, tk.ho_ten, tk.anh_dai_dien
        FROM DanhGiaPhim dg
        JOIN TaiKhoan tk ON dg.so_dien_thoai = tk.so_dien_thoai
        WHERE dg.ma_phim = ?
      `;

      const params = [movieId];

      // Filter by rating if specified
      if (options.rating) {
        query += " AND dg.so_sao = ?";
        params.push(options.rating);
      }

      // Sort order
      const orderBy = options.orderBy || "ngay_viet";
      const orderDir = options.orderDir === "asc" ? "ASC" : "DESC";
      query += ` ORDER BY ${orderBy} ${orderDir}`;

      // Pagination
      if (options.limit) {
        query += " LIMIT ?";
        params.push(options.limit);
      }

      if (options.offset) {
        query += " OFFSET ?";
        params.push(options.offset);
      }

      const reviews = await executeQuery(query, params);

      // Tính thống kê rating
      const stats = await this.getRatingStats(movieId);

      return {
        reviews: reviews.map((review) => new Review(review)),
        stats: stats,
        count: reviews.length,
      };
    } catch (error) {
      console.error("Error getting reviews:", error);
      throw error;
    }
  }

  // Lấy đánh giá của một người dùng cho một phim
  async getUserReview(userPhone, movieId) {
    try {
      const query = `
        SELECT dg.*, tk.ho_ten, tk.anh_dai_dien
        FROM DanhGiaPhim dg
        JOIN TaiKhoan tk ON dg.so_dien_thoai = tk.so_dien_thoai
        WHERE dg.so_dien_thoai = ? AND dg.ma_phim = ?
        ORDER BY dg.ngay_viet DESC
        LIMIT 1
      `;

      const reviews = await executeQuery(query, [userPhone, movieId]);

      if (reviews.length === 0) {
        return null;
      }

      return new Review(reviews[0]);
    } catch (error) {
      console.error("Error getting user review:", error);
      throw error;
    }
  }

  // Tạo hoặc cập nhật đánh giá
  async createOrUpdateReview(userPhone, movieId, rating, content) {
    try {
      // Kiểm tra phim có tồn tại không
      const movieCheck = await executeQuery(
        "SELECT ma_phim FROM Phim WHERE ma_phim = ?",
        [movieId]
      );

      if (movieCheck.length === 0) {
        throw new Error("Phim không tồn tại");
      }

      // Kiểm tra người dùng có tồn tại không
      const userCheck = await executeQuery(
        "SELECT so_dien_thoai FROM TaiKhoan WHERE so_dien_thoai = ?",
        [userPhone]
      );

      if (userCheck.length === 0) {
        throw new Error("Người dùng không tồn tại");
      }

      // Validate rating (1-5 sao)
      if (rating < 1 || rating > 5) {
        throw new Error("Đánh giá phải từ 1 đến 5 sao");
      }

      // Validate content
      if (!content || content.trim().length === 0) {
        throw new Error("Nội dung đánh giá không được để trống");
      }

      if (content.length > 500) {
        throw new Error("Nội dung đánh giá không được quá 500 ký tự");
      }

      // Kiểm tra đã có đánh giá chưa
      const existingReview = await executeQuery(
        "SELECT * FROM DanhGiaPhim WHERE so_dien_thoai = ? AND ma_phim = ?",
        [userPhone, movieId]
      );

      let result;
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      if (existingReview.length > 0) {
        // Cập nhật đánh giá cũ
        result = await executeQuery(
          `UPDATE DanhGiaPhim 
           SET so_sao = ?, noi_dung_danh_gia = ?, ngay_viet = ?
           WHERE so_dien_thoai = ? AND ma_phim = ?`,
          [rating, content, now, userPhone, movieId]
        );
      } else {
        // Tạo đánh giá mới
        result = await executeQuery(
          `INSERT INTO DanhGiaPhim (so_dien_thoai, ma_phim, ngay_viet, so_sao, noi_dung_danh_gia)
           VALUES (?, ?, ?, ?, ?)`,
          [userPhone, movieId, now, rating, content]
        );
      }

      // Tính lại rating trung bình cho phim
      await this.calculateMovieRating(movieId);

      // Cộng điểm tích lũy cho người dùng (ví dụ: 10 điểm mỗi review)
      await executeQuery(
        `UPDATE TaiKhoan 
         SET diem_tich_luy = diem_tich_luy + 10
         WHERE so_dien_thoai = ?`,
        [userPhone]
      );

      // Lấy thông tin review vừa tạo
      const newReview = await this.getUserReview(userPhone, movieId);

      return {
        success: true,
        message:
          existingReview.length > 0
            ? "Cập nhật đánh giá thành công!"
            : "Đánh giá phim thành công!",
        review: newReview,
        points_earned: 10,
      };
    } catch (error) {
      console.error("Error creating/updating review:", error);
      throw error;
    }
  }

  // Xóa đánh giá
  async deleteReview(userPhone, movieId) {
    try {
      // Kiểm tra review có tồn tại không
      const existingReview = await executeQuery(
        "SELECT * FROM DanhGiaPhim WHERE so_dien_thoai = ? AND ma_phim = ?",
        [userPhone, movieId]
      );

      if (existingReview.length === 0) {
        throw new Error("Không tìm thấy đánh giá để xóa");
      }

      // Xóa review
      await executeQuery(
        "DELETE FROM DanhGiaPhim WHERE so_dien_thoai = ? AND ma_phim = ?",
        [userPhone, movieId]
      );

      // Tính lại rating trung bình cho phim
      await this.calculateMovieRating(movieId);

      // Trừ điểm tích lũy (nếu muốn)
      await executeQuery(
        `UPDATE TaiKhoan 
         SET diem_tich_luy = GREATEST(diem_tich_luy - 10, 0)
         WHERE so_dien_thoai = ?`,
        [userPhone]
      );

      return {
        success: true,
        message: "Xóa đánh giá thành công!",
      };
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }

  // Tính thống kê rating của phim
  async getRatingStats(movieId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_reviews,
          AVG(so_sao) as average_rating,
          SUM(CASE WHEN so_sao = 1 THEN 1 ELSE 0 END) as one_star,
          SUM(CASE WHEN so_sao = 2 THEN 1 ELSE 0 END) as two_stars,
          SUM(CASE WHEN so_sao = 3 THEN 1 ELSE 0 END) as three_stars,
          SUM(CASE WHEN so_sao = 4 THEN 1 ELSE 0 END) as four_stars,
          SUM(CASE WHEN so_sao = 5 THEN 1 ELSE 0 END) as five_stars
        FROM DanhGiaPhim
        WHERE ma_phim = ?
      `;

      const stats = await executeQuery(query, [movieId]);

      if (stats.length === 0) {
        return {
          total_reviews: 0,
          average_rating: 0,
          rating_distribution: [0, 0, 0, 0, 0],
        };
      }

      const stat = stats[0];

      return {
        total_reviews: stat.total_reviews,
        average_rating: stat.average_rating
          ? parseFloat(stat.average_rating).toFixed(1)
          : 0,
        rating_distribution: [
          stat.one_star || 0,
          stat.two_stars || 0,
          stat.three_stars || 0,
          stat.four_stars || 0,
          stat.five_stars || 0,
        ],
      };
    } catch (error) {
      console.error("Error getting rating stats:", error);
      return {
        total_reviews: 0,
        average_rating: 0,
        rating_distribution: [0, 0, 0, 0, 0],
      };
    }
  }

  // Tính và cập nhật rating trung bình cho phim
  async calculateMovieRating(movieId) {
    try {
      const stats = await this.getRatingStats(movieId);

      // Cập nhật vào bảng Phim nếu cần (nếu bạn có cột rating trung bình)
      // Ví dụ: ALTER TABLE Phim ADD COLUMN rating_avg DECIMAL(3,2) DEFAULT 0;

      return stats.average_rating;
    } catch (error) {
      console.error("Error calculating movie rating:", error);
      return 0;
    }
  }

  // Lấy top phim được đánh giá cao nhất
  async getTopRatedMovies(limit = 10) {
    try {
      const query = `
        SELECT 
          p.ma_phim,
          p.ten_phim,
          p.hinh_anh,
          COUNT(dg.ma_phim) as review_count,
          AVG(dg.so_sao) as average_rating
        FROM Phim p
        LEFT JOIN DanhGiaPhim dg ON p.ma_phim = dg.ma_phim
        WHERE p.trang_thai = 'showing'
        GROUP BY p.ma_phim, p.ten_phim, p.hinh_anh
        HAVING COUNT(dg.ma_phim) >= 5  -- Chỉ lấy phim có ít nhất 5 đánh giá
        ORDER BY average_rating DESC, review_count DESC
        LIMIT ?
      `;

      const movies = await executeQuery(query, [limit]);

      return movies.map((movie) => ({
        ...movie,
        average_rating: movie.average_rating
          ? parseFloat(movie.average_rating).toFixed(1)
          : 0,
      }));
    } catch (error) {
      console.error("Error getting top rated movies:", error);
      return [];
    }
  }
}

module.exports = new ReviewService();
