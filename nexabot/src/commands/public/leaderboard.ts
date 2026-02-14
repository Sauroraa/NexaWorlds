import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { Colors, getRepBadge } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Classements NexaWorlds')
    .addSubcommand(sub =>
      sub.setName('rep')
        .setDescription('Top reputation')
        .addIntegerOption(opt =>
          opt.setName('page').setDescription('Numero de page')))
    .addSubcommand(sub =>
      sub.setName('votes')
        .setDescription('Top voteurs'))
    .addSubcommand(sub =>
      sub.setName('money')
        .setDescription('Top argent ( NexaLink)'))
    .addSubcommand(sub =>
      sub.setName('kills')
        .setDescription('Top kills')),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const client = interaction.client as any;

    switch (sub) {
      case 'rep':
        return this.showRepLeaderboard(interaction, client);
      case 'votes':
        return this.showVotesLeaderboard(interaction, client);
      case 'money':
        return this.showMoneyLeaderboard(interaction, client);
      case 'kills':
        return this.showKillsLeaderboard(interaction, client);
    }
  },

  async showRepLeaderboard(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const leaders = await client.api.getRepLeaderboard(10);

      const embed = new EmbedBuilder()
        .setTitle('🏆 Classement Reputation')
        .setColor(Colors.REPUTATION)
        .setTimestamp();

      if (!leaders || leaders.length === 0) {
        embed.setDescription('Aucun classement disponible.');
      } else {
        let description = '';
        leaders.forEach((player: any, index: number) => {
          const badge = getRepBadge(player.points);
          const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
          description += `${medals[index]} **${player.username}** ${badge.emoji} - ${player.points} pts\n`;
        });
        embed.setDescription(description);
      }

      embed.setFooter({ text: 'NexaWorlds Leaderboard' });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer le classement.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async showVotesLeaderboard(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const leaders = await client.api.getTopVoters();

      const embed = new EmbedBuilder()
        .setTitle('🗳️ Top Voteurs')
        .setColor(Colors.GOLD)
        .setTimestamp();

      if (!leaders || leaders.length === 0) {
        embed.setDescription('Aucun vote pour le moment.');
      } else {
        let description = '';
        leaders.forEach((voter: any, index: number) => {
          const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
          description += `${medals[index]} **${voter.username}** - ${voter.votes} votes\n`;
        });
        embed.setDescription(description);
      }

      embed.setFooter({ text: 'NexaWorlds Leaderboard' });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer le top.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async showMoneyLeaderboard(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const leaders = await client.api.getMoneyLeaderboard();

      const embed = new EmbedBuilder()
        .setTitle('💰 Top Argent')
        .setColor(Colors.SUCCESS)
        .setTimestamp();

      if (!leaders || leaders.length === 0) {
        embed.setDescription('Aucun classement disponible.');
      } else {
        let description = '';
        leaders.forEach((player: any, index: number) => {
          const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
          description += `${medals[index]} **${player.username}** - ${player.balance} Coins\n`;
        });
        embed.setDescription(description);
      }

      embed.setFooter({ text: 'NexaWorlds Leaderboard' });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer le top.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async showKillsLeaderboard(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const leaders = await client.api.getKillsLeaderboard();

      const embed = new EmbedBuilder()
        .setTitle('⚔️ Top Kills')
        .setColor(Colors.ERROR)
        .setTimestamp();

      if (!leaders || leaders.length === 0) {
        embed.setDescription('Aucun classement disponible.');
      } else {
        let description = '';
        leaders.forEach((player: any, index: number) => {
          const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
          description += `${medals[index]} **${player.username}** - ${player.kills} kills\n`;
        });
        embed.setDescription(description);
      }

      embed.setFooter({ text: 'NexaWorlds Leaderboard' });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer le top.');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
