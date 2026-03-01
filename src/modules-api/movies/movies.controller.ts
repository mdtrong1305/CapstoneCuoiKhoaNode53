import { Controller, Get, Query, Post, Put, Delete, UseInterceptors, UploadedFile, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiConsumes, ApiBody, ApiExtraModels } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { IsRole } from '../../common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMoviesConfig } from '../../common/configs/multer.config';
import { CreateMovieDto, UpdateMovieDto, CreateShowtimeDto, UpdateShowtimeDto } from './dto/movies.dto';
import { RoleGuard } from '../../common/guards/role.guard';

@ApiTags('Quản lý phim và lịch chiếu')
@ApiExtraModels(CreateMovieDto, UpdateMovieDto)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách phim' })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'filters', required: false, type: String, example: '{"ten_phim":"Avatar"}' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findAll(@Query() query: any) {
    return this.moviesService.findAll(query);
  }

  @Post('create-movie')
  @UseGuards(RoleGuard)
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image', multerMoviesConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Tạo phim mới (Chỉ QUAN_TRI)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['ten_phim', 'trailer', 'mo_ta', 'ngay_khoi_chieu', 'danh_gia', 'thoi_luong', 'hot', 'dang_chieu', 'sap_chieu', 'image'],
      properties: {
        ten_phim: { type: 'string', description: 'Tên phim', example: 'Avatar 2' },
        trailer: { type: 'string', description: 'Link trailer', example: 'https://youtube.com/...' },
        mo_ta: { type: 'string', description: 'Mô tả phim', example: 'Mô tả phim...' },
        ngay_khoi_chieu: { type: 'string', description: 'Ngày khởi chiếu (YYYY-MM-DD)', example: '2024-01-01' },
        danh_gia: { type: 'number', description: 'Đánh giá (0-10)', example: 8 },
        thoi_luong: { type: 'number', description: 'Thời lượng phim (phút)', example: 120 },
        hot: { type: 'string', description: 'Phim hot (true/false)', example: 'true' },
        dang_chieu: { type: 'string', description: 'Đang chiếu (true/false)', example: 'true' },
        sap_chieu: { type: 'string', description: 'Sắp chiếu (true/false)', example: 'false' },
        image: { type: 'string', format: 'binary', description: 'File ảnh' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Tạo phim thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc chỉ chấp nhận file ảnh' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  createMovie(
    @Body() body: CreateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.moviesService.createMovie(body, file.filename);
  }

  @Put('update-movie')
  @UseGuards(RoleGuard)
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image', multerMoviesConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cập nhật phim (Chỉ QUAN_TRI)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['ma_phim'],
      properties: {
        ma_phim: { type: 'string', description: 'Mã phim', example: '1' },
        ten_phim: { type: 'string', description: 'Tên phim', example: 'Avatar 2' },
        trailer: { type: 'string', description: 'Link trailer', example: 'https://youtube.com/...' },
        mo_ta: { type: 'string', description: 'Mô tả phim', example: 'Mô tả phim...' },
        ngay_khoi_chieu: { type: 'string', description: 'Ngày khởi chiếu (YYYY-MM-DD)', example: '2024-01-01' },
        danh_gia: { type: 'number', description: 'Đánh giá (0-10)', example: 8 },
        thoi_luong: { type: 'number', description: 'Thời lượng phim (phút)', example: 120 },
        hot: { type: 'string', description: 'Phim hot (true/false)', example: 'true' },
        dang_chieu: { type: 'string', description: 'Đang chiếu (true/false)', example: 'true' },
        sap_chieu: { type: 'string', description: 'Sắp chiếu (true/false)', example: 'false' },
        image: { type: 'string', format: 'binary', description: 'File ảnh (optional)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cập nhật phim thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc chỉ chấp nhận file ảnh' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phim' })
  updateMovie(
    @Body() body: UpdateMovieDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.moviesService.updateMovie(body, file?.filename);
  }

  @Delete('delete-movie/:ma_phim')
  @UseGuards(RoleGuard)
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa phim (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Xóa phim thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phim' })
  deleteMovie(@Param('ma_phim', ParseIntPipe) ma_phim: number) {
    return this.moviesService.deleteMovie(ma_phim);
  }

  @Get('showtimes-by-movie/:ma_phim')
  @Public()
  @ApiOperation({ summary: 'Lấy lịch chiếu theo phim' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phim' })
  getShowtimesByMovie(@Param('ma_phim', ParseIntPipe) ma_phim: number) {
    return this.moviesService.getShowtimesByMovie(ma_phim);
  }

  @Get('showtimes-by-cinema/:ma_cum_rap')
  @Public()
  @ApiOperation({ summary: 'Lấy lịch chiếu theo cụm rạp' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cụm rạp' })
  getShowtimesByCinemaComplex(@Param('ma_cum_rap', ParseIntPipe) ma_cum_rap: number) {
    return this.moviesService.getShowtimesByCinemaComplex(ma_cum_rap);
  }

  @Post('create-showtime')
  @UseGuards(RoleGuard)
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo lịch chiếu mới (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 201, description: 'Tạo lịch chiếu thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phim hoặc rạp' })
  createShowtime(@Body() body: CreateShowtimeDto) {
    return this.moviesService.createShowtime(body);
  }

  @Put('update-showtime')
  @UseGuards(RoleGuard)
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật lịch chiếu (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Cập nhật lịch chiếu thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch chiếu, rạp hoặc phim' })
  updateShowtime(@Body() body: UpdateShowtimeDto) {
    return this.moviesService.updateShowtime(body);
  }

  @Delete('delete-showtime/:ma_lich_chieu')
  @UseGuards(RoleGuard)
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa lịch chiếu (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Xóa lịch chiếu thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch chiếu' })
  deleteShowtime(@Param('ma_lich_chieu', ParseIntPipe) ma_lich_chieu: number) {
    return this.moviesService.deleteShowtime(ma_lich_chieu);
  }
}
