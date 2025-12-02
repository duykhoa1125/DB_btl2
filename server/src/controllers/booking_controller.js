const BookingService = require("../services/booking_service");

class BookingController {
  async createBooking(req, res) {
    try {
      console.log("BookingController: req.user is", req.user);
      const userPhone = req.user?.phone_number; // Safe access with optional chaining

      if (!userPhone) {
        throw new Error("User phone number not found in token");
      }

      // const bearer = req.header['bearer'];
      const showtimeId = req.body.showtime_id;
      const seats = req.body.seats;
      const foods = req.body.foods || [];
      const voucherId = req.body.voucher_code || null;
      // const { showtime_id, seats, foods, voucher_code } = req.body;

      // Create booking
      const booking = await BookingService.createBooking(
        userPhone,
        showtimeId,
        seats,
        foods,
        voucherId
      );
      res.json({ success: true, data: booking });
    } catch (error) {
      console.error("BookingController Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getHistory(req, res) {
    try {
      const userPhone = req.user?.phone_number;
      if (!userPhone) {
        throw new Error("User phone number not found in token");
      }
      const history = await BookingService.getHistory(userPhone);
      res.json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new BookingController();
