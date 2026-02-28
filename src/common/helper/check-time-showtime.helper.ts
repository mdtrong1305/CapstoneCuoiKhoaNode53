import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';

export async function checkShowtimeConflict(
  prisma: PrismaService,
  params: {
    ma_rap: number;
    ngay_gio_chieu_moi: Date;
    ma_phim_moi: number;
    excludeShowtimeId?: number;
  },
) {
  const { ma_rap, ngay_gio_chieu_moi, ma_phim_moi, excludeShowtimeId } = params;

  // lấy thông tin phim mới để lấy thời lượng
  const phimMoi = await prisma.phim.findUnique({ where: { ma_phim: ma_phim_moi } });
  if (!phimMoi) throw new NotFoundException('Phim không tồn tại');

  // lấy tất cả lịch chiếu cùng rạp trong ngày đó
  const startOfDay = new Date(ngay_gio_chieu_moi);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(ngay_gio_chieu_moi);
  endOfDay.setHours(23, 59, 59, 999);

  const existingShowtimes = await prisma.lichChieu.findMany({
    where: {
      ma_rap,
      ngay_gio_chieu: { gte: startOfDay, lte: endOfDay },
      NOT: excludeShowtimeId ? { ma_lich_chieu: excludeShowtimeId } : undefined,
    },
    include: { Phim: true },
  });

  const THOI_GIAN_NGHI = 30 * 60000; // 30 phút tính bằng milliseconds
  const batDauMoiMs = ngay_gio_chieu_moi.getTime();
  const thoiLuongMoiMs = (phimMoi.thoi_luong || 0) * 60000;
  const ketThucMoiKemNghiMs = batDauMoiMs + thoiLuongMoiMs + THOI_GIAN_NGHI;

  for (const showtime of existingShowtimes) {
    const batDauCuMs = new Date(showtime.ngay_gio_chieu!).getTime();
    const thoiLuongCuMs = (showtime.Phim?.thoi_luong || 0) * 60000;
    const ketThucCuKemNghiMs = batDauCuMs + thoiLuongCuMs + THOI_GIAN_NGHI;
    const dateKetThuc = new Date(ketThucCuKemNghiMs);
    // Lấy giờ và phút theo chuẩn UTC
    const hh = String(dateKetThuc.getUTCHours()).padStart(2, '0');
    const mm = String(dateKetThuc.getUTCMinutes()).padStart(2, '0');
    const stringUTC = `${hh}:${mm} UTC+0`;

    // Trường hợp 1: Suất mới bắt đầu khi suất cũ chưa nghỉ xong
    if (batDauMoiMs >= batDauCuMs && batDauMoiMs < ketThucCuKemNghiMs) {
      throw new BadRequestException(
        `Trùng lịch! Suất trước '${showtime.Phim?.ten_phim}' kết thúc + nghỉ lúc ${stringUTC}.`,
      );
    }

    // Trường hợp 2: Suất mới kết thúc đè vào giờ bắt đầu của suất sau đã có lịch
    if (batDauCuMs >= batDauMoiMs && batDauCuMs < ketThucMoiKemNghiMs) {
      throw new BadRequestException(
        `Giờ chiếu này kéo dài đến ${stringUTC} (gồm 30p nghỉ), đè vào suất chiếu tiếp theo của phim '${showtime.Phim?.ten_phim}'.`,
      );
    }
  }
}