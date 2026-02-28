import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HeThongRapDto {
  @ApiProperty({ example: 1, description: 'Mã hệ thống rạp' })
  ma_he_thong_rap!: number;

  @ApiProperty({ example: 'CGV', description: 'Tên hệ thống rạp' })
  ten_he_thong_rap!: string;

  @ApiProperty({ example: 'https://example.com/cgv-logo.jpg', description: 'Logo hệ thống rạp' })
  logo!: string;
}

export class CreateHeThongRapDto {
  @ApiProperty({ example: 'CGV', description: 'Tên hệ thống rạp' })
  @IsNotEmpty({ message: 'Tên hệ thống rạp không được để trống' })
  @IsString({ message: 'Tên hệ thống rạp phải là chuỗi' })
  ten_he_thong_rap!: string;
}

export class UpdateHeThongRapDto {
  @ApiProperty({ example: '1', description: 'Mã hệ thống rạp' })
  @IsNotEmpty({ message: 'Mã hệ thống rạp không được để trống' })
  @IsString({ message: 'Mã hệ thống rạp phải là chuỗi' })
  ma_he_thong_rap!: string;

  @ApiProperty({ example: 'CGV Cinemas', description: 'Tên hệ thống rạp', required: false })
  @IsOptional()
  @IsString({ message: 'Tên hệ thống rạp phải là chuỗi' })
  ten_he_thong_rap?: string;
}

export class CreateCumRap {
  @ApiProperty({ example: 'CGV Vincom', description: 'Tên cụm rạp' })
  @IsNotEmpty({ message: 'Tên cụm rạp không được để trống' })
  @IsString({ message: 'Tên cụm rạp phải là chuỗi' })
  ten_cum_rap!: string;

  @ApiProperty({ example: '123 Nguyễn Văn A, Quận 1', description: 'Địa chỉ' })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  dia_chi!: string;

  @ApiProperty({ example: '1', description: 'Mã hệ thống rạp' })
  @IsNotEmpty({ message: 'Mã hệ thống rạp không được để trống' })
  @IsString({ message: 'Mã hệ thống rạp phải là chuỗi' })
  ma_he_thong_rap!: string;
}

export class UpdateCumRap {
  @ApiProperty({ example: '1', description: 'Mã cụm rạp' })
  @IsNotEmpty({ message: 'Mã cụm rạp không được để trống' })
  @IsString({ message: 'Mã cụm rạp phải là chuỗi' })
  ma_cum_rap!: string;

  @ApiProperty({ example: 'CGV Vincom Center', description: 'Tên cụm rạp', required: false })
  @IsOptional()
  @IsString({ message: 'Tên cụm rạp phải là chuỗi' })
  ten_cum_rap?: string;

  @ApiProperty({ example: '456 Lê Văn B, Quận 2', description: 'Địa chỉ', required: false })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  dia_chi?: string;

  @ApiProperty({ example: '2', description: 'Mã hệ thống rạp', required: false })
  @IsOptional()
  @IsString({ message: 'Mã hệ thống rạp phải là chuỗi' })
  ma_he_thong_rap?: string;
}

export class CreateRapPhim {
  @ApiProperty({ example: 'Rạp 1', description: 'Tên rạp' })
  @IsNotEmpty({ message: 'Tên rạp không được để trống' })
  @IsString({ message: 'Tên rạp phải là chuỗi' })
  ten_rap!: string;

  @ApiProperty({ example: '1', description: 'Mã cụm rạp' })
  @IsNotEmpty({ message: 'Mã cụm rạp không được để trống' })
  @IsString({ message: 'Mã cụm rạp phải là chuỗi' })
  ma_cum_rap!: string;
}

export class UpdateRapPhim {
  @ApiProperty({ example: '1', description: 'Mã rạp' })
  @IsNotEmpty({ message: 'Mã rạp không được để trống' })
  @IsString({ message: 'Mã rạp phải là chuỗi' })
  ma_rap!: string;

  @ApiProperty({ example: 'Rạp 1 - Premium', description: 'Tên rạp', required: false })
  @IsOptional()
  @IsString({ message: 'Tên rạp phải là chuỗi' })
  ten_rap?: string;

  @ApiProperty({ example: '2', description: 'Mã cụm rạp', required: false })
  @IsOptional()
  @IsString({ message: 'Mã cụm rạp phải là chuỗi' })
  ma_cum_rap?: string;
}
