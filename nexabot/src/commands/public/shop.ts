import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { Colors } from '../../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Gestion boutique NexaWorlds')
    .addSubcommand(sub =>
      sub.setName('profile')
        .setDescription('Voir le profil boutique')
        .addStringOption(opt =>
          opt.setName('joueur').setDescription('Nom du joueur')))
    .addSubcommand(sub =>
      sub.setName('history')
        .setDescription('Historique des commandes')
        .addStringOption(opt =>
          opt.setName('joueur').setDescription('Nom du joueur')))
    .addSubcommand(sub =>
      sub.setName('top')
        .setDescription('Top acheteurs du mois'))
    .addSubcommand(sub =>
      sub.setName('stats')
        .setDescription('Statistiques globales de la boutique')),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const client = interaction.client as any;

    switch (sub) {
      case 'profile':
        return this.showProfile(interaction, client);
      case 'history':
        return this.showHistory(interaction, client);
      case 'top':
        return this.showTop(interaction, client);
      case 'stats':
        return this.showStats(interaction, client);
    }
  },

  async showProfile(interaction: ChatInputCommandInteraction, client: any) {
    const username = interaction.options.getString('joueur') || interaction.user.username;

    await interaction.deferReply();

    try {
      const profile = await client.api.getShopProfile(username);

      const embed = new EmbedBuilder()
        .setTitle(`🛒 Profil Boutique - ${username}`)
        .setColor(Colors.GOLD)
        .addFields(
          { name: 'Total depense', value: `${profile.totalSpent || 0}€`, inline: true },
          { name: 'Commandes', value: String(profile.orderCount || 0), inline: true },
          { name: 'Articles achetes', value: String(profile.itemsBought || 0), inline: true },
        )
        .setTimestamp();

      if (profile.lastOrder) {
        embed.addFields({
          name: 'Derniere commande',
          value: `${profile.lastOrder.date} - ${profile.lastOrder.total}€`,
          inline: false,
        });
      }

      embed.setFooter({ text: 'NexaWorlds Boutique' });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription(error.response?.data?.message || 'Impossible de recuperer le profil.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async showHistory(interaction: ChatInputCommandInteraction, client: any) {
    const username = interaction.options.getString('joueur') || interaction.user.username;

    await interaction.deferReply();

    try {
      const history = await client.api.getShopHistory(username);

      const embed = new EmbedBuilder()
        .setTitle(`📦 Historique - ${username}`)
        .setColor(Colors.INFO)
        .setTimestamp();

      if (!history || history.length === 0) {
        embed.setDescription('Aucune commande trouvee.');
      } else {
        for (const order of history.slice(0, 10)) {
          const items = Array.isArray(order.items) 
            ? order.items.map((i: any) => i.name).join(', ') 
            : 'Articles';
          
          embed.addFields({
            name: `#${order.id.slice(-6)} - ${order.total}€`,
            value: `**Status:** ${order.status}\n**Items:** ${items}\n**Date:** ${order.createdAt}`,
            inline: false,
          });
        }
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer l\'historique.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async showTop(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const top = await client.api.getTopBuyers();

      const embed = new EmbedBuilder()
        .setTitle('🏆 Top Acheteurs du Mois')
        .setColor(Colors.GOLD)
        .setTimestamp();

      if (!top || top.length === 0) {
        embed.setDescription('Aucun acheteur pour le moment.');
      } else {
        const topList = top
          .map((buyer: any, index: number) => {
            const medals = ['🥇', '🥈', '🥉'];
            const medal = index < 3 ? medals[index] : '⬜';
            return `${medal} **${buyer.username}** - ${buyer.totalSpent}€ (${buyer.orderCount} commandes)`;
          })
          .join('\n');

        embed.setDescription(topList);
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer le top.');
      await interaction.editReply({ embeds: [embed] });
    }
  },

  async showStats(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    try {
      const stats = await client.api.getShopStats();

      const embed = new EmbedBuilder()
        .setTitle('📊 Statistiques Boutique')
        .setColor(Colors.INFO)
        .addFields(
          { name: 'Total commandes', value: String(stats.totalOrders || 0), inline: true },
          { name: 'Commandes aujourd\'hui', value: String(stats.todayOrders || 0), inline: true },
          { name: 'Revenus totaux', value: `${stats.totalRevenue || 0}€`, inline: true },
          { name: 'Revenus aujourd\'hui', value: `${stats.todayRevenue || 0}€`, inline: true },
          { name: 'Articles en stock', value: String(stats.itemsInStock || 0), inline: true },
          { name: 'Membres ayant achete', value: String(stats.totalBuyers || 0), inline: true },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription('Impossible de recuperer les statistiques.');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
