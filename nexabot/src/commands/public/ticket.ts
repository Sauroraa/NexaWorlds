import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

const TICKET_CATEGORIES: Record<string, { label: string; emoji: string; description: string }> = {
  support: { label: 'Support General', emoji: '🎫', description: 'Questions et aide generale' },
  shop: { label: 'Boutique', emoji: '🛒', description: 'Problemes avec les achats' },
  report: { label: 'Report Joueur', emoji: '🚨', description: 'Signaler un joueur' },
  partnership: { label: 'Partenariat', emoji: '🤝', description: 'Demandes de partenariat' },
  recruitment: { label: 'Recrutement', emoji: '📋', description: 'Postuler pour le staff' },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Creer un ticket de support')
    .addSubcommand(sub =>
      sub.setName('create')
        .setDescription('Creer un nouveau ticket')
        .addStringOption(opt =>
          opt.setName('categorie')
            .setDescription('Categorie du ticket')
            .setRequired(true)
            .addChoices(
              { name: 'Support General', value: 'support' },
              { name: 'Boutique', value: 'shop' },
              { name: 'Report Joueur', value: 'report' },
              { name: 'Partenariat', value: 'partnership' },
              { name: 'Recrutement', value: 'recruitment' },
            ))
        .addStringOption(opt =>
          opt.setName('sujet').setDescription('Sujet du ticket'))
        .addStringOption(opt =>
          opt.setName('description').setDescription('Description de votre probleme')))
    .addSubcommand(sub =>
      sub.setName('close')
        .setDescription('Fermer le ticket actuel'))
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Liste de tous les tickets (Staff)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const client = interaction.client as any;

    switch (sub) {
      case 'create':
        return this.createTicket(interaction, client);
      case 'close':
        return this.closeTicket(interaction, client);
      case 'list':
        return this.listTickets(interaction, client);
    }
  },

  async createTicket(interaction: ChatInputCommandInteraction, client: any) {
    const category = interaction.options.getString('categorie', true);
    const subject = interaction.options.getString('sujet') || 'Sans sujet';
    const description = interaction.options.getString('description') || 'Aucune description';

    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    if (!guild) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de creer un ticket en dehors d\'un serveur.');
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      // Create ticket channel
      const user = interaction.user;
      const ticketNumber = await client.redis.incr('ticket:counter');
      const channelName = `ticket-${ticketNumber}`;

      const categoryInfo = TICKET_CATEGORIES[category];
      
      // Get or create ticket category
      let ticketCategory = guild.channels.cache.find(
        c => c.type === ChannelType.GuildCategory && c.name === '🎫 Tickets'
      );
      
      if (!ticketCategory) {
        ticketCategory = await guild.channels.create({
          name: '🎫 Tickets',
          type: ChannelType.GuildCategory,
        });
      }

      // Create the channel
      const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: ticketCategory.id,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['ViewChannel'],
          },
          {
            id: user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          },
          // Add staff role
          {
            id: process.env.STAFF_ROLE_ID || '',
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages'],
          },
        ],
      });

      // Save ticket to DB
      const ticket = await client.api.createTicket({
        userId: user.id,
        channelId: channel.id,
        category,
        subject,
        description,
      });

      // Send ticket message
      const embed = new EmbedBuilder()
        .setTitle(`${categoryInfo.emoji} Nouveau Ticket #${ticketNumber}`)
        .setColor(Colors.INFO)
        .setDescription(`**Sujet:** ${subject}\n\n**Description:** ${description}`)
        .addFields(
          { name: 'Categorie', value: categoryInfo.label, inline: true },
          { name: 'Cree par', value: user.username, inline: true },
          { name: 'Statut', value: 'Ouvert', inline: true },
        )
        .setTimestamp();

      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('ticket:close')
            .setLabel('Fermer le ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒'),
          new ButtonBuilder()
            .setCustomId('ticket:claim')
            .setLabel('Prendre en charge')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✋'),
        );

      await channel.send({ embeds: [embed], components: [row] });

      // Confirm to user
      const confirmEmbed = new EmbedBuilder()
        .setTitle('✅ Ticket cree')
        .setColor(Colors.SUCCESS)
        .setDescription(`Votre ticket a ete cree: ${channel}`)
        .setTimestamp();

      await interaction.editReply({ embeds: [confirmEmbed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription(`Impossible de creer le ticket: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async closeTicket(interaction: ChatInputCommandInteraction, client: any) {
    const channel = interaction.channel;

    await interaction.deferReply({ ephemeral: true });

    if (!channel || !channel.name.startsWith('ticket-')) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Cette commande doit etre executee dans un ticket.');
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      // Update DB
      await client.api.closeTicket(channel.id, interaction.user.id);

      // Send close message
      const embed = new EmbedBuilder()
        .setTitle('🔒 Ticket ferme')
        .setColor(Colors.WARNING)
        .setDescription(`Ce ticket a ete ferme par ${interaction.user.username}.`)
        .setTimestamp();

      await channel.send({ embeds: [embed] });

      // Delete after delay
      setTimeout(async () => {
        try {
          await channel.delete();
        } catch {
          // Channel already deleted
        }
      }, 5000);

      const confirmEmbed = new EmbedBuilder()
        .setTitle('✅ Ticket ferme')
        .setColor(Colors.SUCCESS)
        .setDescription('Le ticket sera ferme dans quelques secondes.')
        .setTimestamp();

      await interaction.editReply({ embeds: [confirmEmbed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription(`Impossible de fermer le ticket: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async listTickets(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const tickets = await client.api.getTickets();

      const embed = new EmbedBuilder()
        .setTitle('📋 Liste des Tickets')
        .setColor(Colors.INFO)
        .setTimestamp();

      if (!tickets || tickets.length === 0) {
        embed.setDescription('Aucun ticket actif.');
      } else {
        const openTickets = tickets.filter((t: any) => t.status === 'open');
        const closedTickets = tickets.filter((t: any) => t.status === 'closed');

        embed.addFields(
          { name: 'Ouverts', value: `${openTickets.length} ticket(s)`, inline: true },
          { name: 'Fermes', value: `${closedTickets.length} ticket(s)`, inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
        );

        for (const ticket of tickets.slice(0, 10)) {
          const categoryInfo = TICKET_CATEGORIES[ticket.category] || { emoji: '🎫', label: ticket.category };
          embed.addFields({
            name: `${categoryInfo.emoji} #${ticket.id.slice(-4)} - ${ticket.subject || 'Sans sujet'}`,
            value: `Par: <@${ticket.userId}> | Statut: ${ticket.status}`,
            inline: false,
          });
        }
      }

      embed.setFooter({ text: `Total: ${tickets?.length || 0} ticket(s)` });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription(`Impossible de recuperer les tickets: ${error.message}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
