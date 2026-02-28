-- DropForeignKey
ALTER TABLE `ChiTietDatVe` DROP FOREIGN KEY `ChiTietDatVe_ma_ghe_fkey`;

-- DropForeignKey
ALTER TABLE `DatVe` DROP FOREIGN KEY `DatVe_ma_lich_chieu_fkey`;

-- DropForeignKey
ALTER TABLE `DatVe` DROP FOREIGN KEY `DatVe_tai_khoan_fkey`;

-- DropForeignKey
ALTER TABLE `Ghe` DROP FOREIGN KEY `Ghe_ma_rap_fkey`;

-- DropIndex
DROP INDEX `Ghe_ma_rap_fkey` ON `Ghe`;

-- AddForeignKey
ALTER TABLE `DatVe` ADD CONSTRAINT `DatVe_tai_khoan_fkey` FOREIGN KEY (`tai_khoan`) REFERENCES `NguoiDung`(`tai_khoan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatVe` ADD CONSTRAINT `DatVe_ma_lich_chieu_fkey` FOREIGN KEY (`ma_lich_chieu`) REFERENCES `LichChieu`(`ma_lich_chieu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietDatVe` ADD CONSTRAINT `ChiTietDatVe_ma_ghe_fkey` FOREIGN KEY (`ma_ghe`) REFERENCES `Ghe`(`ma_ghe`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ghe` ADD CONSTRAINT `Ghe_ma_rap_fkey` FOREIGN KEY (`ma_rap`) REFERENCES `RapPhim`(`ma_rap`) ON DELETE CASCADE ON UPDATE CASCADE;
