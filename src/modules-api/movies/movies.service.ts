import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { buildQueryPrisma } from '../../common/helper/build-query-prisma.helper';
import { deleteFile } from '../../common/helper/delete-file.helper';
import {
  CreateMovieDto,
  CreateShowtimeDto,
  UpdateMovieDto,
  UpdateShowtimeDto,
} from './dto/movies.dto';
import { checkShowtimeConflict } from '../../common/helper/check-time-showtime.helper';

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
        thoi_luong: true,
        hot: true,
        dang_chieu: true,
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
      thoi_luong: Number(data.thoi_luong),
      hot: data.hot === 'true',
      dang_chieu: data.dang_chieu === 'true',
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
        dang_chieu: true,
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
    if (data.thoi_luong) updateData.thoi_luong = Number(data.thoi_luong);
    if (data.hot !== undefined) updateData.hot = data.hot === 'true';
    if (data.dang_chieu !== undefined)
      updateData.dang_chieu = data.dang_chieu === 'true';
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
        dang_chieu: true,
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
        ma_lich_chieu: lc.ma_lich_chieu,
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

  async getShowtimesByCinemaComplex(ma_cum_rap: number) {
    // tìm cụm rạp và lôi hết các rạp con + lịch chiếu của rạp đó ra
    const cumRap = await this.prisma.cumRap.findUnique({
      where: { ma_cum_rap },
      include: {
        RapPhim: {
          include: {
            LichChieu: {
              include: {
                Phim: true, // Để lấy tên phim, hình ảnh...
              },
            },
          },
        },
      },
    });

    if (!cumRap) {
      throw new NotFoundException('Không tìm thấy cụm rạp');
    }

    // gom tất cả lịch chiếu của các rạp con lại
    const danh_sach_lich_chieu = cumRap.RapPhim.flatMap((rap) => {
      return rap.LichChieu.map((lich) => {
        const { Phim, ...restLichChieu } = lich;
        return {
          ...restLichChieu,
          ten_rap: rap.ten_rap,
          ma_rap: rap.ma_rap,
          thong_tin_phim: Phim,
        };
      });
    });

    return {
      thong_tin_cum_rap: {
        ma_cum_rap: cumRap.ma_cum_rap,
        ten_cum_rap: cumRap.ten_cum_rap,
        dia_chi: cumRap.dia_chi,
      },
      danh_sach_lich_chieu: danh_sach_lich_chieu,
    };
  }

  async createShowtime(body: CreateShowtimeDto) {
    const { ma_phim, ma_rap, ngay_gio_chieu, gia_ve } = body;
    const ngayChieuDate = new Date(ngay_gio_chieu);
    // kiểm tra nếu ngày giờ chiếu bé hơn ngày hiện tại thì không cho tạo
    if (ngayChieuDate < new Date()) {
      throw new BadRequestException('Ngày giờ chiếu phải lớn hơn hiện tại');
    }
    // Gọi hàm helper trực tiếp
    await checkShowtimeConflict(this.prisma, {
      ma_rap,
      ngay_gio_chieu_moi: ngayChieuDate,
      ma_phim_moi: ma_phim,
    });

    return this.prisma.lichChieu.create({
      data: { ma_phim, ma_rap, ngay_gio_chieu: ngayChieuDate, gia_ve },
    });
  }

  async updateShowtime(data: UpdateShowtimeDto) {
    // lấy mã lịch chiếu (Lưu ý: Schema của cậu dùng ma_lich_chiu)
    const ma_lich_chieu = data.ma_lich_chieu;
    // kiểm tra nếu ngày giờ chiếu bé hơn ngày hiện tại thì không cho tạo
    if (data.ngay_gio_chieu) {
      const ngayChieuDate = new Date(data.ngay_gio_chieu);
      if (ngayChieuDate < new Date()) {
        throw new BadRequestException('Ngày giờ chiếu phải lớn hơn hiện tại');
      }
    }
    // kiểm tra lịch chiếu hiện tại có tồn tại không
    const currentShowtime = await this.prisma.lichChieu.findUnique({
      where: { ma_lich_chieu },
    });

    if (!currentShowtime) {
      throw new NotFoundException('Không tìm thấy lịch chiếu');
    }

    // chuẩn bị dữ liệu cập nhật
    const updateData: any = {};
    if (data.ma_rap) updateData.ma_rap = data.ma_rap;
    if (data.ma_phim) updateData.ma_phim = data.ma_phim;
    if (data.gia_ve) updateData.gia_ve = data.gia_ve;
    if (data.ngay_gio_chieu)
      updateData.ngay_gio_chieu = new Date(data.ngay_gio_chieu);

    // xác định các giá trị cuối cùng (mới hoặc cũ) để kiểm tra xung đột
    const finalMaRap = updateData.ma_rap || currentShowtime.ma_rap;
    const finalMaPhim = updateData.ma_phim || currentShowtime.ma_phim;
    const finalNgayChieu =
      updateData.ngay_gio_chieu || new Date(currentShowtime.ngay_gio_chieu!);

    // GỌI HELPER: Kiểm tra trùng lịch và khoảng nghỉ 30 phút
    // Truyền excludeShowtimeId để không tự check xung đột với chính bản ghi đang sửa
    await checkShowtimeConflict(this.prisma, {
      ma_rap: finalMaRap,
      ngay_gio_chieu_moi: finalNgayChieu,
      ma_phim_moi: finalMaPhim,
      excludeShowtimeId: ma_lich_chieu,
    });

    // tiến hành cập nhật vào database
    const updatedShowtime = await this.prisma.lichChieu.update({
      where: { ma_lich_chieu },
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

    // format lại dữ liệu trả về cho Frontend
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

  async deleteShowtime(ma_lich_chieu: number) {
    // kiểm tra lịch chiếu tồn tại
    const showtime = await this.prisma.lichChieu.findUnique({
      where: { ma_lich_chieu },
    });

    if (!showtime) {
      throw new NotFoundException('Không tìm thấy lịch chiếu');
    }

    // xóa lịch chiếu
    await this.prisma.lichChieu.delete({
      where: { ma_lich_chieu },
    });

    return true;
  }
}
