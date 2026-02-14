import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprimer des messages')
    .addIntegerOption(opt =>
      opt.setName('nombre').setDescription('Nombre de messages a supprimer (1-100)').setRequired(true))
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Ne supprimer que les messages de ce membre'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger('nombre', true);
    const member = interaction.options.getUser('membre');

    if (amount < 1 || amount > 100) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Le nombre doit etre entre 1 et 100.');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const channel = interaction.channel;
      if (!channel || !channel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setTitle('Erreur')
          .setColor(Colors.ERROR)
          .setDescription('Impossible de supprimer des messages dans ce channel.');
        return interaction.editReply({ embeds: [embed] });
      }

      let messages;

      if (member) {
        // Filter messages from specific member
        const allMessages = await channel.messages.fetch({ limit: 100 });
        const memberMessages = allMessages.filter(m => m.author.id === member.id && !m.pinned);
        const toDelete = Array.from(memberMessages.values()).slice(0, amount);
        messages = await channel.bulkDelete(toDelete, true);
      } else {
        // Delete last N messages
        messages = await channel.bulkDelete(amount, true);
      }

      const deletedCount = messages.size;

      const embed = new EmbedBuilder()
        .setTitle('🗑️ Messages supprimes')
        .setColor(Colors.SUCCESS)
        .setDescription(`${deletedCount} message(s) supprime(s).`)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Auto delete after 5 seconds
      setTimeout(async () => {
        if (interaction.editReply) {
          try {
            await interaction.deleteReply();
          } catch {
            // Already deleted
          }
        }
      }, 5000);
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription(`Impossible de supprimer les messages: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
