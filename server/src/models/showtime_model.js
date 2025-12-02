class Showtime {
  constructor(data) {
    this.id = data.ma_suat_chieu;
    this.roomId = data.ma_phong;
    this.movieId = data.ma_phim;
    this.date = data.ngay_chieu;
    this.startTime = data.gio_bat_dau;
    this.endTime = data.gio_ket_thuc;
    this.room = data.ten_phong;
    this.cinema = data.ten_rap;
    this.address = data.dia_chi;
  }
  toJSON() {
    return {
      showtime_id: this.id,
      room_id: this.roomId,
      movie_id: this.movieId,
      start_date: this.date,
      start_time: this.startTime,
      end_time: this.endTime,
      room_name: this.room,
      cinema_name: this.cinema,
      address: this.address,
    };
  }
}

module.exports = Showtime;
