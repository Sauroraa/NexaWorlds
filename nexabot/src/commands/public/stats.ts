import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Statistiques en direct')
    .addSubcommand(sub =>
      sub.setName('global')
        .setDescription('Statistiques globales'))
    .addSubcommand(sub =>
      sub.setName('serveur')
        .setDescription('Statistiques d\'un serveur')
        .addStringOption(opt =>
          opt.setName('serveur').setDescription('Nom du serveur'))),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const client = interaction.client as any;

    switch (sub) {
      case 'global':
        return this.showGlobalStats(interaction, client);
      case 'serveur':
        return this.showServerStats(interaction, client);
    }
  },

  async showGlobalStats(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const stats = await client.api.getGlobalStats();

      const embed = new EmbedBuilder()
        .setTitle('📊 Statistiques NexaWorlds')
        .setColor(Colors.INFO)
        .addFields(
          { name: 'Joueurs en ligne', value: String(stats.onlinePlayers || 0), inline: true },
          { name: 'Membres Discord', value: String(stats.discordMembers || 0), inline: true },
          { name: 'Votes totals', value: String(stats.totalVotes || 0), inline: true },
          { name: 'Tickets resolus', value: String(stats.ticketsResolved || 0), inline: true },
          { name: 'Commandes boutique', value: String(stats.totalOrders || 0), inline: true },
          { name: 'Uptime global', value: stats.uptime || 'N/A', inline: true },
        )
        .setTimestamp();

      embed.setFooter({ text: 'NexaWorlds Stats' });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer les statistiques.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async showServerStats(interaction: ChatInputCommandInteraction, client: any) {
    const serverName = interaction.options.getString('serveur') || 'survival';

    await interaction.deferReply();

    try {
      const stats = await client.api.getServerStats(serverName);

      const statusColor = stats.status === 'running' ? Colors.SUCCESS : Colors.ERROR;
      
      const embed = new EmbedBuilder()
        .setTitle(`📊 ${stats.name}`)
        .setColor(statusColor)
        .addFields(
          { name: 'Status', value: stats.status.toUpperCase(), inline: true },
          { name: 'Version', value: stats.version, inline: true },
          { name: 'Joueurs', value: `${stats.onlinePlayers || 0}/${stats.maxPlayers}`, inline: true },
          { name: 'TPS', value: stats.tps ? `${stats.tps}/20` : 'N/A', inline: true },
          { name: 'Uptime', value: stats.uptime || 'N/A', inline: true },
          { name: 'RAM', value: `${stats.ramUsed || 0}/${stats.ram}GB`, inline: true },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Serveur introuvable ou inaccessible.');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
