import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ServersService } from './servers.service';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true },
  namespace: '/console',
})
export class ConsoleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ConsoleGateway.name);

  constructor(private serversService: ServersService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-server')
  async handleJoinServer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { serverId: string },
  ) {
    client.join(`server:${data.serverId}`);
    const logs = await this.serversService.getLogs(data.serverId, 50);
    client.emit('console-output', { logs });
  }

  @SubscribeMessage('send-command')
  async handleCommand(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { serverId: string; command: string },
  ) {
    const result = await this.serversService.sendCommand(data.serverId, data.command);
    this.server.to(`server:${data.serverId}`).emit('console-output', {
      logs: `> ${data.command}\n${result}`,
    });
  }

  @SubscribeMessage('leave-server')
  handleLeaveServer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { serverId: string },
  ) {
    client.leave(`server:${data.serverId}`);
  }
}
