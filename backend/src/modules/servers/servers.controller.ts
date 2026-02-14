import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ServersService } from './servers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { ServerType } from '@prisma/client';

@ApiTags('Servers')
@Controller('servers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Get()
  @Roles('mod', 'dev', 'manager', 'admin', 'superadmin')
  findAll() {
    return this.serversService.findAll();
  }

  @Get(':id')
  @Roles('mod', 'dev', 'manager', 'admin', 'superadmin')
  findById(@Param('id') id: string) {
    return this.serversService.findById(id);
  }

  @Post()
  @Roles('admin', 'superadmin')
  create(@Body() body: { name: string; version: string; ram: number; port: number; type: ServerType; maxPlayers?: number }) {
    return this.serversService.create(body);
  }

  @Post(':id/start')
  @Roles('manager', 'admin', 'superadmin')
  start(@Param('id') id: string) {
    return this.serversService.start(id);
  }

  @Post(':id/stop')
  @Roles('manager', 'admin', 'superadmin')
  stop(@Param('id') id: string) {
    return this.serversService.stop(id);
  }

  @Post(':id/restart')
  @Roles('manager', 'admin', 'superadmin')
  restart(@Param('id') id: string) {
    return this.serversService.restart(id);
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  delete(@Param('id') id: string) {
    return this.serversService.delete(id);
  }

  @Get(':id/stats')
  @Roles('mod', 'dev', 'manager', 'admin', 'superadmin')
  getStats(@Param('id') id: string) {
    return this.serversService.getStats(id);
  }

  @Get(':id/logs')
  @Roles('dev', 'manager', 'admin', 'superadmin')
  getLogs(@Param('id') id: string, @Query('tail') tail?: string) {
    return this.serversService.getLogs(id, Number(tail) || 100);
  }

  @Post(':id/command')
  @Roles('admin', 'superadmin')
  sendCommand(@Param('id') id: string, @Body('command') command: string) {
    return this.serversService.sendCommand(id, command);
  }
}
