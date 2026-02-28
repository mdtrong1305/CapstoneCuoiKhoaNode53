import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeatDto, UpdateSeatDto } from './dto/seats.dto';
import { PrismaService } from '../../modules-system/prisma/prisma.service';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) {}

  async getSeatsBySchedule(ma_lich_chieu: number) {
    // tìm thông tin lịch chiếu để biết lịch này thuộc rạp nào
    const lichChieu = await this.prisma.lichChieu.findUnique({
      where: { ma_lich_chieu: ma_lich_chieu },
      include: {
        RapPhim: true,
      },
    });

    if (!lichChieu) {
      throw new NotFoundException('Không tìm thấy lịch chiếu');
    }

    const ma_rap = lichChieu.ma_rap!;

    // lấy tất cả ghế của rạp đó
    const danhSachGhe = await this.prisma.ghe.findMany({
      where: { ma_rap },
      orderBy: { ma_ghe: 'asc' },
    });

    // lấy danh sách các mã ghế đã được đặt cho suất chiếu này
    const veDaDat = await this.prisma.chiTietDatVe.findMany({
      where: {
        DatVe: {
          ma_lich_chieu: ma_lich_chieu,
        },
      },
      select: { ma_ghe: true },
    });

    // chuyển mảng object thành mảng số [1, 2, 3...] để check includes
    const danhSachMaGheDaDat = veDaDat.map((v) => v.ma_ghe);

    // map lại danh sách ghế để thêm trường 'da_dat'
    const result = danhSachGhe.map((ghe) => ({
      ...ghe,
      da_dat: danhSachMaGheDaDat.includes(ghe.ma_ghe),
    }));

    return {
      thong_tin_lich_chieu: {
        ma_lich_chieu: lichChieu.ma_lich_chieu,
        ngay_gio_chieu: lichChieu.ngay_gio_chieu,
        gia_ve: lichChieu.gia_ve,
        ten_rap: lichChieu.RapPhim!.ten_rap,
      },
      danh_sach_ghe: result,
    };
  }

  async create(body: CreateSeatDto) {
    const maRapInt = body.ma_rap;

    const rap = await this.prisma.rapPhim.findUnique({
      where: { ma_rap: maRapInt },
    });
    if (!rap) throw new NotFoundException('Rạp phim không tồn tại');

    const seat = this.prisma.ghe.create({
      data: {
        ten_ghe: body.ten_ghe,
        loai_ghe: body.loai_ghe,
        ma_rap: maRapInt,
      },
    });

    return seat;
  }

  async update(body: UpdateSeatDto) {
    const maGheInt = body.ma_ghe;

    // kiểm tra ghế có tồn tại không
    const ghe = await this.prisma.ghe.findUnique({
      where: { ma_ghe: maGheInt },
    });

    if (!ghe) {
      throw new NotFoundException(`Không tìm thấy ghế có mã ${body.ma_ghe}`);
    }

    // chuẩn bị data để update
    const dataToUpdate: any = {};
    if (body.ten_ghe) dataToUpdate.ten_ghe = body.ten_ghe;
    if (body.loai_ghe) dataToUpdate.loai_ghe = body.loai_ghe;
    
    // tiến hành update
    const updated = await this.prisma.ghe.update({
      where: { ma_ghe: maGheInt },
      data: dataToUpdate,
    });

    return updated;
  }

  async remove(ma_ghe: number) {
    const ghe = await this.prisma.ghe.findUnique({ where: { ma_ghe } });
    if (!ghe) throw new NotFoundException('Không tìm thấy ghế');

    // Kiểm tra xem ghế này đã từng được đặt chưa
    const daDat = await this.prisma.chiTietDatVe.findFirst({
      where: { ma_ghe },
    });
    if (daDat) {
      throw new BadRequestException('Ghế đã có lịch sử đặt vé, không thể xóa!');
    }

    await this.prisma.ghe.delete({ where: { ma_ghe } });
    return true;
  }
}
