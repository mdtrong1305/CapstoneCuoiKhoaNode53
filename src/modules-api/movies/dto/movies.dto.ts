import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({ example: 'Avatar 2', description: 'Tên phim' })
  @IsNotEmpty({ message: 'Tên phim không được để trống' })
  @IsString({ message: 'Tên phim phải là chuỗi' })
  ten_phim!: string;

  @ApiProperty({ example: 'https://youtube.com/watch?v=...', description: 'Link trailer' })
  @IsNotEmpty({ message: 'Trailer không được để trống' })
  @IsString({ message: 'Trailer phải là chuỗi' })
  trailer!: string;

  @ApiProperty({ example: 'Mô tả phim...', description: 'Mô tả phim' })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @IsString({ message: 'Mô tả phải là chuỗi' })
  mo_ta!: string;

  @ApiProperty({ example: '2024-01-01', description: 'Ngày khởi chiếu (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Ngày khởi chiếu không được để trống' })
  @IsString({ message: 'Ngày khởi chiếu phải là chuỗi' })
  ngay_khoi_chieu!: string;

  @ApiProperty({ example: '8', description: 'Đánh giá (0-10)' })
  @IsNotEmpty({ message: 'Đánh giá không được để trống' })
  @IsString({ message: 'Đánh giá phải là chuỗi' })
  danh_gia!: string;

  @ApiProperty({ example: 'true', description: 'Phim hot' })
  @IsNotEmpty({ message: 'Hot không được để trống' })
  @IsString({ message: 'Hot phải là chuỗi' })
  hot!: string;

  @ApiProperty({ example: 'true', description: 'Đang chiếu' })
  @IsNotEmpty({ message: 'Đang chiếu không được để trống' })
  @IsString({ message: 'Đang chiếu phải là chuỗi' })
  dang_chieau!: string;

  @ApiProperty({ example: 'false', description: 'Sắp chiếu' })
  @IsNotEmpty({ message: 'Sắp chiếu không được để trống' })
  @IsString({ message: 'Sắp chiếu phải là chuỗi' })
  sap_chieu!: string;
}

export class UpdateMovieDto {
  @ApiProperty({ example: '1', description: 'Mã phim' })
  @IsNotEmpty({ message: 'Mã phim không được để trống' })
  @IsString({ message: 'Mã phim phải là chuỗi' })
  ma_phim!: string;

  @ApiProperty({ example: 'Avatar 2', description: 'Tên phim', required: false })
  @IsOptional()
  @IsString({ message: 'Tên phim phải là chuỗi' })
  ten_phim?: string;

  @ApiProperty({ example: 'https://youtube.com/watch?v=...', description: 'Link trailer', required: false })
  @IsOptional()
  @IsString({ message: 'Trailer phải là chuỗi' })
  trailer?: string;

  @ApiProperty({ example: 'Mô tả phim...', description: 'Mô tả phim', required: false })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  mo_ta?: string;

  @ApiProperty({ example: '2024-01-01', description: 'Ngày khởi chiếu (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsString({ message: 'Ngày khởi chiếu phải là chuỗi' })
  ngay_khoi_chieu?: string;

  @ApiProperty({ example: '8', description: 'Đánh giá (0-10)', required: false })
  @IsOptional()
  @IsString({ message: 'Đánh giá phải là chuỗi' })
  danh_gia?: string;

  @ApiProperty({ example: 'true', description: 'Phim hot', required: false })
  @IsOptional()
  @IsString({ message: 'Hot phải là chuỗi' })
  hot?: string;

  @ApiProperty({ example: 'true', description: 'Đang chiếu', required: false })
  @IsOptional()
  @IsString({ message: 'Đang chiếu phải là chuỗi' })
  dang_chieau?: string;

  @ApiProperty({ example: 'false', description: 'Sắp chiếu', required: false })
  @IsOptional()
  @IsString({ message: 'Sắp chiếu phải là chuỗi' })
  sap_chieu?: string;
}

export class CreateShowtimeDto {
  @ApiProperty({ example: '1', description: 'Mã rạp' })
  @IsNotEmpty({ message: 'Mã rạp không được để trống' })
  @IsString({ message: 'Mã rạp phải là chuỗi' })
  ma_rap!: string;

  @ApiProperty({ example: '1', description: 'Mã phim' })
  @IsNotEmpty({ message: 'Mã phim không được để trống' })
  @IsString({ message: 'Mã phim phải là chuỗi' })
  ma_phim!: string;

  @ApiProperty({ example: '2024-01-01T19:00:00', description: 'Ngày giờ chiếu (ISO 8601 format)' })
  @IsNotEmpty({ message: 'Ngày giờ chiếu không được để trống' })
  @IsString({ message: 'Ngày giờ chiếu phải là chuỗi' })
  ngay_gio_chieu!: string;

  @ApiProperty({ example: '100000', description: 'Giá vé (VND)' })
  @IsNotEmpty({ message: 'Giá vé không được để trống' })
  @IsString({ message: 'Giá vé phải là chuỗi' })
  gia_ve!: string;
}

export class UpdateShowtimeDto {
  @ApiProperty({ example: '1', description: 'Mã lịch chiếu' })
  @IsNotEmpty({ message: 'Mã lịch chiếu không được để trống' })
  @IsString({ message: 'Mã lịch chiếu phải là chuỗi' })
  ma_lich_chiu!: string;

  @ApiProperty({ example: '1', description: 'Mã rạp', required: false })
  @IsOptional()
  @IsString({ message: 'Mã rạp phải là chuỗi' })
  ma_rap?: string;

  @ApiProperty({ example: '1', description: 'Mã phim', required: false })
  @IsOptional()
  @IsString({ message: 'Mã phim phải là chuỗi' })
  ma_phim?: string;

  @ApiProperty({ example: '2024-01-01T19:00:00', description: 'Ngày giờ chiếu (ISO 8601 format)', required: false })
  @IsOptional()
  @IsString({ message: 'Ngày giờ chiếu phải là chuỗi' })
  ngay_gio_chieu?: string;

  @ApiProperty({ example: '100000', description: 'Giá vé (VND)', required: false })
  @IsOptional()
  @IsString({ message: 'Giá vé phải là chuỗi' })
  gia_ve?: string;  
}