import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { DockerService } from './docker.service';
import { ConsoleGateway } from './console.gateway';

@Module({
  controllers: [ServersController],
  providers: [ServersService, DockerService, ConsoleGateway],
  exports: [ServersService],
})
export class ServersModule {}
