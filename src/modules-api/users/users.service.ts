import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateProfileDto, UpdateUserByAdminDto } from './dto/users.dto';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { buildQueryPrisma } from '../../common/helper/build-query-prisma.helper';
import * as bcrypt from 'bcrypt';
import { NguoiDung } from '../../modules-system/prisma/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Kiểm tra tài khoản đã tồn tại chưa
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { tai_khoan: createUserDto.tai_khoan },
    });

    if (existingUser) {
      throw new ConflictException('Tài khoản đã tồn tại');
    }

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await this.prisma.nguoiDung.findFirst({
      where: { email: createUserDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash mật khẩu
    const hashedPassword = bcrypt.hashSync(createUserDto.mat_khau, 10);

    // Tạo user mới
    const newUser = await this.prisma.nguoiDung.create({
      data: {
        tai_khoan: createUserDto.tai_khoan,
        ho_ten: createUserDto.ho_ten,
        email: createUserDto.email,
        so_dt: createUserDto.so_dt,
        mat_khau: hashedPassword,
        loai_nguoi_dung: createUserDto.loai_nguoi_dung,
      },
    });

    // Loại bỏ mật khẩu khỏi response
    const { mat_khau, ...userWithoutPassword } = newUser;

    return {
      message: 'Tạo người dùng thành công',
      data: userWithoutPassword,
    };
  }

  async getCurrentUser(nguoiDung: NguoiDung) {
    // Loại bỏ mật khẩu nếu có
    const { mat_khau, ...userWithoutPassword } = nguoiDung;
    return userWithoutPassword;
  }

  async findAll(query: any) {
    const { page, pageSize, where, index } = buildQueryPrisma(query);

    // Lấy danh sách users
    const users = await this.prisma.nguoiDung.findMany({
      where,
      skip: index,
      take: Number(pageSize),
      select: {
        tai_khoan: true,
        ho_ten: true,
        email: true,
        so_dt: true,
        loai_nguoi_dung: true,
      },
    });

    // Đếm tổng số records
    const total = await this.prisma.nguoiDung.count({ where });

    return {
      data: users,
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      totalPages: Math.ceil(total / Number(pageSize)),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async getUserByTaiKhoan(tai_khoan: string) {
    const user = await this.prisma.nguoiDung.findUnique({
      where: { tai_khoan },
      select: {
        tai_khoan: true,
        ho_ten: true,
        email: true,
        so_dt: true,
        loai_nguoi_dung: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async updateProfile(tai_khoan: string, updateProfileDto: UpdateProfileDto) {
    // Kiểm tra user có tồn tại không
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { tai_khoan },
    });

    if (!existingUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Kiểm tra email mới nếu có
    if (updateProfileDto.email && updateProfileDto.email !== existingUser.email) {
      const emailExists = await this.prisma.nguoiDung.findFirst({
        where: { 
          email: updateProfileDto.email,
          tai_khoan: { not: tai_khoan }
        },
      });

      if (emailExists) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    const updateData: any = {};
    if (updateProfileDto.ho_ten) updateData.ho_ten = updateProfileDto.ho_ten;
    if (updateProfileDto.email) updateData.email = updateProfileDto.email;
    if (updateProfileDto.so_dt) updateData.so_dt = updateProfileDto.so_dt;
    if (updateProfileDto.mat_khau) {
      updateData.mat_khau = bcrypt.hashSync(updateProfileDto.mat_khau, 10);
    }

    // Update user
    const updatedUser = await this.prisma.nguoiDung.update({
      where: { tai_khoan },
      data: updateData,
      select: {
        tai_khoan: true,
        ho_ten: true,
        email: true,
        so_dt: true,
        loai_nguoi_dung: true,
      },
    });

    return {
      message: 'Cập nhật thông tin thành công',
      data: updatedUser,
    };
  }

  async updateUserByAdmin(updateUserByAdminDto: UpdateUserByAdminDto) {
    // Kiểm tra user có tồn tại không
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { tai_khoan: updateUserByAdminDto.tai_khoan },
    });

    if (!existingUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Kiểm tra email mới nếu có
    if (updateUserByAdminDto.email && updateUserByAdminDto.email !== existingUser.email) {
      const emailExists = await this.prisma.nguoiDung.findFirst({
        where: { 
          email: updateUserByAdminDto.email,
          tai_khoan: { not: updateUserByAdminDto.tai_khoan }
        },
      });

      if (emailExists) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    const updateData: any = {};
    if (updateUserByAdminDto.ho_ten) updateData.ho_ten = updateUserByAdminDto.ho_ten;
    if (updateUserByAdminDto.email) updateData.email = updateUserByAdminDto.email;
    if (updateUserByAdminDto.so_dt) updateData.so_dt = updateUserByAdminDto.so_dt;
    if (updateUserByAdminDto.loai_nguoi_dung) updateData.loai_nguoi_dung = updateUserByAdminDto.loai_nguoi_dung;

    // Update user
    const updatedUser = await this.prisma.nguoiDung.update({
      where: { tai_khoan: updateUserByAdminDto.tai_khoan },
      data: updateData,
      select: {
        tai_khoan: true,
        ho_ten: true,
        email: true,
        so_dt: true,
        loai_nguoi_dung: true,
      },
    });

    return {
      message: 'Cập nhật người dùng thành công',
      data: updatedUser,
    };
  }

  async deleteUser(tai_khoan: string) {
    // Kiểm tra user có tồn tại không
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { tai_khoan },
    });

    if (!existingUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Xóa user
    await this.prisma.nguoiDung.delete({
      where: { tai_khoan },
    });

    return {
      message: 'Xóa người dùng thành công',
    };
  }
}
