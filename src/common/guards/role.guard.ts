import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_ROLE, RoleType } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // lấy role từ metadata 
    const requiredRole = this.reflector.getAllAndOverride<RoleType>(IS_ROLE, [
      context.getHandler(),
      context.getClass(),
    ]);
    // lấy thông tin user từ request sau khi đã được AuthGuard xác thực
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // kiểm tra role
    if (!user || user.loai_nguoi_dung !== requiredRole) {
      throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
    }
    return true;
  }
}
