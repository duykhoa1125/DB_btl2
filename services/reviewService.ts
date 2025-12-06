import axiosClient from "@/lib/axiosClient";

interface SubmitReviewRequest {
    rating: number;
    content: string;
}

interface ReviewResponse {
    success: boolean;
    data?: {
        phone_number: string;
        movie_id: string;
        date_written: string;
        star_rating: number;
        review_content: string;
        reviewer_name?: string;
        reviewer_avatar?: string;
    };
    isNew?: boolean;
    message?: string;
}

const reviewService = {
    /**
     * Submit or update a review for a movie
     * POST /reviews/movies/:movieId/reviews
     */
    submitReview: (
        movieId: string,
        data: SubmitReviewRequest
    ): Promise<ReviewResponse> => {
        return axiosClient.post(`/reviews/movies/${movieId}/reviews`, data);
    },

    /**
     * Get all reviews for a movie
     * GET /reviews/movies/:movieId/reviews
     */
    getMovieReviews: (movieId: string): Promise<ReviewResponse> => {
        return axiosClient.get(`/reviews/movies/${movieId}/reviews`);
    },

    /**
     * Get current user's review for a movie
     * GET /reviews/movies/:movieId/my-review
     */
    getMyReview: (movieId: string): Promise<ReviewResponse> => {
        return axiosClient.get(`/reviews/movies/${movieId}/my-review`);
    },

    /**
     * Delete user's review for a movie
     * DELETE /reviews/movies/:movieId/reviews
     */
    deleteReview: (movieId: string): Promise<ReviewResponse> => {
        return axiosClient.delete(`/reviews/movies/${movieId}/reviews`);
    },
};

export default reviewService;
