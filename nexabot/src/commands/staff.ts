import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { Colors, getRoleColor } from '../embeds/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staff')
    .setDescription('Gestion du staff NexaWorlds')
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Afficher la liste du staff'))
    .addSubcommand(sub =>
      sub.setName('activity')
        .setDescription('Voir l\'activite d\'un membre staff')
        .addUserOption(opt =>
          opt.setName('membre').setDescription('Le membre staff').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('warnings')
        .setDescription('Voir les avertissements d\'un membre staff')
        .addUserOption(opt =>
          opt.setName('membre').setDescription('Le membre staff').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('warn')
        .setDescription('Avertir un membre staff')
        .addUserOption(opt =>
          opt.setName('membre').setDescription('Le membre staff').setRequired(true))
        .addStringOption(opt =>
          opt.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('promote')
        .setDescription('Promouvoir un membre staff')
        .addUserOption(opt =>
          opt.setName('membre').setDescription('Le membre a promouvoir').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('demote')
        .setDescription('Retrograder un membre staff')
        .addUserOption(opt =>
          opt.setName('membre').setDescription('Le membre a retrograder').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const client = interaction.client as any;

    await interaction.deferReply();

    try {
      switch (sub) {
        case 'list': {
          const staff = await client.api.getStaffList();

          const embed = new EmbedBuilder()
            .setTitle('Equipe NexaWorlds')
            .setColor(Colors.STAFF)
            .setTimestamp();

          if (!staff || staff.length === 0) {
            embed.setDescription('Aucun membre staff enregistre.');
          } else {
            const grouped: Record<string, any[]> = {};
            for (const member of staff) {
              if (!grouped[member.role]) grouped[member.role] = [];
              grouped[member.role].push(member);
            }

            for (const role of [...RoleHierarchy].reverse()) {
              if (grouped[role] && grouped[role].length > 0) {
                const members = grouped[role]
                  .map((m: any) => `\`${m.username}\` — ${m.isOnline ? '🟢' : '🔴'}`)
                  .join('\n');
                embed.addFields({
                  name: `${role.toUpperCase()} (${grouped[role].length})`,
                  value: members,
                  inline: false,
                });
              }
            }
          }

          embed.setFooter({ text: 'NexaWorlds Staff Management' });
          await interaction.editReply({ embeds: [embed] });
          break;
        }

        case 'activity': {
          const member = interaction.options.getUser('membre', true);
          const activity = await client.api.getStaffActivity(member.id);

          const embed = new EmbedBuilder()
            .setTitle(`Activite de ${member.username}`)
            .setColor(Colors.STAFF)
            .setThumbnail(member.displayAvatarURL())
            .addFields(
              { name: 'Role', value: activity.role || 'N/A', inline: true },
              { name: 'Temps en ligne (7j)', value: activity.onlineTime || '0h', inline: true },
              { name: 'Actions (7j)', value: String(activity.actionsCount ?? 0), inline: true },
              { name: 'Sanctions donnees', value: String(activity.sanctionsGiven ?? 0), inline: true },
              { name: 'Tickets resolus', value: String(activity.ticketsResolved ?? 0), inline: true },
              { name: 'Derniere connexion', value: activity.lastSeen || 'N/A', inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'NexaWorlds Staff Activity' });

          await interaction.editReply({ embeds: [embed] });
          break;
        }

        case 'warnings': {
          const member = interaction.options.getUser('membre', true);
          const warnings = await client.api.getStaffWarnings(member.id);

          const embed = new EmbedBuilder()
            .setTitle(`Avertissements de ${member.username}`)
            .setColor(warnings.length > 0 ? Colors.WARNING : Colors.SUCCESS)
            .setThumbnail(member.displayAvatarURL())
            .setTimestamp();

          if (!warnings || warnings.length === 0) {
            embed.setDescription('Aucun avertissement.');
          } else {
            for (const w of warnings.slice(0, 10)) {
              embed.addFields({
                name: `#${w.id} — ${w.createdAt}`,
                value: `**Raison:** ${w.reason}\n**Par:** ${w.issuedBy}`,
                inline: false,
              });
            }
            embed.setFooter({ text: `Total: ${warnings.length} avertissement(s)` });
          }

          await interaction.editReply({ embeds: [embed] });
          break;
        }

        case 'warn': {
          const member = interaction.options.getUser('membre', true);
          const reason = interaction.options.getString('raison', true);

          await client.api.addStaffWarning(member.id, reason, interaction.user.id);

          const embed = new EmbedBuilder()
            .setTitle('Avertissement donne')
            .setColor(Colors.WARNING)
            .setDescription(`**${member.username}** a recu un avertissement.`)
            .addFields(
              { name: 'Raison', value: reason },
              { name: 'Par', value: interaction.user.username },
            )
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });

          // DM the warned member
          try {
            const dmEmbed = new EmbedBuilder()
              .setTitle('Avertissement NexaWorlds')
              .setColor(Colors.WARNING)
              .setDescription(`Tu as recu un avertissement staff.`)
              .addFields({ name: 'Raison', value: reason })
              .setTimestamp();
            await member.send({ embeds: [dmEmbed] });
          } catch {
            // DMs might be closed
          }
          break;
        }

        case 'promote': {
          const member = interaction.options.getUser('membre', true);
          const result = await client.api.promoteStaff(member.id, interaction.user.id);

          const embed = new EmbedBuilder()
            .setTitle('Promotion')
            .setColor(Colors.SUCCESS)
            .setDescription(`**${member.username}** a ete promu !`)
            .addFields(
              { name: 'Ancien role', value: result.previousRole || 'N/A', inline: true },
              { name: 'Nouveau role', value: result.newRole || 'N/A', inline: true },
              { name: 'Par', value: interaction.user.username, inline: true },
            )
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });

          // Update Discord roles
          const guild = interaction.guild;
          if (guild) {
            const guildMember = await guild.members.fetch(member.id).catch(() => null);
            if (guildMember && result.newRole) {
              const roleId = process.env[`ROLE_${result.newRole.toUpperCase()}`];
              const oldRoleId = process.env[`ROLE_${result.previousRole.toUpperCase()}`];
              if (roleId) await guildMember.roles.add(roleId).catch(() => {});
              if (oldRoleId) await guildMember.roles.remove(oldRoleId).catch(() => {});
            }
          }
          break;
        }

        case 'demote': {
          const member = interaction.options.getUser('membre', true);
          const result = await client.api.demoteStaff(member.id, interaction.user.id);

          const embed = new EmbedBuilder()
            .setTitle('Retrogradation')
            .setColor(Colors.ERROR)
            .setDescription(`**${member.username}** a ete retrograde.`)
            .addFields(
              { name: 'Ancien role', value: result.previousRole || 'N/A', inline: true },
              { name: 'Nouveau role', value: result.newRole || 'N/A', inline: true },
              { name: 'Par', value: interaction.user.username, inline: true },
            )
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });

          // Update Discord roles
          const guild = interaction.guild;
          if (guild) {
            const guildMember = await guild.members.fetch(member.id).catch(() => null);
            if (guildMember && result.newRole) {
              const roleId = process.env[`ROLE_${result.newRole.toUpperCase()}`];
              const oldRoleId = process.env[`ROLE_${result.previousRole.toUpperCase()}`];
              if (roleId) await guildMember.roles.add(roleId).catch(() => {});
              if (oldRoleId) await guildMember.roles.remove(oldRoleId).catch(() => {});
            }
          }
          break;
        }
      }
    } catch (error: any) {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setColor(Colors.ERROR)
        .setDescription(error.response?.data?.message || 'Une erreur est survenue.')
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
