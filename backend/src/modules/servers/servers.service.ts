import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DockerService } from './docker.service';
import { ServerType } from '@prisma/client';

@Injectable()
export class ServersService {
  constructor(
    private prisma: PrismaService,
    private docker: DockerService,
  ) {}

  async findAll() {
    return this.prisma.server.findMany({
      include: { node: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const server = await this.prisma.server.findUnique({ where: { id } });
    if (!server) throw new NotFoundException('Serveur non trouvé');
    return server;
  }

  async create(data: {
    name: string;
    version: string;
    ram: number;
    port: number;
    type: ServerType;
    maxPlayers?: number;
  }) {
    const containerId = await this.docker.createServer({
      name: data.name,
      version: data.version,
      ram: data.ram,
      port: data.port,
      type: data.type,
    });

    return this.prisma.server.create({
      data: {
        name: data.name,
        type: data.type,
        version: data.version,
        port: data.port,
        ram: data.ram,
        maxPlayers: data.maxPlayers || 100,
        containerId,
        status: 'stopped',
      },
    });
  }

  async start(id: string) {
    const server = await this.findById(id);
    if (!server.containerId) throw new NotFoundException('Container introuvable');

    await this.docker.startServer(server.containerId);
    return this.prisma.server.update({
      where: { id },
      data: { status: 'running' },
    });
  }

  async stop(id: string) {
    const server = await this.findById(id);
    if (!server.containerId) throw new NotFoundException('Container introuvable');

    await this.docker.stopServer(server.containerId);
    return this.prisma.server.update({
      where: { id },
      data: { status: 'stopped' },
    });
  }

  async restart(id: string) {
    const server = await this.findById(id);
    if (!server.containerId) throw new NotFoundException('Container introuvable');

    await this.docker.restartServer(server.containerId);
    return this.prisma.server.update({
      where: { id },
      data: { status: 'running' },
    });
  }

  async delete(id: string) {
    const server = await this.findById(id);
    if (server.containerId) {
      await this.docker.deleteServer(server.containerId);
    }
    return this.prisma.server.delete({ where: { id } });
  }

  async getStats(id: string) {
    const server = await this.findById(id);
    if (!server.containerId || server.status !== 'running') {
      return { cpu: 0, ram: 0, ramLimit: 0 };
    }
    return this.docker.getStats(server.containerId);
  }

  async getLogs(id: string, tail = 100) {
    const server = await this.findById(id);
    if (!server.containerId) return '';
    return this.docker.getLogs(server.containerId, tail);
  }

  async sendCommand(id: string, command: string) {
    const server = await this.findById(id);
    if (!server.containerId || server.status !== 'running') {
      throw new NotFoundException('Serveur non disponible');
    }
    return this.docker.sendCommand(server.containerId, command);
  }
}
