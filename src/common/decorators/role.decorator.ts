import { SetMetadata } from '@nestjs/common';

export const IS_ROLE = 'isRole';

export type RoleType = 'QUAN_TRI' | 'KHACH_HANG';

export const IsRole = (roleType: RoleType) =>
  SetMetadata(IS_ROLE, roleType);
