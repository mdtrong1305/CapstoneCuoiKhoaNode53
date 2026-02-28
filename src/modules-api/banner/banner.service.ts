import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { deleteFile } from '../../common/helper/delete-file.helper';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Lấy tất cả banner
    const banners = await this.prisma.banner.findMany({
      select: {
        ma_banner: true,
        ma_phim: true,
        hinh_anh: true,
        Phim: {
          select: {
            ten_phim: true,
            hinh_anh: true,
          },
        },
      },
      orderBy: {
        ma_banner: 'asc',
      },
    });

    return {
      data: banners,
      total: banners.length,
    };
  }

  async uploadImage(ma_phim: number, filename: string) {
    // Kiểm tra phim có tồn tại không
    const movie = await this.prisma.phim.findUnique({
      where: { ma_phim },
    });

    if (!movie) {
      throw new NotFoundException('Không tìm thấy phim');
    }

    // Tìm và xóa tất cả banner cũ của phim này
    const oldBanners = await this.prisma.banner.findMany({
      where: { ma_phim },
      select: { ma_banner: true, hinh_anh: true },
    });

    // Xóa file ảnh cũ
    for (const banner of oldBanners) {
      if (banner.hinh_anh) {
        deleteFile(banner.hinh_anh);
      }
    }

    // Xóa records banner cũ khỏi database
    if (oldBanners.length > 0) {
      await this.prisma.banner.deleteMany({
        where: { ma_phim },
      });
    }

    // Lưu path với subfolder: banners/filename
    const imagePath = `banners/${filename}`;

    // Tạo banner mới (ma_banner tự động tạo bởi autoincrement)
    const newBanner = await this.prisma.banner.create({
      data: {
        ma_phim: ma_phim,
        hinh_anh: imagePath,
      },
      select: {
        ma_banner: true,
        ma_phim: true,
        hinh_anh: true,
      },
    });

    return {
      newBanner
    };
  }

  async deleteBanner(ma_banner: number) {
    const banner = await this.prisma.banner.findUnique({
      where: { ma_banner },
    });

    if (!banner) {
      throw new NotFoundException('Không tìm thấy banner');
    }

    // Xóa file ảnh nếu có
    if (banner.hinh_anh) {
      deleteFile(banner.hinh_anh);
    }

    await this.prisma.banner.delete({
      where: { ma_banner },
    });

    return true;
  }
}
