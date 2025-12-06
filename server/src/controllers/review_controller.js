// controllers/reviewController.js
const reviewService = require("../services/review_service");

// Lấy tất cả review của một phim
exports.getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, orderBy, orderDir, limit, page } = req.query;

    const options = {};
    if (rating) options.rating = parseInt(rating);
    if (orderBy) options.orderBy = orderBy;
    if (orderDir) options.orderDir = orderDir;
    if (limit) options.limit = parseInt(limit);
    if (page && limit) {
      options.offset = (parseInt(page) - 1) * parseInt(limit);
    }

    const result = await reviewService.getReviewsByMovie(movieId, options);

    res.json({
      success: true,
      data: result.reviews,
      stats: result.stats,
      pagination: {
        total: result.count,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : result.count,
      },
    });
  } catch (error) {
    console.error("Get movie reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi lấy đánh giá phim",
    });
  }
};

// Lấy review của người dùng hiện tại cho phim
exports.getMyReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userPhone = req.user.phone_number;

    const review = await reviewService.getUserReview(userPhone, movieId);

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Get my review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi lấy đánh giá của bạn",
    });
  }
};

// Tạo hoặc cập nhật review
exports.submitReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, content } = req.body;
    const userPhone = req.user.phone_number;

    // Validate input
    if (!rating || !content) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp rating và nội dung đánh giá",
      });
    }

    const result = await reviewService.createOrUpdateReview(
      userPhone,
      movieId,
      parseInt(rating),
      content.trim()
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Submit review error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi gửi đánh giá",
    });
  }
};
// Xóa review
exports.deleteReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userPhone = req.user.phone_number;

    const result = await reviewService.deleteReview(userPhone, movieId);

    res.json(result);
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi xóa đánh giá",
    });
  }
};

// Lấy thống kê rating của phim
exports.getRatingStats = async (req, res) => {
  try {
    const { movieId } = req.params;

    const stats = await reviewService.getRatingStats(movieId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get rating stats error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thống kê rating",
    });
  }
};

// Lấy top phim được đánh giá cao
exports.getTopRatedMovies = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const movies = await reviewService.getTopRatedMovies(parseInt(limit));

    res.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error("Get top rated movies error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy top phim đánh giá cao",
    });
  }
};

// Lấy review mới nhất
exports.getLatestReviews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const query = `
      SELECT dg.*, tk.ho_ten, tk.anh_dai_dien, p.ten_phim, p.hinh_anh
      FROM DanhGiaPhim dg
      JOIN TaiKhoan tk ON dg.so_dien_thoai = tk.so_dien_thoai
      JOIN Phim p ON dg.ma_phim = p.ma_phim
      ORDER BY dg.ngay_viet DESC
      LIMIT ?
    `;

    const reviews = await executeQuery(query, [parseInt(limit)]);

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get latest reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy đánh giá mới nhất",
    });
  }
};
