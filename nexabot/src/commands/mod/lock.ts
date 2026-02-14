import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Verrouiller un salon')
    .addChannelOption(opt =>
      opt.setName('salon').setDescription('Le salon a verrouiller (defaut: salon actuel)'))
    .addStringOption(opt =>
      opt.setName('raison').setDescription('Raison du verrouillage'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel('salon') || interaction.channel;
    const reason = interaction.options.getString('raison') || 'Raison non specifiee';

    await interaction.deferReply();

    if (!channel || !channel.isTextBased()) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Salon invalide.');
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      // Override permissions to lock the channel
      await channel.permissionOverwrites.edit(interaction.guild!.id, {
        SendMessages: false,
        AddReactions: false,
      });

      // Also lock for @everyone
      const everyoneRole = interaction.guild!.roles.everyone;
      await channel.permissionOverwrites.edit(everyoneRole, {
        SendMessages: false,
      });

      const embed = new EmbedBuilder()
        .setTitle('🔒 Salon verrouille')
        .setColor(Colors.SUCCESS)
        .setDescription(`Le salon ${channel} a ete verrouille.`)
        .addFields(
          { name: 'Raison', value: reason, inline: true },
          { name: 'Par', value: interaction.user.username, inline: true },
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
        .setDescription(`Impossible de verrouiller le salon: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
