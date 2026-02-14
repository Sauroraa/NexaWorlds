import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Donner un avertissement a un membre')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Le membre a avertir').setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison', true);

    await interaction.deferReply();

    if (!member) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Membre introuvable.');
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      const client = interaction.client as any;

      // Save warning to DB
      const warning = await client.api.addWarning({
        userId: member.id,
        reason,
        issuedBy: interaction.user.id,
      });

      // DM the member
      try {
        const dmEmbed = new EmbedBuilder()
          .setTitle('⚠️ Avertissement NexaWorlds')
          .setColor(Colors.WARNING)
          .setDescription(`Tu as recu un avertissement sur **NexaWorlds**`)
          .addFields(
            { name: 'Raison', value: reason },
            { name: 'Par', value: interaction.user.username },
          )
          .setTimestamp();
        await member.send({ embeds: [dmEmbed] });
      } catch {
        // DM closed
      }

      const embed = new EmbedBuilder()
        .setTitle('⚠️ Avertissement donne')
        .setColor(Colors.WARNING)
        .setDescription(`**${member.username}** a recu un avertissement.`)
        .addFields(
          { name: 'Raison', value: reason, inline: true },
          { name: 'Par', value: interaction.user.username, inline: true },
          { name: 'Total', value: `${warning.totalWarnings || 1} avertissement(s)`, inline: true },
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
        .setDescription(`Impossible de donner l'avertissement: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
