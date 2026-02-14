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
    .setName('ban')
    .setDescription('Bannir un joueur')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Le membre a bannir').setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison').setDescription('Raison du bannissement').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('jours').setDescription('Nombre de jours de messages a supprimer (1-7)'))
    .addBooleanOption(opt =>
      opt.setName('silent').setDescription('Ne pas envoyer de message public'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.options.getMember('membre') as GuildMember;
    const reason = interaction.options.getString('raison', true);
    const days = interaction.options.getInteger('jours') || 0;
    const silent = interaction.options.getBoolean('silent') || false;

    await interaction.deferReply({ ephemeral: silent });

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
        .setDescription('Vous ne pouvez pas vous bannir vous-meme.');
      return interaction.editReply({ embeds: [embed] });
    }

    if (!member.bannable) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Je ne peux pas bannir ce membre. Il a可能是 un role plus eleve.');
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      const client = interaction.client as any;
      
      // Envoyer un DM au membre
      try {
        const dmEmbed = new EmbedBuilder()
          .setTitle('🔨 Bannissement NexaWorlds')
          .setColor(Colors.ERROR)
          .setDescription(`Tu as ete banni de **NexaWorlds**`)
          .addFields(
            { name: 'Raison', value: reason },
            { name: 'Par', value: interaction.user.username },
          )
          .setTimestamp();
        await member.send({ embeds: [dmEmbed] });
      } catch {
        // DM closed
      }

      // Bannir le membre
      await member.ban({ reason, deleteMessageDays: Math.min(days, 7) });

      // Sauvegarder en DB
      await client.api.logModeration({
        userId: member.id,
        type: 'ban',
        reason,
        issuedBy: interaction.user.id,
      });

      const embed = new EmbedBuilder()
        .setTitle('🔨 Membre banni')
        .setColor(Colors.SUCCESS)
        .setDescription(`**${member.user.username}** a ete banni.`)
        .addFields(
          { name: 'Raison', value: reason, inline: true },
          { name: 'Messages supprimes', value: `${days} jour(s)`, inline: true },
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
        .setDescription(`Impossible de bannir ce membre: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
