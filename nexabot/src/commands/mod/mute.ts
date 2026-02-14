import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  GuildMember,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Reducer au silence un membre')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Le membre a muter').setRequired(true))
    .addStringOption(opt =>
      opt.setName('duree').setDescription('Duree (ex: 1h, 30m, 7d)').setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison').setDescription('Raison du mute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.options.getMember('membre') as GuildMember;
    const duration = interaction.options.getString('duree', true);
    const reason = interaction.options.getString('raison', true);

    await interaction.deferReply();

    if (!member) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Membre introuvable.');
      return interaction.editReply({ embeds: [embed] });
    }

    // Parse duration
    const durationMs = parseDuration(duration);
    if (!durationMs) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Format de duree invalide. Utilisez: 1s, 1m, 1h, 1d');
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      const client = interaction.client as any;

      // Apply timeout
      await member.timeout(durationMs, reason);

      // Save to DB
      await client.api.logModeration({
        userId: member.id,
        type: 'mute',
        reason,
        duration,
        issuedBy: interaction.user.id,
      });

      // DM the member
      try {
        const dmEmbed = new EmbedBuilder()
          .setTitle('🔇 Mute NexaWorlds')
          .setColor(Colors.WARNING)
          .setDescription(`Tu as ete reduit au silence sur **NexaWorlds**`)
          .addFields(
            { name: 'Duree', value: duration },
            { name: 'Raison', value: reason },
            { name: 'Par', value: interaction.user.username },
          )
          .setTimestamp();
        await member.send({ embeds: [dmEmbed] });
      } catch {
        // DM closed
      }

      const embed = new EmbedBuilder()
        .setTitle('🔇 Membre reduit au silence')
        .setColor(Colors.SUCCESS)
        .setDescription(`**${member.user.username}** a ete mute.`)
        .addFields(
          { name: 'Duree', value: duration, inline: true },
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
        .setDescription(`Impossible de mute ce membre: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};

function parseDuration(duration: string): number | null {
  const regex = /^(\d+)(s|m|h|d)$/;
  const match = duration.match(regex);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
}
