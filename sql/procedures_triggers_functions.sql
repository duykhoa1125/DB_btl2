USE TicketBookingSystem;

-- *** PROCEDURES ***
-- PROCEDURE 1
DROP PROCEDURE IF EXISTS lay_ds_ghe_trong;

DELIMITER \\
CREATE PROCEDURE lay_ds_ghe_trong(IN p_Id_ca_chieu VARCHAR(8))
BEGIN
    DECLARE msg VARCHAR(50);

    IF NOT EXISTS (SELECT * FROM SuatChieu WHERE ma_suat_chieu = p_Id_ca_chieu) THEN
        SET msg = CONCAT('Khong tim thay ca chieu co ID: ', p_Id_ca_chieu);
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = msg;
    END IF;

    SELECT
        c.ma_suat_chieu,
        g.hang_ghe,
        g.so_ghe,
        g.Trang_thai
    FROM SuatChieu c
             JOIN GheNgoi g  -- NOTE: can kiem tra: "Truy vấn có sử dụng WHERE và ORDER BY giữa hai bảng trở lên."
                  ON c.ma_phong = g.ma_phong
    WHERE
        c.ma_suat_chieu = p_Id_ca_chieu AND
        g.Trang_thai = 'available'
    ORDER BY g.hang_ghe, g.so_ghe
    ;
END \\
DELIMITER ;


-- PROCEDURE 2
DROP PROCEDURE IF EXISTS xem_danh_gia;

DELIMITER \\
CREATE PROCEDURE xem_danh_gia(IN p_Id_phim VARCHAR(8), p_So_sao INT)
BEGIN
    DECLARE MSG VARCHAR(50);

    IF NOT Exists (SElECT * FROM DanhGiaPhim WHERE ma_phim = p_Id_phim) THEN
        SET msG = CONCAT('Khong tim thay phim co ID: ', p_Id_phim);
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = MSG;
    END IF;

    IF P_SO_sao IS NOT NULL THEN
        SElECT
            *
        FROM DanhGiaPhim dg
        WHERE
            dg.ma_phim = p_Id_phim AND
            dg.so_sao = p_So_Sao
        ;
    ELSE
        SELECT
            *
        FROM DanhGiaPhim dG
        WHERE
            dg.ma_phim = p_Id_phim
        ORDER BY dg.so_sao DESC
        ;
    END IF;
END \\
DELIMITER ;


-- PROCEDURE 3
DROP PROCEDURE IF EXISTS loc_phim_nhieu_suat_chieu;

DELIMITER \\
CREATE PROCEDURE loc_phim_nhieu_suat_chieu(IN min_suat_chieu INT)
BEGIN
    DECLARE msg VARCHAR(50);

    IF min_suat_chieu IS NULL THEN
        SET msg = 'Admin vui long dien tham so cho min_suat_chieu!';
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = msg;
    END IF;

    SELECT
        c.ma_phim,
        COUNT(c.ma_phim) AS sl_ca_chieu
    FROM SuatChieu c
    GROUP BY c.ma_phim
    HAVING count(c.ma_phim) > min_suat_chieu
    ;
END \\
DELIMITER ;

-- *** TRIGGER ***
-- TRIGGER 1
DROP TRIGGER IF EXISTS kiem_tra_tuoi_mua_ve;

delimiter \\
CREATE TRIGGER kiem_tra_tuoi_mua_ve
    BEFORE INSERT ON Ve
    FOR EACH ROW
BEGIN
    DECLARE tuoi INT;
    DECLARE GH_tuoi_phim INT;
    DECLARE ten_phim VARCHAR(50);
    DECLARE msg VARCHAR(100);

    -- Tinh so tuoi KH
    SELECT
        TIMESTAMPDIFF(YEAR, tk.Ngay_sinh, CURDATE()) INTO tuoi
    FROM HoaDon hd
             JOIN TaiKhoan tk
                  ON hd.So_dien_thoai = tk.So_dien_thoai
    WHERE
        hd.ma_hoa_don = new.ma_hoa_don
    ;

    -- Lay gioi han do tuoi cua phim
    SELECT
        p.do_tuoi,  p.Ten_phim INTO
        GH_tuoi_phim, ten_phim
    FROM SuatChieu c
             JOIN Phim p
                  ON c.ma_phim = p.ma_phim
    WHERE
        c.ma_suat_chieu = new.ma_suat_chieu
    ;

    -- Dieu kien
    IF tuoi < GH_tuoi_phim THEN
        SET msg = CONCAT('Quy khach chua du tuoi de xem phim ', ten_phim);
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = msg;
    END IF;
END \\
delimiter ;


-- TRIGGER 2
DROP TRIGGER IF EXISTS reset_trang_thai_ghe;

delimiter \\
CREATE TRIGGER reset_trang_thai_ghe
    AFTER DELETE ON Ve
    FOR EACH ROW
BEGIN
    UPDATE GheNgoi g
    SET g.Trang_thai = 'available'
    WHERE
        g.ma_phong = old.ma_phong AND
        g.hang_ghe = old.hang_ghe AND
        g.so_ghe = old.so_ghe
    ;
END \\
delimiter ;

-- *** FUNCTIONS
-- FUNCTION 1
DROP FUNCTION IF EXISTS dem_ghe_trong;

delimiter \\
CREATE FUNCTION dem_ghe_trong(p_Id_ca_chieu VARCHAR(8))
    RETURNS INT
    DETERMINISTIC
BEGIN
    DECLARE tong_so_ghe INT;
    DECLARE msg VARCHAR(50);

    IF NOT EXISTS (SELECT * FROM SuatChieu WHERE ma_suat_chieu = p_Id_ca_chieu) THEN
        SET msg = CONCAT('Khong tim thay ca chieu co ID: ', p_Id_ca_chieu);
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = msg;
    END IF;

    SELECT
        COUNT(*) INTO tong_so_ghe
    FROM SuatChieu c
             JOIN GheNgoi g ON
        c.ma_phong = g.ma_phong
    WHERE
        c.ma_suat_chieu = p_Id_ca_chieu AND
        g.Trang_thai = 'available'  -- gia su 0 la ghe trong va 1 la ghe da co nguoi
    ;

    RETURN tong_so_ghe;
END \\
DELIMITER ;


-- FUNCTION 2
DROP FUNCTION IF EXISTS tinh_tong_hoa_don;

delimiter \\
CREATE FUNCTION tinh_tong_hoa_don(p_Id_hoa_don VARCHAR(8))
    RETURNS DECIMAL(10, 2)
    DETERMINISTIC
BEGIN
    DECLARE _Id_khuyen_mai VARCHAR(8) DEFAULT NULL;
    DECLARE total_ve DECIMAL(10, 2) DEFAULT 0;
    DECLARE total_do_an DECIMAL(10, 2) DEFAULT 0;
    DECLARE tong_tien DECIMAL(10, 2) DEFAULT 0;
    DECLARE max_so_tien_giam DECIMAL(10, 2) DEFAULT 0;
    DECLARE so_tien_giam DECIMAL(10, 2) DEFAULT 0;
    DECLARE msg VARCHAR(100);

    IF NOT EXISTS (SELECT * FROM HoaDon WHERE ma_hoa_don = p_Id_hoa_don) THEN
        SET msg = CONCAT('Khong tim thay hoa don co ID: ', p_Id_hoa_don);
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = msg;
    END IF;

    SELECT
        hdkm.ma_hoa_don_km INTO _Id_khuyen_mai
    FROM HoaDonKhuyenMai hdkm
    WHERE
        hdkm.ma_hoa_don = p_Id_hoa_don
    ;

    -- Tinh tong gia ve
    SELECT
        SUM(v.Gia_ve) INTO total_ve
    FROM Ve v
    WHERE
        v.ma_hoa_don = p_Id_hoa_don
    ;

    -- Tinh tong do an
    SELECT
        SUM(da.gia_ban) INTO total_do_an
    FROM DoAn da
    WHERE
        da.ma_hoa_don = p_Id_hoa_don
    ;

    -- Tinh so tien duoc giam
    SELECT
        ((total_ve + total_do_an) * (gg.Phan_tram_giam / 100)), gg.gia_toi_da_giam
    INTO so_tien_giam, max_so_tien_giam
    FROM GiamGia gg
    WHERE
        gg.ma_khuyen_mai = _Id_khuyen_mai
    ;

    IF so_tien_giam > max_so_tien_giam THEN
        SET so_tien_giam = max_so_tien_giam;
    END IF;

    SET tong_tien = (total_ve + total_do_an) - so_tien_giam;

    RETURN tong_tien;
END \\
DELIMITER ;

-- FUNCTION 3
DROP FUNCTION IF EXISTS tinh_tong_doanh_thu_phim;

delimiter \\
CREATE FUNCTION tinh_tong_doanh_thu_phim(p_Id_phim VARCHAR(8))
    RETURNS INT
    DETERMINISTIC
BEGIN
    DECLARE tong_doanh_thu INT;
    DECLARE msg VARCHAR(50);

    IF NOT EXISTS(SELECT * FROM Phim WHERE ma_phim = p_Id_phim) THEN
        SET msg = CONCAT('Khong tim thay phim co ID: ', p_Id_phim);
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = msg;
    END IF;

    SELECT
        SUM(v.Gia_ve) INTO tong_doanh_thu
    FROM Phim p
             JOIN SuatChieu c ON
        p.ma_phim = c.ma_phim
             JOIN Ve v ON
        c.ma_suat_chieu = v.ma_suat_chieu
    WHERE
        p.ma_phim = p_Id_phim
    GROUP BY p.ma_phim;

    RETURN tong_doanh_thu;
END \\
DELIMITER ;




















