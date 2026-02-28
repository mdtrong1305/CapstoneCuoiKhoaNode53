import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BannerDto {
  @ApiProperty({ example: 1, description: 'Mã banner' })
  ma_banner!: number;

  @ApiProperty({ example: 1, description: 'Mã phim' })
  ma_phim!: number;

  @ApiProperty({ example: 'https://example.com/banner.jpg', description: 'Hình ảnh' })
  hinh_anh!: string;
}

export class UploadBannerImageDto {
  @ApiProperty({ example: 1, description: 'Mã phim' })
  @IsNotEmpty({ message: 'Mã phim không được để trống' })
  @IsString({ message: 'Mã phim phải là chuỗi' })
  ma_phim!: string;
}
