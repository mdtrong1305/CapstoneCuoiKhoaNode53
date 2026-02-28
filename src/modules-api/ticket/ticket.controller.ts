import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { DatVeDto } from './dto/ticket.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../../common/decorators/user.decorator';
import type { NguoiDung } from '../../modules-system/prisma/generated/prisma/client';

@ApiTags('Quản lý đặt vé')
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('history')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xem lịch sử đặt vé của tài khoản đang đăng nhập' })
  getHistory(@User() nguoiDung: NguoiDung) {
    return this.ticketService.getHistoryByUser(nguoiDung);
  }

  @Get('detail/:ma_dat_ve')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xem chi tiết thông tin vé theo mã vé' })
  getDetail(@Param('ma_dat_ve', ParseIntPipe) ma_dat_ve: number, @User() nguoiDung: NguoiDung) {
    return this.ticketService.getTicketDetail(ma_dat_ve, nguoiDung);
  }

  @Post('')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Đặt vé xem phim (cho phép đặt 1 lần nhiều ghế)' })
  datVe(@User() nguoiDung: NguoiDung, @Body() body: DatVeDto) {
    return this.ticketService.datVe(nguoiDung, body);
  }

}