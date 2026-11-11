import { Module } from '@nestjs/common';
import { ForensicsController } from './forensics.controller';
import { ForensicsService } from './forensics.service';

@Module({
  controllers: [ForensicsController],
  providers: [ForensicsService],
  exports: [ForensicsService],
})
export class ForensicsModule {}
