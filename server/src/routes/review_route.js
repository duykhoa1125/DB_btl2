// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review_controller");
const { authenticateToken } = require("../middlewares/auth");
/*
GET    /reviews/movies/:movieId/reviews      # Lấy tất cả review của phim
GET    /reviews/movies/:movieId/stats        # Lấy thống kê rating
GET    /reviews/movies/:movieId/my-review    # Lấy review của user hiện tại
POST   /reviews/movies/:movieId/reviews      # Tạo/cập nhật review
DELETE /reviews/movies/:movieId/reviews      # Xóa review
GET    /reviews/top-rated                    # Top phim đánh giá cao
GET    /reviews/latest                       # Review mới nhất
*/
router.get("/movies/:movieId/reviews", reviewController.getMovieReviews);
router.get("/movies/:movieId/stats", reviewController.getRatingStats);
router.get("/top-rated", reviewController.getTopRatedMovies);
router.get("/latest", reviewController.getLatestReviews);
router.get("/movies/:movieId/my-review",authenticateToken, reviewController.getMyReview);
router.post("/movies/:movieId/reviews", authenticateToken,reviewController.submitReview);
router.delete("/movies/:movieId/reviews",authenticateToken,reviewController.deleteReview);

module.exports = router;
