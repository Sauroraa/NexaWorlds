import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { Colors, getRepBadge } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rep')
    .setDescription('Gestion de la reputation')
    .addSubcommand(sub =>
      sub.setName('profile')
        .setDescription('Voir le profil de reputation')
        .addStringOption(opt =>
          opt.setName('joueur').setDescription('Nom du joueur')))
    .addSubcommand(sub =>
      sub.setName('give')
        .setDescription('Donner de la reputation')
        .addStringOption(opt =>
          opt.setName('joueur').setDescription('Nom du joueur').setRequired(true))
        .addIntegerOption(opt =>
          opt.setName('montant').setDescription('Nombre de points').setRequired(true))
        .addStringOption(opt =>
          opt.setName('raison').setDescription('Raison').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers))
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Retirer de la reputation')
        .addStringOption(opt =>
          opt.setName('joueur').setDescription('Nom du joueur').setRequired(true))
        .addIntegerOption(opt =>
          opt.setName('montant').setDescription('Nombre de points').setRequired(true))
        .addStringOption(opt =>
          opt.setName('raison').setDescription('Raison').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const client = interaction.client as any;

    switch (sub) {
      case 'profile':
        return this.showProfile(interaction, client);
      case 'give':
        return this.giveRep(interaction, client);
      case 'remove':
        return this.removeRep(interaction, client);
    }
  },

  async showProfile(interaction: ChatInputCommandInteraction, client: any) {
    const username = interaction.options.getString('joueur') || interaction.user.username;

    await interaction.deferReply();

    try {
      const profile = await client.api.getRepProfile(username);
      const badge = getRepBadge(profile.points);

      const embed = new EmbedBuilder()
        .setTitle(`⭐ Reputation - ${username}`)
        .setColor(Colors.REPUTATION)
        .setThumbnail(`https://minotar.net/helm/${username}/100.png`)
        .addFields(
          { name: 'Rang', value: `${badge.emoji} ${badge.name}`, inline: true },
          { name: 'Points', value: String(profile.points), inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: '✅ Positifs', value: String(profile.positive), inline: true },
          { name: '❌ Negatifs', value: String(profile.negative), inline: true },
          { name: 'Total donne', value: String(profile.totalGiven), inline: true },
        )
        .setTimestamp();

      // Add recent history if available
      if (profile.history && profile.history.length > 0) {
        const recentHistory = profile.history.slice(0, 5)
          .map((h: any) => `${h.type === 'positive' ? '✅' : '❌'} ${h.amount > 0 ? '+' : ''}${h.amount} - ${h.reason}`)
          .join('\n');
        embed.addFields({ name: 'Historique recent', value: recentHistory, inline: false });
      }

      embed.setFooter({ text: 'NexaWorlds Reputation' });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Joueur introuvable ou erreur.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async giveRep(interaction: ChatInputCommandInteraction, client: any) {
    const username = interaction.options.getString('joueur', true);
    const amount = interaction.options.getInteger('montant', true);
    const reason = interaction.options.getString('raison', true);

    await interaction.deferReply();

    try {
      const result = await client.api.addReputation(username, amount, reason, interaction.user.id);

      const embed = new EmbedBuilder()
        .setTitle('✅ Reputation ajoutee')
        .setColor(Colors.SUCCESS)
        .setDescription(`**+${amount}** reputation ajoutee a **${username}**`)
        .addFields(
          { name: 'Raison', value: reason, inline: true },
          { name: 'Par', value: interaction.user.username, inline: true },
          { name: 'Nouveau total', value: String(result.newTotal), inline: true },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Log channel
      const logChannel = interaction.guild?.channels.cache.get(process.env.LOG_MOD_CHANNEL || '');
      if (logChannel && logChannel.isTextBased()) {
        await logChannel.send({ embeds: [embed] });
      }
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible d\'ajouter la reputation.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async removeRep(interaction: ChatInputCommandInteraction, client: any) {
    const username = interaction.options.getString('joueur', true);
    const amount = interaction.options.getInteger('montant', true);
    const reason = interaction.options.getString('raison', true);

    await interaction.deferReply();

    try {
      const result = await client.api.removeReputation(username, amount, reason, interaction.user.id);

      const embed = new EmbedBuilder()
        .setTitle('❌ Reputation retiree')
        .setColor(Colors.ERROR)
        .setDescription(`**-${amount}** reputation retiree a **${username}**`)
        .addFields(
          { name: 'Raison', value: reason, inline: true },
          { name: 'Par', value: interaction.user.username, inline: true },
          { name: 'Nouveau total', value: String(result.newTotal), inline: true },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Log channel
      const logChannel = interaction.guild?.channels.cache.get(process.env.LOG_MOD_CHANNEL || '');
      if (logChannel && logChannel.isTextBased()) {
        await logChannel.send({ embeds: [embed] });
      }
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de retirer la reputation.');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
