import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { PrismaModule } from '../../modules-system/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
