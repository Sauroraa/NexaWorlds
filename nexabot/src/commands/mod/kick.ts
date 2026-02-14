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
    .setName('kick')
    .setDescription('Expulser un membre')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Le membre a expulser').setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison').setDescription('Raison de expulsion').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.options.getMember('membre') as GuildMember;
    const reason = interaction.options.getString('raison', true);

    await interaction.deferReply();

    if (!member) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Membre introuvable.');
      return interaction.editReply({ embeds: [embed] });
    }

    if (member.id === interaction.user.id) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Vous ne pouvez pas vous expulser vous-meme.');
      return interaction.editReply({ embeds: [embed] });
    }

    if (!member.kickable) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Je ne peux pas expulser ce membre. Il a peut-etre un role plus eleve.');
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      const client = interaction.client as any;

      // DM the member
      try {
        const dmEmbed = new EmbedBuilder()
          .setTitle('🚪 Expulsion NexaWorlds')
          .setColor(Colors.WARNING)
          .setDescription(`Tu as ete expulse de **NexaWorlds**`)
          .addFields(
            { name: 'Raison', value: reason },
            { name: 'Par', value: interaction.user.username },
          )
          .setTimestamp();
        await member.send({ embeds: [dmEmbed] });
      } catch {
        // DM closed
      }

      // Kick the member
      await member.kick(reason);

      // Save to DB
      await client.api.logModeration({
        userId: member.id,
        type: 'kick',
        reason,
        issuedBy: interaction.user.id,
      });

      const embed = new EmbedBuilder()
        .setTitle('🚪 Membre expulse')
        .setColor(Colors.SUCCESS)
        .setDescription(`**${member.user.username}** a ete expulse.`)
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
        .setDescription(`Impossible d'expulser ce membre: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
