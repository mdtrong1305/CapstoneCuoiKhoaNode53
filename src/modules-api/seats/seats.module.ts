import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { PrismaModule } from '../../modules-system/prisma/prisma.module';

@Module({
  controllers: [SeatsController],
  providers: [SeatsService],
})
export class SeatsModule {}
