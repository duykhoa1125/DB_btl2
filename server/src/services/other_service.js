const { executeQuery } = require("../models/connect_sql");

class OtherService {
  async validateVoucher(id) {
    const result = await executeQuery(
      `
            SELECT count(*) AS count FROM Voucher WHERE ma_voucher=?
        `,
      [id]
    );
    const valid = result[0].count > 0;
    return valid;
  }
  async getFoods() {
    const result = await executeQuery(`
            SELECT * FROM DoAn;    
        `);
    return result;
  }
  async getRooms() {
    const result = await executeQuery(`
            SELECT ph.ma_phong as room_id, ph.ma_rap as cinema_id, ph.ten_phong as name, ph.trang_thai as state
            FROM PhongChieu ph
        `);
    return result;
  }
}

module.exports = new OtherService();
