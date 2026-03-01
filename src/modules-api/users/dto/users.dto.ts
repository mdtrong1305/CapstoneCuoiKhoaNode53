import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'admin01', description: 'Tài khoản người dùng' })
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  @IsString({ message: 'Tài khoản phải là chuỗi' })
  tai_khoan!: string;

  @ApiProperty({ example: 'Admin User', description: 'Họ và tên' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  ho_ten!: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @ApiProperty({ example: '0987654321', description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  so_dt?: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu (ít nhất 6 ký tự)' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  mat_khau!: string;

  @ApiProperty({ example: 'QUAN_TRI', description: 'Loại người dùng', enum: ['KHACH_HANG', 'QUAN_TRI'] })
  @IsNotEmpty({ message: 'Loại người dùng không được để trống' })
  @IsString({ message: 'Loại người dùng phải là chuỗi' })
  @IsIn(['KHACH_HANG', 'QUAN_TRI'], { message: 'Loại người dùng phải là KHACH_HANG hoặc QUAN_TRI' })
  loai_nguoi_dung!: string;
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe Updated', description: 'Họ và tên', required: false })
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi' })
  ho_ten?: string;

  @ApiProperty({ example: 'newemail@example.com', description: 'Email', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiProperty({ example: '0123456789', description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  so_dt?: string;

  @ApiProperty({ example: 'newpassword123', description: 'Mật khẩu mới (ít nhất 6 ký tự)', required: false })
  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  mat_khau?: string;
}

export class UpdateUserByAdminDto {
  @ApiProperty({ example: 'mdtrong1305', description: 'Tài khoản người dùng' })
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  @IsString({ message: 'Tài khoản phải là chuỗi' })
  tai_khoan!: string;

  @ApiProperty({ example: 'John Doe', description: 'Họ và tên', required: false })
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi' })
  ho_ten?: string;

  @ApiProperty({ example: 'email@example.com', description: 'Email', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiProperty({ example: '0987654321', description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  so_dt?: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu mới (ít nhất 6 ký tự)', required: false })
  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  mat_khau?: string;

  @ApiProperty({ example: 'KHACH_HANG', description: 'Loại người dùng', enum: ['KHACH_HANG', 'QUAN_TRI'], required: false })
  @IsOptional()
  @IsString({ message: 'Loại người dùng phải là chuỗi' })
  @IsIn(['KHACH_HANG', 'QUAN_TRI'], { message: 'Loại người dùng phải là KHACH_HANG hoặc QUAN_TRI' })
  loai_nguoi_dung?: string;
}
