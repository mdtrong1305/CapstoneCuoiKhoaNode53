import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty({ example: 'A10' , description: 'Tên ghế' })
  @IsNotEmpty({ message: 'Tên ghế không được để trống' })
  @IsString({ message: 'Tên ghế phải là chuỗi' })
  ten_ghe!: string;

  @ApiProperty({ example: 'Thuong', description: 'Thuong hoặc Vip' })
  @IsNotEmpty({ message: 'Loại ghế không được để trống' })
  @IsString({ message: 'Loại ghế phải là chuỗi' })
  loai_ghe!: string;

  @ApiProperty({ example: '1', description: 'Mã rạp' })
  @IsNotEmpty({ message: 'Mã rạp không được để trống' })
  @IsInt({ message: 'Mã rạp phải là số nguyên' })
  ma_rap!: number;
}

export class UpdateSeatDto{
  @ApiProperty({ example: '1', description: 'Mã ghế' })
  @IsNotEmpty({ message: 'Mã ghế không được để trống' })
  @IsInt({ message: 'Mã ghế phải là số nguyên' })
  ma_ghe!: number;

  @ApiProperty({ example: 'A10', description: 'Tên ghế', required: false })
  @IsString({ message: 'Tên ghế phải là chuỗi' })
  @IsOptional()
  ten_ghe?: string;

  @ApiProperty({ example: 'Thuong', description: 'Thuong hoặc Vip', required: false })
  @IsString({ message: 'Loại ghế phải là chuỗi' })
  @IsOptional()
  loai_ghe?: string;

}