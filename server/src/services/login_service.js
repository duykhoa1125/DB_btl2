const { executeQuery } = require("../models/connect_sql");
const jwt = require("jsonwebtoken");

// Helper function to map frontend gender to database gender
const mapGenderToDb = (frontendGender) => {
  const mapping = {
    male: "Nam",
    female: "Nữ",
    unknown: "Khác",
  };
  return mapping[frontendGender] || "Khác";
};

// Helper function to map database gender to frontend gender
const mapGenderFromDb = (dbGender) => {
  const mapping = {
    Nam: "male",
    Nữ: "female",
    Khác: "unknown",
  };
  return mapping[dbGender] || "unknown";
};

class LoginService {
  async login(identifier, password) {
    // Hardcoded admin login
    if (identifier === "admin" && password === "123456789") {
      const user = {
        phone_number: "0000000000",
        email: "admin@example.com",
        fullname: "Administrator",
        birth_date: new Date(),
        gender: "male",
        avatar: "",
        membership_points: 0,
        registration_date: new Date(),
        role: "admin",
      };
      const JWT_SECRET = process.env.JWT_SECRET || "conchocaobangbopc";
      const userPayload = {
        phone_number: user.phone_number,
      };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "24h" });
      return { token, user };
    }

    // Verify user exists
    let userResult = null;
    if (identifier.includes("@")) {
      // Email login
      userResult = await executeQuery(
        `
                SELECT so_dien_thoai, email, mat_khau, ho_ten, ngay_sinh, gioi_tinh, anh_dai_dien, diem_tich_luy, ngay_dang_ky
                FROM TaiKhoan WHERE email=? 
            `,
        [identifier]
      );
    } else {
      // Phone login
      userResult = await executeQuery(
        `
                SELECT so_dien_thoai, email, mat_khau, ho_ten, ngay_sinh, gioi_tinh, anh_dai_dien, diem_tich_luy, ngay_dang_ky
                FROM TaiKhoan WHERE so_dien_thoai=? 
            `,
        [identifier]
      );
    }

    // Check if user exists
    if (!userResult || userResult.length === 0) {
      throw new Error("Invalid credentials");
    }

    const dbUser = userResult[0];

    // Verify password
    if (password !== dbUser.mat_khau) {
      throw new Error("Invalid credentials");
    }

    const phone = dbUser.so_dien_thoai;
    let role = "user";

    // Check if user is an employee (admin)
    const roleResult = await executeQuery(
      `
            SELECT ma_nhan_vien FROM NhanVien WHERE so_dien_thoai=?    
        `,
      [phone]
    );
    if (roleResult.length > 0) role = "admin";

    const user = {
      phone_number: phone,
      email: dbUser.email,
      fullname: dbUser.ho_ten,
      birth_date: dbUser.ngay_sinh,
      gender: mapGenderFromDb(dbUser.gioi_tinh),
      avatar: dbUser.anh_dai_dien,
      membership_points: dbUser.diem_tich_luy,
      registration_date: dbUser.ngay_dang_ky,
      role: role,
    };

    const JWT_SECRET = process.env.JWT_SECRET || "conchocaobangbopc";
    const userPayload = {
      phone_number: phone,
    };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "24h" });

    return { token, user };
  }

  async register(phone, email, password, fullname, birthdate, gender) {
    // Check if account already exists
    const userResult = await executeQuery(
      `
            SELECT so_dien_thoai FROM TaiKhoan WHERE so_dien_thoai=? 
        `,
      [phone]
    );
    if (userResult.length > 0)
      throw new Error("An account with this phone number already exists!");

    // Map gender from frontend format to database format
    const dbGender = mapGenderToDb(gender);

    // Create new account
    await executeQuery(
      `
            INSERT INTO TaiKhoan (so_dien_thoai, email, mat_khau, ho_ten, ngay_sinh, gioi_tinh)
            VALUES (?, ?, ?, ?, ?, ?);    
        `,
      [phone, email, password, fullname, birthdate, dbGender]
    );
  }

  async getMyInfo(phone) {
    const result = await executeQuery(
      `
            SELECT so_dien_thoai, email, ho_ten, ngay_sinh, gioi_tinh, anh_dai_dien, diem_tich_luy, ngay_dang_ky
            FROM TaiKhoan WHERE so_dien_thoai=? 
        `,
      [phone]
    );

    if (!result || result.length === 0) {
      throw new Error("User not found");
    }

    const dbUser = result[0];
    let role = "user";

    // Check if user is an employee (admin)
    const roleResult = await executeQuery(
      `
            SELECT ma_nhan_vien FROM NhanVien WHERE so_dien_thoai=?    
        `,
      [phone]
    );
    if (roleResult.length > 0) role = "admin";

    return {
      phone_number: dbUser.so_dien_thoai,
      email: dbUser.email,
      fullname: dbUser.ho_ten,
      birth_date: dbUser.ngay_sinh,
      gender: mapGenderFromDb(dbUser.gioi_tinh),
      avatar: dbUser.anh_dai_dien,
      membership_points: dbUser.diem_tich_luy,
      registration_date: dbUser.ngay_dang_ky,
      role: role,
    };
  }
}

module.exports = new LoginService();
