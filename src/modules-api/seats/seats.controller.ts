import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { IsRole } from '../../common/decorators/role.decorator';
import { CreateSeatDto, UpdateSeatDto } from './dto/seats.dto';
import { RoleGuard } from '../../common/guards/role.guard';

@ApiTags('Quản lý ghế theo lịch chiếu')
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get('/:ma_lich_chieu')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách ghế theo suất chiếu' })
  getSeatsBySchedule(@Param('ma_lich_chieu', ParseIntPipe) ma_lich_chieu: number) {
    return this.seatsService.getSeatsBySchedule(ma_lich_chieu);
  }

  @Post()
  @UseGuards(RoleGuard)
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Thêm ghế mới dựa theo mã rạp (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 201, description: 'Tạo ghế thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hệ thống rạp' })
  create(@Body() body: CreateSeatDto) {
    return this.seatsService.create(body);
  }

  @Put()
  @UseGuards(RoleGuard)
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật ghế dựa theo mã ghế (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Cập nhật ghế thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ghế hoặc rạp phim' })
  update(@Body() body: UpdateSeatDto) {
    return this.seatsService.update(body);
  }

  @Delete(':ma_ghe')
  @UseGuards(RoleGuard)
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa ghế (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Xóa ghế thành công' })
  @ApiResponse({ status: 400, description: 'Ghế đã từng được đặt vé, không thể xóa!' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ghế' })
  remove(@Param('ma_ghe', ParseIntPipe) ma_ghe: number) {
    return this.seatsService.remove(ma_ghe);
  }
}