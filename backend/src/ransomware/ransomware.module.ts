import { Module } from '@nestjs/common';
import { RansomwareController } from './ransomware.controller';
import { RansomwareService } from './ransomware.service';
import { ModuleActiveGuard } from '../common/guards/module-active.guard';

@Module({
  controllers: [RansomwareController],
  providers: [RansomwareService, ModuleActiveGuard],
  exports: [RansomwareService],
})
export class RansomwareModule {}
