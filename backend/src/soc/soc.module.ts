import { Module } from '@nestjs/common';
import { SocController } from './soc.controller';
import { SocService } from './soc.service';
import { SocGateway } from './soc.gateway';

@Module({
  controllers: [SocController],
  providers: [SocService, SocGateway],
  exports: [SocService, SocGateway],
})
export class SocModule {}
