import { Client, ActivityType, EmbedBuilder, TextChannel } from 'discord.js';
import { CronJob } from 'cron';

export class StatusService {
  private client: Client;
  private statusJob: CronJob | null = null;
  private serverCheckJob: CronJob | null = null;

  constructor(client: Client) {
    this.client = client;
  }

  start() {
    // Update bot status every 2 minutes
    this.statusJob = new CronJob('*/2 * * * *', async () => {
      await this.updateStatus();
    });
    this.statusJob.start();

    // Server health check every 5 minutes
    this.serverCheckJob = new CronJob('*/5 * * * *', async () => {
      await this.checkServers();
    });
    this.serverCheckJob.start();

    // Initial status
    this.updateStatus();
  }

  stop() {
    this.statusJob?.stop();
    this.serverCheckJob?.stop();
  }

  private async updateStatus() {
    try {
      const stats = await this.client.api.getGlobalStats().catch(() => null);
      const playersOnline = stats?.playersOnline ?? 0;

      this.client.user?.setPresence({
        activities: [{
          name: `${playersOnline} joueurs | nexaworlds.fr`,
          type: ActivityType.Watching,
        }],
        status: 'online',
      });
    } catch {
      this.client.user?.setPresence({
        activities: [{ name: 'nexaworlds.fr', type: ActivityType.Watching }],
        status: 'online',
      });
    }
  }

  private async checkServers() {
    try {
      const servers = await this.client.api.getServers();
      const channelId = process.env.CHANNEL_STATUS;
      if (!channelId) return;

      for (const server of servers) {
        if (server.status === 'error') {
          const channel = this.client.channels.cache.get(channelId) as TextChannel;
          if (!channel) continue;

          const embed = new EmbedBuilder()
            .setTitle('Alerte Serveur')
            .setDescription(`Le serveur **${server.name}** est en erreur !`)
            .setColor(0xEF4444)
            .setTimestamp();

          await channel.send({ embeds: [embed] });
        }
      }
    } catch {
      // Silently fail
    }
  }
}
