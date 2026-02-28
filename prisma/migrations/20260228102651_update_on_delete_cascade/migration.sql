-- DropForeignKey
ALTER TABLE `Banner` DROP FOREIGN KEY `Banner_ibfk_1`;

-- DropForeignKey
ALTER TABLE `CumRap` DROP FOREIGN KEY `CumRap_ibfk_1`;

-- DropForeignKey
ALTER TABLE `LichChieu` DROP FOREIGN KEY `LichChieu_ibfk_1`;

-- DropForeignKey
ALTER TABLE `LichChieu` DROP FOREIGN KEY `LichChieu_ibfk_2`;

-- DropForeignKey
ALTER TABLE `RapPhim` DROP FOREIGN KEY `RapPhim_ibfk_1`;

-- AddForeignKey
ALTER TABLE `Banner` ADD CONSTRAINT `Banner_ibfk_1` FOREIGN KEY (`ma_phim`) REFERENCES `Phim`(`ma_phim`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CumRap` ADD CONSTRAINT `CumRap_ibfk_1` FOREIGN KEY (`ma_he_thong_rap`) REFERENCES `HeThongRap`(`ma_he_thong_rap`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `LichChieu` ADD CONSTRAINT `LichChieu_ibfk_1` FOREIGN KEY (`ma_rap`) REFERENCES `RapPhim`(`ma_rap`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `LichChieu` ADD CONSTRAINT `LichChieu_ibfk_2` FOREIGN KEY (`ma_phim`) REFERENCES `Phim`(`ma_phim`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `RapPhim` ADD CONSTRAINT `RapPhim_ibfk_1` FOREIGN KEY (`ma_cum_rap`) REFERENCES `CumRap`(`ma_cum_rap`) ON DELETE CASCADE ON UPDATE NO ACTION;
