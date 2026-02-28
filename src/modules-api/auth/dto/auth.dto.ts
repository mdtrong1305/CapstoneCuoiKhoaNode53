import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'Tài khoản người dùng' })
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  @IsString({ message: 'Tài khoản phải là chuỗi' })
  tai_khoan!: string;

  @ApiProperty({ example: 'John Doe', description: 'Họ và tên' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  ho_ten!: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @ApiProperty({ example: '0123456789', description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  so_dt?: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu (ít nhất 6 ký tự)' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  mat_khau!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john_doe', description: 'Tài khoản' })
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  @IsString({ message: 'Tài khoản phải là chuỗi' })
  tai_khoan!: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  mat_khau!: string;
}
