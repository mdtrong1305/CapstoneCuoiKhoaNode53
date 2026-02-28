import { Controller, Get, Post, Delete, UseInterceptors, UploadedFile, Body, Param, ParseIntPipe, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { BannerService } from './banner.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiExtraModels } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { IsRole } from '../../common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerBannersConfig } from '../../common/configs/multer.config';
import { UploadBannerImageDto } from './dto/banner.dto';

@ApiTags('Quản lý ảnh banner')
@ApiExtraModels(UploadBannerImageDto)
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách ảnh banner' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách ảnh banner thành công' })
  findAll() {
    return this.bannerService.findAll();
  }

  @Post('')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image', multerBannersConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload ảnh banner (Chỉ QUAN_TRI)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['ma_phim', 'image'],
      properties: {
        ma_phim: {
          type: 'number',
          description: 'Mã phim',
          example: "1",
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'File ảnh',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Upload ảnh banner thành công' })
  @ApiResponse({ status: 400, description: 'Chỉ chấp nhận file ảnh' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy banner' })
  uploadImage(
    @Body() body: UploadBannerImageDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const ma_phim = Number(body.ma_phim);
    return this.bannerService.uploadImage(ma_phim, file.filename);
  }

  @Delete('/:ma_banner')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa ảnh banner (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Xóa ảnh banner thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ảnh banner' })
  deleteBanner(@Param('ma_banner', ParseIntPipe) ma_banner: number) {
    return this.bannerService.deleteBanner(ma_banner);
  }
}
