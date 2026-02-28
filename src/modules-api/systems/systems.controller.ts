import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { SystemsService } from './systems.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiExtraModels } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { IsRole } from '../../common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerHeThongRapConfig } from '../../common/configs/multer.config';
import { 
  CreateHeThongRapDto, 
  UpdateHeThongRapDto, 
  HeThongRapDto,
  CreateCumRap,
  UpdateCumRap,
  CreateRapPhim,
  UpdateRapPhim,
} from './dto/systems.dto';

@ApiTags('Quản lý hệ thống rạp, cụm rạp và rạp phim')
@ApiExtraModels(HeThongRapDto, CreateHeThongRapDto, UpdateHeThongRapDto, CreateCumRap, UpdateCumRap, CreateRapPhim, UpdateRapPhim)
@Controller('systems')
export class SystemsController {
  constructor(private readonly systemsService: SystemsService) {}

  @Get('cinema-system')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách hệ thống rạp' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findAll() {
    return this.systemsService.findAll();
  }

  @Post('cinema-system')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('logo', multerHeThongRapConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Tạo hệ thống rạp mới (Chỉ QUAN_TRI)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['ten_he_thong_rap', 'logo'],
      properties: {
        ten_he_thong_rap: { type: 'string', description: 'Tên hệ thống rạp', example: 'CGV' },
        logo: { type: 'string', format: 'binary', description: 'File logo' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Tạo hệ thống rạp thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc chỉ chấp nhận file ảnh' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  createHeThongRap(
    @Body() body: CreateHeThongRapDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.systemsService.createHeThongRap(body, file.filename);
  }

  @Put('cinema-system')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('logo', multerHeThongRapConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cập nhật hệ thống rạp (Chỉ QUAN_TRI)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['ma_he_thong_rap'],
      properties: {
        ma_he_thong_rap: { type: 'string', description: 'Mã hệ thống rạp', example: '1' },
        ten_he_thong_rap: { type: 'string', description: 'Tên hệ thống rạp', example: 'CGV Cinemas' },
        logo: { type: 'string', format: 'binary', description: 'File logo (optional)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cập nhật hệ thống rạp thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc chỉ chấp nhận file ảnh' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hệ thống rạp' })
  updateHeThongRap(
    @Body() body: UpdateHeThongRapDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.systemsService.updateHeThongRap(body, file?.filename);
  }

  @Delete('cinema-system/:ma_he_thong_rap')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa hệ thống rạp (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Xóa hệ thống rạp thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hệ thống rạp' })
  deleteHeThongRap(@Param('ma_he_thong_rap', ParseIntPipe) ma_he_thong_rap: number) {
    return this.systemsService.deleteHeThongRap(ma_he_thong_rap);
  }

  @Get('cinema-complex/:ma_he_thong_rap')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách cụm rạp theo hệ thống rạp' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hệ thống rạp' })
  getCinemaComplexesBySystemId(@Param('ma_he_thong_rap', ParseIntPipe) ma_he_thong_rap: number) {
    return this.systemsService.getCinemaComplexesBySystemId(ma_he_thong_rap);
  }

  @Post('cinema-complex')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo cụm rạp mới (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 201, description: 'Tạo cụm rạp thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hệ thống rạp' })
  createCinemaComplex(@Body() body: CreateCumRap) {
    return this.systemsService.createCinemaComplex(body);
  }

  @Put('cinema-complex')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật cụm rạp (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Cập nhật cụm rạp thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cụm rạp hoặc hệ thống rạp' })
  updateCinemaComplex(@Body() body: UpdateCumRap) {
    return this.systemsService.updateCinemaComplex(body);
  }

  @Delete('cinema-complex/:ma_cum_rap')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa cụm rạp (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Xóa cụm rạp thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cụm rạp' })
  deleteCinemaComplex(@Param('ma_cum_rap', ParseIntPipe) ma_cum_rap: number) {
    return this.systemsService.deleteCinemaComplex(ma_cum_rap);
  }

  @Get('cinema/:ma_cum_rap')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách rạp theo cụm rạp' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cụm rạp' })
  getCinemasByComplexId(@Param('ma_cum_rap', ParseIntPipe) ma_cum_rap: number) {
    return this.systemsService.getCinemasByComplexId(ma_cum_rap);
  }

  @Post('cinema')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo rạp mới (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 201, description: 'Tạo rạp thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cụm rạp' })
  createCinema(@Body() body: CreateRapPhim) {
    return this.systemsService.createCinema(body);
  }

  @Put('cinema')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật rạp (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Cập nhật rạp thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy rạp hoặc cụm rạp' })
  updateCinema(@Body() body: UpdateRapPhim) {
    return this.systemsService.updateCinema(body);
  }

  @Delete('cinema/:ma_rap')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa rạp (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Xóa rạp thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy rạp' })
  deleteCinema(@Param('ma_rap', ParseIntPipe) ma_rap: number) {
    return this.systemsService.deleteCinema(ma_rap);
  }
}
