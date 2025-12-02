import axiosClient from "@/lib/axiosClient";
import { Movie, MovieDetail } from "./types";

const movieService = {
  /**
   * Get all movies
   */
  getAll: (): Promise<Movie[]> => {
    return axiosClient.get("/movies");
  },

  /**
   * Get movie by ID
   */
  getById: (id: string): Promise<MovieDetail | null> => {
    return axiosClient.get(`/movies/${id}`);
  },

  /**
   * Get upcoming movies
   */
  getUpcoming: (): Promise<Movie[]> => {
    return axiosClient.get("/movies", { params: { status: "upcoming" } });
  },
};

export default movieService;
