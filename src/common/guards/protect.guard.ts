import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../../modules-system/token/token.service';
import { TokenExpiredError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IS_ROLE, RoleType } from '../decorators/role.decorator';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../modules-system/prisma/prisma.service';

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // lấy cờ isPublic trong mọi api để xem xem có được đánh true hay không
    // nếu api nào có @Public() thì cờ isPublic sẽ là true
    // nếu cờ không đánh undefine => cho code chạy tiếp đi kiểm tra
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // nhìn thấy là api public thì cho qua luôn
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      const userExits = await this.prisma.nguoiDung.findUnique({
        where: {
          tai_khoan: (payload as any).tai_khoan,
        },
      });
      if (!userExits) {
        throw new UnauthorizedException("Không tìm thấy user");
      }
      
      // Loại bỏ mật khẩu trước khi gán vào request
      const { mat_khau, ...userWithoutPassword } = userExits;
      request['user'] = userWithoutPassword;

      // Kiểm tra role nếu có yêu cầu
      const requiredRole = this.reflector.getAllAndOverride<RoleType>(IS_ROLE, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (requiredRole) {
        const userRole = userWithoutPassword.loai_nguoi_dung;
        if (userRole !== requiredRole) {
          throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
        }
      }
    } catch (err){
      // trả về lỗi token ko đủ quyền hoặc token không hợp lệ
      const error = err instanceof Error ? err : new Error(String(err));
      switch (error.constructor) {
        case ForbiddenException:
          // token ko đủ quyền: 403 (FE gọi api refresh token để lấy token mới)
          throw new ForbiddenException(error.message);
        default:
          // mọi lỗi còn lại của token: 401 (FE-logout)
          throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
      }
    }
    return true;
  }
  // hàm lấy token từ header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
