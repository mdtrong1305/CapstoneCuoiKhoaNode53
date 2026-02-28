import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { buildQueryPrisma } from '../../common/helper/build-query-prisma.helper';
import { deleteFile } from '../../common/helper/delete-file.helper';
import { CreateMovieDto, CreateShowtimeDto, UpdateMovieDto, UpdateShowtimeDto } from './dto/movies.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { page, pageSize, where, index } = buildQueryPrisma(query);

    // Lấy danh sách phim
    const movies = await this.prisma.phim.findMany({
      where,
      skip: index,
      take: Number(pageSize),
      select: {
        ma_phim: true,
        ten_phim: true,
        trailer: true,
        hinh_anh: true,
        mo_ta: true,
        ngay_khoi_chieu: true,
        danh_gia: true,
        hot: true,
        dang_chieau: true,
        sap_chieu: true,
      },
    });

    // Đếm tổng số records
    const total = await this.prisma.phim.count({ where });

    return {
      data: movies,
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      totalPages: Math.ceil(total / Number(pageSize)),
    };
  }

  async createMovie(data: CreateMovieDto, filename: string) {
    // Lưu path với subfolder: movies/filename
    const imagePath = `movies/${filename}`;

    // Parse data
    const movieData = {
      ten_phim: data.ten_phim,
      trailer: data.trailer,
      mo_ta: data.mo_ta,
      ngay_khoi_chieu: new Date(data.ngay_khoi_chieu),
      danh_gia: Number(data.danh_gia),
      hot: data.hot === 'true',
      dang_chieau: data.dang_chieau === 'true',
      sap_chieu: data.sap_chieu === 'true',
      hinh_anh: imagePath,
    };

    // Tạo phim mới
    const newMovie = await this.prisma.phim.create({
      data: movieData,
      select: {
        ma_phim: true,
        ten_phim: true,
        trailer: true,
        hinh_anh: true,
        mo_ta: true,
        ngay_khoi_chieu: true,
        danh_gia: true,
        hot: true,
        dang_chieau: true,
        sap_chieu: true,
      },
    });

    return newMovie;
  }

  async updateMovie(data: UpdateMovieDto, filename?: string) {
    const ma_phim = Number(data.ma_phim);
    const imagePath = `movies/${filename}`;
    // Kiểm tra phim có tồn tại không
    const movie = await this.prisma.phim.findUnique({
      where: { ma_phim },
    });

    if (!movie) {
      // nếu không tìm thấy phim, xóa file ảnh mới vừa upload nếu có
      deleteFile(imagePath);
      throw new NotFoundException('Không tìm thấy phim');
    }

    // Build update data (chỉ update các field có giá trị)
    const updateData: any = {};

    if (data.ten_phim) updateData.ten_phim = data.ten_phim;
    if (data.trailer) updateData.trailer = data.trailer;
    if (data.mo_ta) updateData.mo_ta = data.mo_ta;
    if (data.ngay_khoi_chieu)
      updateData.ngay_khoi_chieu = new Date(data.ngay_khoi_chieu);
    if (data.danh_gia) updateData.danh_gia = Number(data.danh_gia);
    if (data.hot !== undefined) updateData.hot = data.hot === 'true';
    if (data.dang_chieau !== undefined)
      updateData.dang_chieau = data.dang_chieau === 'true';
    if (data.sap_chieu !== undefined)
      updateData.sap_chieu = data.sap_chieu === 'true';

    // Nếu có upload ảnh mới
    if (filename) {
      // Xóa ảnh cũ nếu có
      if (movie.hinh_anh) {
        deleteFile(movie.hinh_anh);
      }
      updateData.hinh_anh = `movies/${filename}`;
    }

    // Cập nhật phim
    const updatedMovie = await this.prisma.phim.update({
      where: { ma_phim },
      data: updateData,
      select: {
        ma_phim: true,
        ten_phim: true,
        trailer: true,
        hinh_anh: true,
        mo_ta: true,
        ngay_khoi_chieu: true,
        danh_gia: true,
        hot: true,
        dang_chieau: true,
        sap_chieu: true,
      },
    });

    return updatedMovie;
  }

  async deleteMovie(ma_phim: number) {
    // Kiểm tra phim có tồn tại không
    const movie = await this.prisma.phim.findUnique({
      where: { ma_phim },
    });

    if (!movie) {
      throw new NotFoundException('Không tìm thấy phim');
    }

    // Xóa ảnh nếu có
    if (movie.hinh_anh) {
      deleteFile(movie.hinh_anh);
    }

    // Xóa phim khỏi database
    await this.prisma.phim.delete({
      where: { ma_phim },
    });

    return true;
  }

  async getShowtimesByMovie(ma_phim: number) {
    const phimInfo = await this.prisma.phim.findUnique({
      where: { ma_phim },
    });

    if (!phimInfo) {
      throw new NotFoundException('Không tìm thấy phim');
    }

    const showtimes = await this.prisma.lichChieu.findMany({
      where: { ma_phim },
      orderBy: { ngay_gio_chieu: 'asc' },
      include: {
        RapPhim: {
          include: {
            CumRap: {
              include: {
                HeThongRap: true,
              },
            },
          },
        },
        Phim: true,
      },
    });

    const heThongRapResult: any[] = [];
    // sử dụng forEach để duyệt qua tất cả lịch chiếu
    showtimes.forEach((lc) => {
      const rapPhim = lc.RapPhim;

      const cumRap = rapPhim?.CumRap;
      const heThongRap = cumRap?.HeThongRap;

      if (!rapPhim || !cumRap || !heThongRap) {
        return;
      }
      // tìm hệ thống rạp trong kết quả đã có, nếu chưa có thì tạo mới, nếu đã có thì dùng lại
      let htrEntry = heThongRapResult.find(
        (h) => h.ma_he_thong_rap === heThongRap.ma_he_thong_rap,
      );
      // chưa có hệ thống rạp này trong kết quả, tạo mới và đẩy vào mảng kết quả
      if (!htrEntry) {
        htrEntry = {
          ma_he_thong_rap: heThongRap.ma_he_thong_rap,
          ten_he_thong_rap: heThongRap.ten_he_thong_rap,
          logo: heThongRap.logo,
          cum_rap_chieu: [],
        };
        heThongRapResult.push(htrEntry);
      }
      // tìm cụm rạp trong mảng cum_rap_chieu của hệ thống rạp này, nếu chưa có thì tạo mới, nếu đã có thì dùng lại
      let cumRapEntry = htrEntry.cum_rap_chieu.find(
        (c: any) => c.ma_cum_rap === cumRap.ma_cum_rap,
      );
      // chưa có cụm rạp này trong hệ thống rạp, tạo mới và đẩy vào mảng cum_rap_chieu
      if (!cumRapEntry) {
        cumRapEntry = {
          ma_cum_rap: cumRap.ma_cum_rap,
          ten_cum_rap: cumRap.ten_cum_rap,
          dia_chi: cumRap.dia_chi,
          lich_chieu_phim: [],
        };
        htrEntry.cum_rap_chieu.push(cumRapEntry);
      }
      // đẩy lịch chiếu vào mảng cuối cùng
      cumRapEntry.lich_chieu_phim.push({
        ma_lich_chiu: lc.ma_lich_chiu,
        ma_rap: lc.ma_rap,
        ten_rap: rapPhim.ten_rap,
        ngay_gio_chieu: lc.ngay_gio_chieu,
        gia_ve: lc.gia_ve,
      });
    });

    return {
      ma_phim: phimInfo.ma_phim,
      ten_phim: phimInfo.ten_phim,
      hinh_anh: phimInfo.hinh_anh,
      he_thong_rap_chieu: heThongRapResult,
    };
  }

  async getShowtimesByCinema(ma_rap: number) {
    // Kiểm tra rạp có tồn tại không
    const rapPhim = await this.prisma.rapPhim.findUnique({
      where: { ma_rap },
    });

    if (!rapPhim) {
      throw new NotFoundException('Không tìm thấy rạp');
    }

    const showtimes = await this.prisma.lichChieu.findMany({
      where: { ma_rap },
      orderBy: {
        ngay_gio_chieu: 'asc',
      },
      include: {
        Phim: {
          select: {
            ma_phim: true,
            ten_phim: true,
            hinh_anh: true,
            trailer: true,
            mo_ta: true,
            ngay_khoi_chieu: true,
            danh_gia: true,
          },
        },
      },
    });

    const lichChieu = showtimes.map((item) => ({
      ...item,
      thong_tin_phim: item.Phim,
      Phim: undefined,
    }));

    return {
      data: lichChieu,
      total: lichChieu.length,
    };
  }

  async createShowtime(data: CreateShowtimeDto) {
    const ma_rap = parseInt(data.ma_rap);
    const ma_phim = parseInt(data.ma_phim);
    const gia_ve = parseInt(data.gia_ve);
    const ngay_gio_chieu = new Date(data.ngay_gio_chieu);

    // kiểm tra rạp có tồn tại không
    const rapPhim = await this.prisma.rapPhim.findUnique({ where: { ma_rap } });
    if (!rapPhim) throw new NotFoundException('Không tìm thấy rạp');

    // kiểm tra phim có tồn tại không
    const phim = await this.prisma.phim.findUnique({ where: { ma_phim } });
    if (!phim) throw new NotFoundException('Không tìm thấy phim');

    // kiểm tra trùng: chỉ cần trùng rạp và ngày giờ chiếu, bất kể phim nào
    const isDuplicate = await this.prisma.lichChieu.findFirst({
      where: {
        ma_rap,
        ngay_gio_chieu,
      },
    });

    if (isDuplicate) {
      throw new BadRequestException(
        'Lịch chiếu này đã tồn tại (Trùng rạp và thời gian, không được phép tạo mới)',
      );
    }

    // tạo lịch chiếu mới
    const showtime = await this.prisma.lichChieu.create({
      data: {
        ma_rap,
        ma_phim,
        ngay_gio_chieu,
        gia_ve,
      },
      include: {
        RapPhim: {
          select: {
            ma_rap: true,
            ten_rap: true,
            CumRap: { select: { ten_cum_rap: true, dia_chi: true } },
          },
        },
        Phim: { select: { ma_phim: true, ten_phim: true, hinh_anh: true } },
      },
    });

    // Đổi tên trường Phim -> thong_tin_phim, RapPhim -> thong_tin_rap, CumRap -> thong_tin_cum
    const { Phim, RapPhim, ...rest } = showtime;
    let thong_tin_rap: any = RapPhim ? { ...RapPhim } : null;
    if (thong_tin_rap && thong_tin_rap.CumRap) {
      thong_tin_rap.thong_tin_cum = thong_tin_rap.CumRap;
      delete thong_tin_rap.CumRap;
    }
    return {
      ...rest,
      thong_tin_rap,
      thong_tin_phim: Phim,
    };
  }

  async updateShowtime(data: UpdateShowtimeDto) {
    const ma_lich_chiu = Number(data.ma_lich_chiu);

    // kiểm tra lịch chiếu có tồn tại không
    const currentShowtime = await this.prisma.lichChieu.findUnique({
      where: { ma_lich_chiu },
    });

    if (!currentShowtime) {
      throw new NotFoundException('Không tìm thấy lịch chiếu');
    }

    // build update data (chỉ update các field có giá trị truyền vào)
    const updateData: any = {};

    if (data.ma_rap) updateData.ma_rap = Number(data.ma_rap);
    if (data.ma_phim) updateData.ma_phim = Number(data.ma_phim);
    if (data.ngay_gio_chieu) updateData.ngay_gio_chieu = new Date(data.ngay_gio_chieu);
    if (data.gia_ve) updateData.gia_ve = Number(data.gia_ve);

    // kiểm tra tính hợp lệ của Rạp và Phim nếu có thay đổi
    if (updateData.ma_rap) {
      const rap = await this.prisma.rapPhim.findUnique({ where: { ma_rap: updateData.ma_rap } });
      if (!rap) throw new NotFoundException('Không tìm thấy rạp mới');
    }

    if (updateData.ma_phim) {
      const phim = await this.prisma.phim.findUnique({ where: { ma_phim: updateData.ma_phim } });
      if (!phim) throw new NotFoundException('Không tìm thấy phim mới');
    }

    // KIỂM TRA TRÙNG LỊCH (Trùng Phim, Rạp, Thời gian tại bản ghi khác)
    // Lấy các giá trị mới hoặc giữ nguyên giá trị cũ để so sánh trùng lặp
    const check_ma_rap = updateData.ma_rap || currentShowtime.ma_rap;
    const check_ngay_gio = updateData.ngay_gio_chieu || currentShowtime.ngay_gio_chieu;

    const isDuplicate = await this.prisma.lichChieu.findFirst({
      where: {
        ma_rap: check_ma_rap,
        ngay_gio_chieu: check_ngay_gio,
        NOT: {
          ma_lich_chiu: ma_lich_chiu, // loại trừ chính nó
        },
      },
    });

    if (isDuplicate) {
      throw new BadRequestException('Lịch chiếu này đã tồn tại (Trùng rạp và thời gian, không được phép cập nhật)');
    }

    // cập nhật lịch chiếu
    const updatedShowtime = await this.prisma.lichChieu.update({
      where: { ma_lich_chiu },
      data: updateData,
      include: {
        RapPhim: {
          select: {
            ma_rap: true,
            ten_rap: true,
            CumRap: { select: { ten_cum_rap: true, dia_chi: true } },
          },
        },
        Phim: { select: { ma_phim: true, ten_phim: true, hinh_anh: true } },
      },
    });

    // Đổi tên trường Phim -> thong_tin_phim, RapPhim -> thong_tin_rap, CumRap -> thong_tin_cum
    const { Phim, RapPhim, ...rest } = updatedShowtime;
    let thong_tin_rap: any = RapPhim ? { ...RapPhim } : null;
    if (thong_tin_rap && thong_tin_rap.CumRap) {
      thong_tin_rap.thong_tin_cum = thong_tin_rap.CumRap;
      delete thong_tin_rap.CumRap;
    }
    return {
      ...rest,
      thong_tin_rap,
      thong_tin_phim: Phim,
    };
  }

  async deleteShowtime(ma_lich_chiu: number) {
    // kiểm tra lịch chiếu tồn tại
    const showtime = await this.prisma.lichChieu.findUnique({
      where: { ma_lich_chiu },
    });

    if (!showtime) {
      throw new NotFoundException('Không tìm thấy lịch chiếu');
    }

    // xóa lịch chiếu
    await this.prisma.lichChieu.delete({
      where: { ma_lich_chiu },
    });

    return true;
  }
}
