import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateHeThongRapDto, UpdateHeThongRapDto, CreateCumRap, UpdateCumRap, CreateRapPhim, UpdateRapPhim } from './dto/systems.dto';
import { deleteFile } from '../../common/helper/delete-file.helper';

@Injectable()
export class SystemsService {
  constructor(private prisma: PrismaService) {}

  async createHeThongRap(body: CreateHeThongRapDto, logoFilename: string) {
    // Lưu path với subfolder: cinema-system/filename
    const imagePath = `cinema-system/${logoFilename}`;
    const heThongRap = await this.prisma.heThongRap.create({
      data: {
        ten_he_thong_rap: body.ten_he_thong_rap,
        logo: imagePath,
      },
    });

    return heThongRap;
  }

  async updateHeThongRap(body: UpdateHeThongRapDto, logoFilename?: string) {
    const ma_he_thong_rap = parseInt(body.ma_he_thong_rap);
    // Lưu path với subfolder: cinema-system/filename
    const imagePath = `cinema-system/${logoFilename}`;
    // Kiểm tra hệ thống rạp có tồn tại không
    const heThongRap = await this.prisma.heThongRap.findUnique({
      where: { ma_he_thong_rap },
    });

    if (!heThongRap) {
      // nếu không tìm thấy hệ thống rạp, xóa file logo mới vừa upload nếu có
      deleteFile(imagePath)
      throw new NotFoundException('Không tìm thấy hệ thống rạp');
    }

    // Nếu có logo mới, xóa logo cũ
    if (logoFilename && heThongRap!.logo) {
      deleteFile(heThongRap!.logo);
    }

    // Chuẩn bị data để update
    const dataToUpdate: any = {};
    if (body.ten_he_thong_rap) {
      dataToUpdate.ten_he_thong_rap = body.ten_he_thong_rap;
    }
    if (logoFilename) {
      dataToUpdate.logo = imagePath;
    }

    const updated = await this.prisma.heThongRap.update({
      where: { ma_he_thong_rap },
      data: dataToUpdate,
    });

    return updated;
  }

  async deleteHeThongRap(ma_he_thong_rap: number) {
    const heThongRap = await this.prisma.heThongRap.findUnique({
      where: { ma_he_thong_rap },
    });

    if (!heThongRap) {
      throw new NotFoundException('Không tìm thấy hệ thống rạp');
    }

    // Xóa logo nếu có
    if (heThongRap.logo) {
      deleteFile(heThongRap.logo);
    }

    await this.prisma.heThongRap.delete({
      where: { ma_he_thong_rap },
    });

    return true;
  }

  async findAll() {
    const data = await this.prisma.heThongRap.findMany({
      orderBy: {
        ma_he_thong_rap: 'asc',
      },
    });

    return {
      data,
      total: data.length,
    };
  }

  async createCinemaComplex(body: CreateCumRap) {
    const ma_he_thong_rap = parseInt(body.ma_he_thong_rap);

    // Kiểm tra hệ thống rạp có tồn tại không
    const heThongRap = await this.prisma.heThongRap.findUnique({
      where: { ma_he_thong_rap },
    });

    if (!heThongRap) {
      throw new NotFoundException('Không tìm thấy hệ thống rạp');
    }

    const cinemaComplex = await this.prisma.cumRap.create({
      data: {
        ten_cum_rap: body.ten_cum_rap,
        dia_chi: body.dia_chi,
        ma_he_thong_rap,
      },
    });

    return cinemaComplex;
  }

  async updateCinemaComplex(body: UpdateCumRap) {
    const ma_cum_rap = parseInt(body.ma_cum_rap);

    // Kiểm tra cụm rạp có tồn tại không
    const cumRap = await this.prisma.cumRap.findUnique({
      where: { ma_cum_rap },
    });

    if (!cumRap) {
      throw new NotFoundException('Không tìm thấy cụm rạp');
    }

    // Nếu có ma_he_thong_rap mới, kiểm tra có tồn tại không
    if (body.ma_he_thong_rap) {
      const ma_he_thong_rap = parseInt(body.ma_he_thong_rap);
      const heThongRap = await this.prisma.heThongRap.findUnique({
        where: { ma_he_thong_rap },
      });

      if (!heThongRap) {
        throw new NotFoundException('Không tìm thấy hệ thống rạp');
      }
    }

    // Chuẩn bị data để update
    const dataToUpdate: any = {};
    if (body.ten_cum_rap) dataToUpdate.ten_cum_rap = body.ten_cum_rap;
    if (body.dia_chi) dataToUpdate.dia_chi = body.dia_chi;
    if (body.ma_he_thong_rap) dataToUpdate.ma_he_thong_rap = parseInt(body.ma_he_thong_rap);

    const updated = await this.prisma.cumRap.update({
      where: { ma_cum_rap },
      data: dataToUpdate,
    });

    return updated;
  }

  async deleteCinemaComplex(ma_cum_rap: number) {
    const cumRap = await this.prisma.cumRap.findUnique({
      where: { ma_cum_rap },
    });

    if (!cumRap) {
      throw new NotFoundException('Không tìm thấy cụm rạp');
    }

    await this.prisma.cumRap.delete({
      where: { ma_cum_rap },
    });

    return true;
  }

  async getCinemaComplexesBySystemId(ma_he_thong_rap: number) {
    // Kiểm tra hệ thống rạp có tồn tại không
    const heThongRap = await this.prisma.heThongRap.findUnique({
      where: { ma_he_thong_rap },
    });

    if (!heThongRap) {
      throw new NotFoundException('Không tìm thấy hệ thống rạp');
    }

    const data = await this.prisma.cumRap.findMany({
      where: { ma_he_thong_rap },
      orderBy: {
        ma_cum_rap: 'asc',
      },
      include: {
        HeThongRap: {
          select: {
            ma_he_thong_rap: true,
            ten_he_thong_rap: true,
            logo: true,
          },
        },
      },
    });

    return {
      data,
      total: data.length,
    };
  }

  async createCinema(body: CreateRapPhim) {
    const ma_cum_rap = parseInt(body.ma_cum_rap);

    // Kiểm tra cụm rạp có tồn tại không
    const cumRap = await this.prisma.cumRap.findUnique({
      where: { ma_cum_rap },
    });

    if (!cumRap) {
      throw new NotFoundException('Không tìm thấy cụm rạp');
    }

    const cinema = await this.prisma.rapPhim.create({
      data: {
        ten_rap: body.ten_rap,
        ma_cum_rap,
      },
    });

    return cinema;
  }

  async updateCinema(body: UpdateRapPhim) {
    const ma_rap = parseInt(body.ma_rap);

    // Kiểm tra rạp có tồn tại không
    const rapPhim = await this.prisma.rapPhim.findUnique({
      where: { ma_rap },
    });

    if (!rapPhim) {
      throw new NotFoundException('Không tìm thấy rạp');
    }

    // Nếu có ma_cum_rap mới, kiểm tra có tồn tại không
    if (body.ma_cum_rap) {
      const ma_cum_rap = parseInt(body.ma_cum_rap);
      const cumRap = await this.prisma.cumRap.findUnique({
        where: { ma_cum_rap },
      });

      if (!cumRap) {
        throw new NotFoundException('Không tìm thấy cụm rạp');
      }
    }

    // Chuẩn bị data để update
    const dataToUpdate: any = {};
    if (body.ten_rap) dataToUpdate.ten_rap = body.ten_rap;
    if (body.ma_cum_rap) dataToUpdate.ma_cum_rap = parseInt(body.ma_cum_rap);

    const updated = await this.prisma.rapPhim.update({
      where: { ma_rap },
      data: dataToUpdate,
    });

    return updated;
  }

  async deleteCinema(ma_rap: number) {
    const rapPhim = await this.prisma.rapPhim.findUnique({
      where: { ma_rap },
    });

    if (!rapPhim) {
      throw new NotFoundException('Không tìm thấy rạp');
    }

    await this.prisma.rapPhim.delete({
      where: { ma_rap },
    });

    return true;
  }

  async getCinemasByComplexId(ma_cum_rap: number) {
    // Kiểm tra cụm rạp có tồn tại không
    const cumRap = await this.prisma.cumRap.findUnique({
      where: { ma_cum_rap },
    });

    if (!cumRap) {
      throw new NotFoundException('Không tìm thấy cụm rạp');
    }

    const data = await this.prisma.rapPhim.findMany({
      where: { ma_cum_rap },
      orderBy: {
        ma_rap: 'asc',
      },
      include: {
        CumRap: {
          select: {
            ma_cum_rap: true,
            ten_cum_rap: true,
            dia_chi: true,
            ma_he_thong_rap: true,
          },
        },
      },
    });

    return {
      data,
      total: data.length,
    };
  }
}
