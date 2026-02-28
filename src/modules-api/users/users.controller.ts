import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateProfileDto, UpdateUserByAdminDto } from './dto/users.dto';
import { IsRole } from '../../common/decorators/role.decorator';
import { User } from '../../common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import type { NguoiDung } from '../../modules-system/prisma/generated/prisma/client';

@ApiTags('Quản lý người dùng')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo người dùng mới (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 201, description: 'Tạo người dùng thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 409, description: 'Tài khoản hoặc email đã tồn tại' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  getCurrentUser(@User() nguoiDung: NguoiDung) {
    return this.usersService.getCurrentUser(nguoiDung);
  }

  @Get('get-users')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy danh sách người dùng (Chỉ QUAN_TRI)' })
  @ApiQuery({ name: 'page', example: 1, required: true, type: Number })
  @ApiQuery({ name: 'pageSize', example: 3, required: true, type: Number })
  @ApiQuery({ name: 'filters', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get('detail/:tai_khoan')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo tài khoản (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  getUserByTaiKhoan(@Param('tai_khoan') tai_khoan: string) {
    return this.usersService.getUserByTaiKhoan(tai_khoan);
  }

  @Put('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản của chính mình' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  updateProfile(@User() user: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.tai_khoan, updateProfileDto);
  }

  @Put('update')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  updateUserByAdmin(@Body() body: UpdateUserByAdminDto) {
    return this.usersService.updateUserByAdmin(body);
  }

  @Delete('delete/:tai_khoan')
  @IsRole('QUAN_TRI')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa người dùng (Chỉ QUAN_TRI)' })
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  deleteUser(@Param('tai_khoan') tai_khoan: string) {
    return this.usersService.deleteUser(tai_khoan);
  }
}
