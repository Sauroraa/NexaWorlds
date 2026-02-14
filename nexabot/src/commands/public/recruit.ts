import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruit')
    .setDescription('Postuler pour le staff')
    .addSubcommand(sub =>
      sub.setName('apply')
        .setDescription('Faire une candidature')
        .addStringOption(opt =>
          opt.setName('discord').setDescription('Votre pseudo Discord').setRequired(true))
        .addIntegerOption(opt =>
          opt.setName('age').setDescription('Votre age').setRequired(true))
        .addStringOption(opt =>
          opt.setName('experience').setDescription('Votre experience (minimum 5 mots)').setRequired(true))
        .addStringOption(opt =>
          opt.setName('motivation').setDescription('Vos motivations (minimum 10 mots)').setRequired(true))
        .addStringOption(opt =>
          opt.setName('disponibilite').setDescription('Vos disponibilites').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('status')
        .setDescription('Voir le statut de votre candidature'))
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Liste des candidatures (Staff)')),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const client = interaction.client as any;

    switch (sub) {
      case 'apply':
        return this.apply(interaction, client);
      case 'status':
        return this.status(interaction, client);
      case 'list':
        return this.list(interaction, client);
    }
  },

  async apply(interaction: ChatInputCommandInteraction, client: any) {
    const discord = interaction.options.getString('discord', true);
    const age = interaction.options.getInteger('age', true);
    const experience = interaction.options.getString('experience', true);
    const motivation = interaction.options.getString('motivation', true);
    const disponibilite = interaction.options.getString('disponibilite', true);

    await interaction.deferReply({ ephemeral: true });

    // Check minimum words
    const expWords = experience.split(' ').length;
    const motWords = motivation.split(' ').length;

    if (expWords < 5) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Votre experience doit contenir au moins 5 mots.');
      return interaction.editReply({ embeds: [embed] });
    }

    if (motWords < 10) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Vos motivations doivent contenir au moins 10 mots.');
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      const application = await client.api.submitApplication({
        discord,
        age,
        experience,
        motivation,
        disponibilite,
        userId: interaction.user.id,
      });

      const embed = new EmbedBuilder()
        .setTitle('✅ Candidature envoyee')
        .setColor(Colors.SUCCESS)
        .setDescription('Votre candidature a ete enregistree. Vous recevrez une reponse par message prive.')
        .addFields(
          { name: 'Reference', value: `#${application.id.slice(-6)}`, inline: true },
          { name: 'Statut', value: 'En attente', inline: true },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Notify staff channel
      const staffChannel = interaction.guild?.channels.cache.get(process.env.STAFF_CHANNEL || '');
      if (staffChannel && staffChannel.isTextBased()) {
        const notifyEmbed = {
          embeds: [{
            title: '📋 Nouvelle candidature',
            color: Colors.INFO,
            description: `Nouvelle candidature de **${interaction.user.username}**`,
            fields: [
              { name: 'Discord', value: discord, inline: true },
              { name: 'Age', value: String(age), inline: true },
            ],
            footer: { text: `Ref: #${application.id.slice(-6)}` },
            timestamp: new Date().toISOString(),
          }],
        };
        await staffChannel.send(notifyEmbed);
      }
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de soumettre la candidature.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async status(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const application = await client.api.getApplicationByUser(interaction.user.id);

      if (!application) {
        const embed = new EmbedBuilder()
          .setTitle('Aucune candidature')
          .setColor(Colors.WARNING)
          .setDescription('Vous n\'avez pas de candidature en cours.');
        return interaction.editReply({ embeds: [embed] });
      }

      const statusColors: Record<string, number> = {
        pending: Colors.WARNING,
        interview: Colors.INFO,
        accepted: Colors.SUCCESS,
        rejected: Colors.ERROR,
      };

      const embed = new EmbedBuilder()
        .setTitle('📋 Statut de votre candidature')
        .setColor(statusColors[application.status] || Colors.INFO)
        .addFields(
          { name: 'Reference', value: `#${application.id.slice(-6)}`, inline: true },
          { name: 'Statut', value: application.status.toUpperCase(), inline: true },
          { name: 'Score', value: String(application.score || 0), inline: true },
        )
        .setTimestamp();

      if (application.status === 'rejected') {
        embed.addFields({ name: 'Note', value: 'Votre candidature n\'a pas ete retenue. Vous pouvez reessayer plus tard.' });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer le statut.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async list(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const applications = await client.api.getApplications();

      const embed = new EmbedBuilder()
        .setTitle('📋 Liste des Candidatures')
        .setColor(Colors.INFO)
        .setTimestamp();

      if (!applications || applications.length === 0) {
        embed.setDescription('Aucune candidature en attente.');
      } else {
        const pendingApps = applications.filter((a: any) => a.status === 'pending');
        embed.addFields({ name: 'En attente', value: `${pendingApps.length} candidature(s)`, inline: true });

        for (const app of applications.slice(0, 10)) {
          const statusEmoji = app.status === 'pending' ? '⏳' : app.status === 'interview' ? '📝' : app.status === 'accepted' ? '✅' : '❌';
          embed.addFields({
            name: `${statusEmoji} ${app.username} (#${app.id.slice(-6)})`,
            value: `**Statut:** ${app.status}\n**Score:** ${app.score || 0}\n**Date:** ${app.createdAt}`,
            inline: false,
          });
        }
      }

      embed.setFooter({ text: `Total: ${applications?.length || 0} candidature(s)` });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer les candidatures.');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
