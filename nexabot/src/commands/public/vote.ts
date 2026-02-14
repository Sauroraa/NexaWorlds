import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

const VOTE_LINKS = [
  { name: 'Serveur Minecraft', url: process.env.VOTE_LINK_1 || 'https://minecraft-server.eu/vote/nexaworlds' },
  { name: 'Serveur Minecraft', url: process.env.VOTE_LINK_2 || 'https://minecraft-servers.org/vote/nexaworlds' },
  { name: 'TopG', url: process.env.VOTE_LINK_3 || 'https://topg.org/minecraft-servers/vote/nexaworlds' },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Voter pour NexaWorlds')
    .addSubcommand(sub =>
      sub.setName('links')
        .setDescription('Obtenir les liens de vote'))
    .addSubcommand(sub =>
      sub.setName('stats')
        .setDescription('Voir vos statistiques de vote'))
    .addSubcommand(sub =>
      sub.setName('top')
        .setDescription('Top voteurs du mois')),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const client = interaction.client as any;

    switch (sub) {
      case 'links':
        return this.showLinks(interaction);
      case 'stats':
        return this.showStats(interaction, client);
      case 'top':
        return this.showTop(interaction, client);
    }
  },

  async showLinks(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('🗳️ Voter pour NexaWorlds')
      .setColor(Colors.GOLD)
      .setDescription('Votre vote nous aide a grandir ! Chaque vote donne des recompenses.')
      .addFields(
        { name: 'Pourquoi voter ?', value: '- Soutenir le serveur\n- Obtenir des recompenses\n- Aider la communaute a grandir', inline: false },
      )
      .setTimestamp();

    let linkDescription = '';
    VOTE_LINKS.forEach((link, index) => {
      linkDescription += `**${index + 1}.** [Voter sur ${link.name}](${link.url})\n`;
    });

    embed.addFields({ name: 'Liens de vote', value: linkDescription });

    await interaction.reply({ embeds: [embed] });
  },

  async showStats(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      // Get user by Discord ID or username
      const userId = interaction.user.id;
      const stats = await client.api.getVoteStatsByUser(userId);

      const embed = new EmbedBuilder()
        .setTitle(`📊 Statistiques de vote - ${interaction.user.username}`)
        .setColor(Colors.INFO)
        .addFields(
          { name: 'Total votes', value: String(stats.totalVotes || 0), inline: true },
          { name: 'Votes ce mois', value: String(stats.monthlyVotes || 0), inline: true },
          { name: 'Recompenses claim', value: String(stats.rewardsClaimed || 0), inline: true },
        )
        .setTimestamp();

      if (stats.canVote) {
        embed.addFields({
          name: 'Prochain vote',
          value: 'Vous pouvez des maintenant voter !',
          inline: false,
        });
      } else if (stats.nextVoteTime) {
        embed.addFields({
          name: 'Prochain vote',
          value: stats.nextVoteTime,
          inline: false,
        });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer vos statistiques.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async showTop(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const top = await client.api.getTopVoters();

      const embed = new EmbedBuilder()
        .setTitle('🏆 Top Voteurs du Mois')
        .setColor(Colors.GOLD)
        .setTimestamp();

      if (!top || top.length === 0) {
        embed.setDescription('Aucun vote pour le moment.');
      } else {
        const topList = top
          .map((voter: any, index: number) => {
            const medals = ['🥇', '🥈', '🥉'];
            const medal = index < 3 ? medals[index] : '⬜';
            return `${medal} **${voter.username}** - ${voter.votes} vote(s)`;
          })
          .join('\n');

        embed.setDescription(topList);
      }

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
