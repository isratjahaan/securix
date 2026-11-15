import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBusService } from './event-bus.service';
import { SocEventListener } from './listeners/soc-event.listener';
import { PrismaModule } from '../prisma/prisma.module';
import { SocModule } from '../soc/soc.module';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 50,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    PrismaModule,
    SocModule,
  ],
  providers: [EventBusService, SocEventListener],
  exports: [EventBusService],
})
export class EventsModule {}
