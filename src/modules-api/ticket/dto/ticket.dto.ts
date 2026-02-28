import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, Min, ArrayMinSize } from 'class-validator';

export class DatVeDto {
  @ApiProperty({ example: 1, description: 'Mã lịch chiếu' })
  @IsNotEmpty({ message: 'Mã lịch chiếu không được để trống' })
  @IsInt({ message: 'Mã lịch chiếu phải là số nguyên' })
  @Min(1, { message: 'Mã lịch chiếu không hợp lệ' })
  ma_lich_chieu!: number;

  @ApiProperty({ 
    example: [1, 2, 3], 
    description: 'Danh sách mã ghế chọn mua',
    type: [Number] 
  })
  @IsArray({ message: 'Danh sách ghế phải là một mảng' })
  @IsNotEmpty({ message: 'Danh sách ghế không được để trống' })
  @ArrayMinSize(1, { message: 'Phải chọn ít nhất một ghế để đặt' })
  @IsInt({ each: true, message: 'Mã ghế phải là số nguyên' })
  danh_sach_ghe!: number[];
}