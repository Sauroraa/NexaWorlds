import { Injectable, Logger } from '@nestjs/common';
import Docker from 'dockerode';

@Injectable()
export class DockerService {
  private docker: Docker;
  private readonly logger = new Logger(DockerService.name);

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async createServer(config: {
    name: string;
    version: string;
    ram: number;
    port: number;
    type: string;
  }) {
    const containerName = `minecraft-${config.name.toLowerCase().replace(/\s/g, '-')}`;
    const image = config.type === 'purpur'
      ? `itzg/minecraft-server:java21`
      : `itzg/minecraft-server:java21`;

    this.logger.log(`Creating server container: ${containerName}`);

    const container = await this.docker.createContainer({
      Image: image,
      name: containerName,
      Env: [
        'EULA=TRUE',
        `TYPE=${config.type.toUpperCase()}`,
        `VERSION=${config.version}`,
        `MEMORY=${config.ram}G`,
        `MAX_MEMORY=${config.ram}G`,
        'ENABLE_RCON=true',
        'RCON_PASSWORD=nexaworlds',
      ],
      HostConfig: {
        PortBindings: {
          '25565/tcp': [{ HostPort: String(config.port) }],
        },
        Memory: config.ram * 1024 * 1024 * 1024,
        RestartPolicy: { Name: 'unless-stopped' },
        Binds: [
          `/opt/nexaworlds/servers/${containerName}:/data`,
        ],
      },
      ExposedPorts: {
        '25565/tcp': {},
      },
    });

    return container.id;
  }

  async startServer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.start();
    this.logger.log(`Server started: ${containerId}`);
  }

  async stopServer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.stop();
    this.logger.log(`Server stopped: ${containerId}`);
  }

  async restartServer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.restart();
    this.logger.log(`Server restarted: ${containerId}`);
  }

  async deleteServer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.stop().catch(() => {});
    await container.remove({ force: true });
    this.logger.log(`Server deleted: ${containerId}`);
  }

  async getStats(containerId: string) {
    const container = this.docker.getContainer(containerId);
    const stats = await container.stats({ stream: false });

    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;

    const memUsage = stats.memory_stats.usage;
    const memLimit = stats.memory_stats.limit;

    return {
      cpu: Math.round(cpuPercent * 100) / 100,
      ram: Math.round((memUsage / 1024 / 1024) * 100) / 100,
      ramLimit: Math.round((memLimit / 1024 / 1024) * 100) / 100,
    };
  }

  async getLogs(containerId: string, tail = 100): Promise<string> {
    const container = this.docker.getContainer(containerId);
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail,
      timestamps: false,
    });
    return logs.toString();
  }

  async sendCommand(containerId: string, command: string) {
    const container = this.docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: ['rcon-cli', command],
      AttachStdout: true,
      AttachStderr: true,
    });
    const stream = await exec.start({ Detach: false });
    return new Promise<string>((resolve) => {
      let output = '';
      stream.on('data', (chunk: Buffer) => { output += chunk.toString(); });
      stream.on('end', () => resolve(output));
    });
  }
}
