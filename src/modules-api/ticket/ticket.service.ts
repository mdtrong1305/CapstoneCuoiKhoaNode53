import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { DatVeDto } from './dto/ticket.dto';
import { NguoiDung } from '../../modules-system/prisma/generated/prisma/client';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async getHistoryByUser(nguoiDung: NguoiDung) {
    const tai_khoan = nguoiDung.tai_khoan;
    if (!tai_khoan) {
      throw new BadRequestException('Không tìm thấy thông tin tài khoản');
    }
    const data = await this.prisma.datVe.findMany({
      where: { tai_khoan },
      include: {
        LichChieu: {
          include: {
            Phim: true,
            RapPhim: { include: { CumRap: true } },
          },
        },
        ChiTietDatVe: {
          include: {
            Ghe: true,
          },
        },
      },
      orderBy: { ngay_dat: 'desc' },
    });

    return data.map((item) => {
      // trích xuất thông tin lịch chiếu để gộp vào phần thông tin vé, tránh lặp thông tin phim và rạp
      const { Phim, RapPhim, ...restLichChieu } = item.LichChieu;

      return {
        ma_dat_ve: item.ma_dat_ve,
        ngay_dat: item.ngay_dat,
        thong_tin_lich_chieu: {
          ...restLichChieu,
          thong_tin_phim: Phim,
          thong_tin_rap: RapPhim,
        },
        danh_sach_ghe: item.ChiTietDatVe.map((ct) => ({
          ten_ghe: ct.Ghe.ten_ghe,
          loai_ghe: ct.Ghe.loai_ghe,
        })),
        tong_tien: item.ChiTietDatVe.length * item.LichChieu.gia_ve!,
      };
    });
  }

  async getTicketDetail(ma_dat_ve: number, nguoiDung: NguoiDung) {
    const ticket = await this.prisma.datVe.findUnique({
      where: { ma_dat_ve },
      include: {
        LichChieu: {
          include: {
            Phim: true,
            RapPhim: { include: { CumRap: true } },
          },
        },
        ChiTietDatVe: {
          include: {
            Ghe: true,
          },
        },
      },
    });

    // kiểm tra vé có tồn tại và thuộc về người dùng đang đăng nhập hay không
    if (!ticket || ticket.tai_khoan !== nguoiDung.tai_khoan)
      throw new NotFoundException('Không tìm thấy thông tin vé');

    // trích xuất Phim và RapPhim ra để loại bỏ chúng khỏi object restLichChieu
    const { Phim, RapPhim, ...restLichChieu } = ticket.LichChieu;

    return {
      ma_dat_ve: ticket.ma_dat_ve,
      ngay_dat: ticket.ngay_dat,
      thong_tin_lich_chieu: {
        ...restLichChieu,
        thong_tin_phim: Phim,
        thong_tin_rap: RapPhim,
      },
      danh_sach_ghe: ticket.ChiTietDatVe.map((ct) => ({
        ten_ghe: ct.Ghe.ten_ghe,
        loai_ghe: ct.Ghe.loai_ghe,
      })),
      tong_tien: ticket.ChiTietDatVe.length * ticket.LichChieu.gia_ve!,
    };
  }

  async datVe(user: NguoiDung, body: DatVeDto) {
    const { ma_lich_chieu, danh_sach_ghe } = body;
    const tai_khoan = user.tai_khoan;

    // kiểm tra suất chiếu tồn tại và lấy mã rạp của suất chiếu đó
    const lichChieu = await this.prisma.lichChieu.findUnique({
      where: { ma_lich_chieu: ma_lich_chieu },
      select: { ma_rap: true },
    });

    if (!lichChieu) {
      throw new NotFoundException('Suất chiếu không tồn tại');
    }

    const ma_rap_cua_suat_chieu = lichChieu.ma_rap;

    // kiểm tra xem tất cả mã ghế gửi lên có thuộc rạp của suất chiếu này không
    const gheHopLe = await this.prisma.ghe.findMany({
      where: {
        ma_ghe: { in: danh_sach_ghe },
        ma_rap: ma_rap_cua_suat_chieu!, // Ghế phải thuộc rạp của suất chiếu
      },
      select: { ma_ghe: true },
    });

    if (gheHopLe.length !== danh_sach_ghe.length) {
      // lấy ra danh sách các mã ghế hợp lệ (dạng array số)
      const arrayMaGheHopLe = gheHopLe.map((g) => g.ma_ghe);
      const danhSachGheLoi = danh_sach_ghe.filter(
        (ma_ghe) => !arrayMaGheHopLe.includes(Number(ma_ghe)),
      );

      throw new BadRequestException(
        `Các mã ghế sau không tồn tại trong sơ đồ rạp của suất chiếu này: ${danhSachGheLoi.join(', ')}`,
      );
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        // kiểm tra xem các ghế này đã có ai đặt cho suất chiếu này chưa
        const gheViPham = await tx.chiTietDatVe.findMany({
          where: {
            ma_ghe: { in: danh_sach_ghe },
            DatVe: {
              ma_lich_chieu: ma_lich_chieu,
            },
          },
          include: {
            Ghe: true,
          },
        });

        if (gheViPham.length > 0) {
          const danhSachTenGhe = gheViPham
            .map((item) => item.Ghe.ten_ghe)
            .join(', ');
          throw new BadRequestException(
            `Các ghế sau đã có người đặt: ${danhSachTenGhe}. Vui lòng chọn ghế khác!`,
          );
        }

        // tạo đơn đặt vé
        const donHang = await tx.datVe.create({
          data: {
            tai_khoan,
            ma_lich_chieu,
          },
        });

        // lưu chi tiết ghế đặt
        await tx.chiTietDatVe.createMany({
          data: danh_sach_ghe.map((ma_ghe) => ({
            ma_dat_ve: donHang.ma_dat_ve,
            ma_ghe: ma_ghe,
          })),
        });

        return {
          message: 'Đặt vé thành công',
          ma_dat_ve: donHang.ma_dat_ve,
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
