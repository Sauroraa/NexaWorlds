import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Definir le slowmode d\'un salon')
    .addChannelOption(opt =>
      opt.setName('salon').setDescription('Le salon (defaut: salon actuel)'))
    .addIntegerOption(opt =>
      opt.setName('secondes').setDescription('Delai en secondes (0 pour desactiver)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel('salon') || interaction.channel;
    const seconds = interaction.options.getInteger('secondes', true);

    await interaction.deferReply();

    if (!channel || !channel.isTextBased()) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Salon invalide.');
      return interaction.editReply({ embeds: [embed] });
    }

    if (seconds < 0 || seconds > 21600) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Le slowmode doit etre entre 0 et 21600 secondes (6 heures).');
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      await channel.setRateLimitPerUser(seconds);

      const embed = new EmbedBuilder()
        .setTitle('⏰ Slowmode modifie')
        .setColor(Colors.SUCCESS)
        .setDescription(`Le slowmode de ${channel} est maintenant de **${seconds} seconde(s)**.`)
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
        .setDescription(`Impossible de modifier le slowmode: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
