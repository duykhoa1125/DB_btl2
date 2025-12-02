import axiosClient from "@/lib/axiosClient";
import { Room } from "./types";

const roomService = {
  /**
   * Get all rooms
   */
  getAll: (): Promise<Room[]> => {
    return axiosClient.get("/other/rooms");
  },

  /**
   * Get rooms for a specific cinema
   */
  getByCinema: (cinemaId: string): Promise<Room[]> => {
    return axiosClient.get("/other/rooms", { params: { cinema_id: cinemaId } });
  },
};

export default roomService;
