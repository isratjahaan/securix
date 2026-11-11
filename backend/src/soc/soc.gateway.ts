import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('SocGateway');

  handleConnection(client: Socket) {
    this.logger.log(`SOC Console connected: ${client.id}`);
    client.emit('connection:ack', {
      status: 'CONNECTED',
      timestamp: new Date().toISOString(),
      stream: 'SIS_CYBER_FORTRESS_LIVE_TELEMETRY',
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`SOC Console disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  // Broadcasters for real-time events
  broadcastNewAlert(alert: any) {
    if (this.server) {
      this.server.emit('soc:alert', alert);
    }
  }

  broadcastIncidentUpdate(incident: any) {
    if (this.server) {
      this.server.emit('soc:incident_updated', incident);
    }
  }

  broadcastModuleStateChange(moduleData: any) {
    if (this.server) {
      this.server.emit('module:state_changed', moduleData);
    }
  }

  broadcastSystemPulse(health: any) {
    if (this.server) {
      this.server.emit('system:pulse', health);
    }
  }
}
