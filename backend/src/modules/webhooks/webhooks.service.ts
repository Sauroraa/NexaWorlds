import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string };
  timestamp?: string;
  thumbnail?: { url: string };
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';

  constructor(private prisma: PrismaService) {}

  async sendPurchaseNotification(username: string, itemName: string, amount: number) {
    await this.send({
      title: 'Nouvel achat',
      description: `**${username}** a acheté **${itemName}**`,
      color: 0x7C3AED,
      fields: [
        { name: 'Montant', value: `${amount.toFixed(2)}€`, inline: true },
        { name: 'Joueur', value: username, inline: true },
      ],
      footer: { text: 'NexaWorlds Boutique' },
      timestamp: new Date().toISOString(),
    });
  }

  async sendServerNotification(serverName: string, action: string) {
    const colors: Record<string, number> = {
      started: 0x10B981,
      stopped: 0xF59E0B,
      crashed: 0xEF4444,
      created: 0x3B82F6,
    };

    await this.send({
      title: `Serveur ${action}`,
      description: `Le serveur **${serverName}** a été ${action}`,
      color: colors[action] || 0x6B7280,
      footer: { text: 'NexaWorlds Infrastructure' },
      timestamp: new Date().toISOString(),
    });
  }

  async sendVoteNotification(username: string, site: string) {
    await this.send({
      title: 'Nouveau vote',
      description: `**${username}** a voté sur **${site}**`,
      color: 0xF59E0B,
      footer: { text: 'NexaWorlds Votes' },
      timestamp: new Date().toISOString(),
    });
  }

  async sendApplicationNotification(username: string, score: number) {
    await this.send({
      title: 'Nouvelle candidature',
      description: `**${username}** a postulé pour rejoindre l'équipe`,
      color: 0x06B6D4,
      fields: [
        { name: 'Score auto', value: `${score}/100`, inline: true },
      ],
      footer: { text: 'NexaWorlds Recrutement' },
      timestamp: new Date().toISOString(),
    });
  }

  private async send(embed: DiscordEmbed) {
    if (!this.webhookUrl) {
      this.logger.warn('Discord webhook URL not configured');
      return;
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'NexaWorlds',
          avatar_url: 'https://nexaworlds.fr/logo.png',
          embeds: [embed],
        }),
      });

      await this.prisma.webhookLog.create({
        data: {
          type: embed.title,
          payload: JSON.parse(JSON.stringify(embed)),
          status: response.status,
          response: response.ok ? 'OK' : await response.text(),
        },
      });
    } catch (error) {
      this.logger.error('Failed to send Discord webhook', error);
    }
  }
}
