import { Module } from '@nestjs/common';
import { PhishingController } from './phishing.controller';
import { PhishingService } from './phishing.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ModuleActiveGuard } from '../common/guards/module-active.guard';

@Module({
  imports: [PrismaModule],
  controllers: [PhishingController],
  providers: [PhishingService, ModuleActiveGuard],
  exports: [PhishingService],
})
export class PhishingModule {}
