import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { TokenService } from '../../modules-system/token/token.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Kiểm tra tài khoản đã tồn tại chưa
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { tai_khoan: registerDto.tai_khoan },
    });

    if (existingUser) {
      throw new ConflictException('Tài khoản đã tồn tại');
    }

    // Kiểm tra email đã tồn tại chưa
    if (registerDto.email) {
      const existingEmail = await this.prisma.nguoiDung.findFirst({
        where: { email: registerDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    // Hash mật khẩu
    const hashedPassword = bcrypt.hashSync(registerDto.mat_khau, 10);

    // Tạo user mới
    const newUser = await this.prisma.nguoiDung.create({
      data: {
        tai_khoan: registerDto.tai_khoan,
        ho_ten: registerDto.ho_ten,
        email: registerDto.email,
        so_dt: registerDto.so_dt,
        mat_khau: hashedPassword,
        loai_nguoi_dung: 'KHACH_HANG', // Mặc định là khách hàng khi đăng ký
      },
    });

    // Loại bỏ mật khẩu khỏi response
    const { mat_khau, ...userWithoutPassword } = newUser;

    return {
      userWithoutPassword
    };
  }

  async login(loginDto: LoginDto) {
    // Tìm user theo tài khoản
    const user = await this.prisma.nguoiDung.findUnique({
      where: { tai_khoan: loginDto.tai_khoan },
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    if (!user.mat_khau) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = bcrypt.compareSync(
      loginDto.mat_khau,
      user.mat_khau,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    // Loại bỏ mật khẩu khỏi response
    const { mat_khau, ...userWithoutPassword } = user;

    // Tạo token với thông tin user (không có mật khẩu)
    const tokens = this.tokenService.createTokens(userWithoutPassword);

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }
}
