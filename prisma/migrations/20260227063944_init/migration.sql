-- CreateTable
CREATE TABLE `Banner` (
    `ma_banner` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_phim` INTEGER NULL,
    `hinh_anh` VARCHAR(255) NULL,

    INDEX `ma_phim`(`ma_phim`),
    PRIMARY KEY (`ma_banner`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CumRap` (
    `ma_cum_rap` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_cum_rap` VARCHAR(255) NULL,
    `dia_chi` VARCHAR(255) NULL,
    `ma_he_thong_rap` INTEGER NULL,

    INDEX `ma_he_thong_rap`(`ma_he_thong_rap`),
    PRIMARY KEY (`ma_cum_rap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DatVe` (
    `tai_khoan` VARCHAR(191) NOT NULL,
    `ma_lich_chieu` INTEGER NOT NULL,
    `ma_ghe` INTEGER NOT NULL,

    INDEX `ma_ghe`(`ma_ghe`),
    INDEX `ma_lich_chieu`(`ma_lich_chieu`),
    PRIMARY KEY (`tai_khoan`, `ma_lich_chieu`, `ma_ghe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ghe` (
    `ma_ghe` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_ghe` VARCHAR(255) NULL,
    `loai_ghe` VARCHAR(50) NULL,
    `ma_rap` INTEGER NULL,

    INDEX `ma_rap`(`ma_rap`),
    PRIMARY KEY (`ma_ghe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HeThongRap` (
    `ma_he_thong_rap` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_he_thong_rap` VARCHAR(255) NULL,
    `logo` VARCHAR(255) NULL,

    PRIMARY KEY (`ma_he_thong_rap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichChieu` (
    `ma_lich_chiu` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_rap` INTEGER NULL,
    `ma_phim` INTEGER NULL,
    `ngay_gio_chieu` DATETIME(0) NULL,
    `gia_ve` INTEGER NULL,

    INDEX `ma_phim`(`ma_phim`),
    INDEX `ma_rap`(`ma_rap`),
    PRIMARY KEY (`ma_lich_chiu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NguoiDung` (
    `tai_khoan` VARCHAR(191) NOT NULL,
    `ho_ten` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `so_dt` VARCHAR(20) NULL,
    `mat_khau` VARCHAR(255) NULL,
    `loai_nguoi_dung` VARCHAR(50) NULL,

    PRIMARY KEY (`tai_khoan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Phim` (
    `ma_phim` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_phim` VARCHAR(255) NULL,
    `trailer` VARCHAR(255) NULL,
    `hinh_anh` VARCHAR(255) NULL,
    `mo_ta` VARCHAR(1000) NULL,
    `ngay_khoi_chieu` DATE NULL,
    `danh_gia` INTEGER NULL,
    `hot` BOOLEAN NULL,
    `dang_chieau` BOOLEAN NULL,
    `sap_chieu` BOOLEAN NULL,

    PRIMARY KEY (`ma_phim`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RapPhim` (
    `ma_rap` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_rap` VARCHAR(255) NULL,
    `ma_cum_rap` INTEGER NULL,

    INDEX `ma_cum_rap`(`ma_cum_rap`),
    PRIMARY KEY (`ma_rap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Banner` ADD CONSTRAINT `Banner_ibfk_1` FOREIGN KEY (`ma_phim`) REFERENCES `Phim`(`ma_phim`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CumRap` ADD CONSTRAINT `CumRap_ibfk_1` FOREIGN KEY (`ma_he_thong_rap`) REFERENCES `HeThongRap`(`ma_he_thong_rap`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DatVe` ADD CONSTRAINT `DatVe_ibfk_1` FOREIGN KEY (`tai_khoan`) REFERENCES `NguoiDung`(`tai_khoan`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DatVe` ADD CONSTRAINT `DatVe_ibfk_2` FOREIGN KEY (`ma_lich_chieu`) REFERENCES `LichChieu`(`ma_lich_chiu`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DatVe` ADD CONSTRAINT `DatVe_ibfk_3` FOREIGN KEY (`ma_ghe`) REFERENCES `Ghe`(`ma_ghe`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Ghe` ADD CONSTRAINT `Ghe_ibfk_1` FOREIGN KEY (`ma_rap`) REFERENCES `RapPhim`(`ma_rap`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `LichChieu` ADD CONSTRAINT `LichChieu_ibfk_1` FOREIGN KEY (`ma_rap`) REFERENCES `RapPhim`(`ma_rap`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `LichChieu` ADD CONSTRAINT `LichChieu_ibfk_2` FOREIGN KEY (`ma_phim`) REFERENCES `Phim`(`ma_phim`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `RapPhim` ADD CONSTRAINT `RapPhim_ibfk_1` FOREIGN KEY (`ma_cum_rap`) REFERENCES `CumRap`(`ma_cum_rap`) ON DELETE NO ACTION ON UPDATE NO ACTION;
