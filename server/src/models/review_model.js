// models/review_model.js
class Review {
  constructor(reviewData) {
    this.user_phone = reviewData.so_dien_thoai;
    this.movie_id = reviewData.ma_phim;
    this.review_date = reviewData.ngay_viet;
    this.rating = reviewData.so_sao;
    this.content = reviewData.noi_dung_danh_gia;
  }

  toJSON() {
    return {
      user_phone: this.user_phone,
      movie_id: this.movie_id,
      review_date: this.review_date,
      rating: this.rating,
      content: this.content
    };
  }
}

module.exports = Review;