import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Gestion des serveurs Minecraft')
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Liste des serveurs'))
    .addSubcommand(sub =>
      sub.setName('status')
        .setDescription('Statut d\'un serveur')
        .addStringOption(opt =>
          opt.setName('serveur').setDescription('Nom du serveur').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('start')
        .setDescription('Demarrer un serveur')
        .addStringOption(opt =>
          opt.setName('serveur').setDescription('Nom du serveur').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('stop')
        .setDescription('Arreter un serveur')
        .addStringOption(opt =>
          opt.setName('serveur').setDescription('Nom du serveur').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('restart')
        .setDescription('Redemarrer un serveur')
        .addStringOption(opt =>
          opt.setName('serveur').setDescription('Nom du serveur').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('console')
        .setDescription('Voir la console d\'un serveur')
        .addStringOption(opt =>
          opt.setName('serveur').setDescription('Nom du serveur').setRequired(true))
        .addIntegerOption(opt =>
          opt.setName('lignes').setDescription('Nombre de lignes (10-50)')))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const client = interaction.client as any;

    switch (sub) {
      case 'list':
        return this.listServers(interaction, client);
      case 'status':
        return this.showStatus(interaction, client);
      case 'start':
        return this.startServer(interaction, client);
      case 'stop':
        return this.stopServer(interaction, client);
      case 'restart':
        return this.restartServer(interaction, client);
      case 'console':
        return this.showConsole(interaction, client);
    }
  },

  async listServers(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const servers = await client.api.getServers();

      const embed = new EmbedBuilder()
        .setTitle('📡 Serveurs Minecraft')
        .setColor(Colors.INFO)
        .setTimestamp();

      if (!servers || servers.length === 0) {
        embed.setDescription('Aucun serveur configure.');
      } else {
        for (const server of servers) {
          const statusEmoji = server.status === 'running' ? '🟢' : server.status === 'starting' ? '🟡' : '🔴';
          embed.addFields({
            name: `${statusEmoji} ${server.name}`,
            value: `**Status:** ${server.status}\n**Version:** ${server.version}\n**Joueurs:** ${server.onlinePlayers || 0}/${server.maxPlayers}\n**RAM:** ${server.ram}GB`,
            inline: true,
          });
        }
      }

      embed.setFooter({ text: 'NexaWorlds Server Management' });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer les serveurs.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async showStatus(interaction: ChatInputCommandInteraction, client: any) {
    const serverName = interaction.options.getString('serveur', true);

    await interaction.deferReply();

    try {
      const server = await client.api.getServerStats(serverName);

      const embed = new EmbedBuilder()
        .setTitle(`📊 ${server.name}`)
        .setColor(Colors.INFO)
        .addFields(
          { name: 'Status', value: server.status, inline: true },
          { name: 'Version', value: server.version, inline: true },
          { name: 'Uptime', value: server.uptime || 'N/A', inline: true },
          { name: 'Joueurs', value: `${server.onlinePlayers || 0}/${server.maxPlayers}`, inline: true },
          { name: 'TPS', value: server.tps ? `${server.tps}/20` : 'N/A', inline: true },
          { name: 'RAM', value: `${server.ramUsed || 0}/${server.ram}GB`, inline: true },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription(`Serveur introuvable: ${serverName}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async startServer(interaction: ChatInputCommandInteraction, client: any) {
    const serverName = interaction.options.getString('serveur', true);

    await interaction.deferReply();

    try {
      const result = await client.api.controlServer(serverName, 'start', interaction.user.id);

      const embed = new EmbedBuilder()
        .setTitle('✅ Serveur demarre')
        .setColor(Colors.SUCCESS)
        .setDescription(`Le serveur **${serverName}** est en cours de demarrage.`)
        .addFields(
          { name: 'Par', value: interaction.user.username, inline: true },
          { name: 'Action', value: 'start', inline: true },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Log channel
      const logChannel = interaction.guild?.channels.cache.get(process.env.LOG_SERVER_CHANNEL || '');
      if (logChannel && logChannel.isTextBased()) {
        await logChannel.send({ embeds: [embed] });
      }
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription(`Impossible de demarrer le serveur: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async stopServer(interaction: ChatInputCommandInteraction, client: any) {
    const serverName = interaction.options.getString('serveur', true);

    await interaction.deferReply();

    try {
      const result = await client.api.controlServer(serverName, 'stop', interaction.user.id);

      const embed = new EmbedBuilder()
        .setTitle('🛑 Serveur arrete')
        .setColor(Colors.WARNING)
        .setDescription(`Le serveur **${serverName}** est en cours d'arret.`)
        .addFields(
          { name: 'Par', value: interaction.user.username, inline: true },
          { name: 'Action', value: 'stop', inline: true },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Log channel
      const logChannel = interaction.guild?.channels.cache.get(process.env.LOG_SERVER_CHANNEL || '');
      if (logChannel && logChannel.isTextBased()) {
        await logChannel.send({ embeds: [embed] });
      }
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription(`Impossible d'arreter le serveur: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async restartServer(interaction: ChatInputCommandInteraction, client: any) {
    const serverName = interaction.options.getString('serveur', true);

    await interaction.deferReply();

    try {
      const result = await client.api.controlServer(serverName, 'restart', interaction.user.id);

      const embed = new EmbedBuilder()
        .setTitle('🔄 Serveur redemarre')
        .setColor(Colors.INFO)
        .setDescription(`Le serveur **${serverName}** est en cours de redemarrage.`)
        .addFields(
          { name: 'Par', value: interaction.user.username, inline: true },
          { name: 'Action', value: 'restart', inline: true },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Log channel
      const logChannel = interaction.guild?.channels.cache.get(process.env.LOG_SERVER_CHANNEL || '');
      if (logChannel && logChannel.isTextBased()) {
        await logChannel.send({ embeds: [embed] });
      }
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription(`Impossible de redemarrer le serveur: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async showConsole(interaction: ChatInputCommandInteraction, client: any) {
    const serverName = interaction.options.getString('serveur', true);
    const lines = interaction.options.getInteger('lignes') || 20;

    await interaction.deferReply();

    try {
      const consoleLogs = await client.api.getServerConsole(serverName, Math.min(lines, 50));

      const embed = new EmbedBuilder()
        .setTitle(`📺 Console - ${serverName}`)
        .setColor(Colors.CYAN)
        .setDescription('```\n' + (consoleLogs || 'Aucune sortie disponible') + '\n```')
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer la console.');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
