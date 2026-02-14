import { Events, GuildMember } from 'discord.js';
import { Colors } from '../embeds/colors';

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    const client = member.client as any;
    
    // Welcome message
    const welcomeChannel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL || '');
    if (welcomeChannel && welcomeChannel.isTextBased()) {
      const welcomeEmbed = {
        embeds: [{
          title: '🎉 Bienvenue !',
          color: Colors.SUCCESS,
          description: `Bienvenue **${member.user.username}** sur **NexaWorlds** !`,
          fields: [
            { name: ' discord', value: `<@${member.id}>`, inline: true },
            { name: 'Membre #', value: String(member.guild.memberCount), inline: true },
          ],
          thumbnail: { url: member.user.displayAvatarURL() },
          footer: { text: 'NexaWorlds' },
          timestamp: new Date().toISOString(),
        }],
      };
      await welcomeChannel.send(welcomeEmbed);
    }

    // Log channel
    const logChannel = member.guild.channels.cache.get(process.env.LOG_JOIN_CHANNEL || '');
    if (logChannel && logChannel.isTextBased()) {
      const logEmbed = {
        embeds: [{
          title: '👤 Nouveau membre',
          color: Colors.SUCCESS,
          description: `${member.user.username} a rejoint le serveur.`,
          fields: [
            { name: 'ID', value: member.id, inline: true },
            { name: 'Compte cree', value: member.user.createdAt.toLocaleDateString(), inline: true },
          ],
          thumbnail: { url: member.user.displayAvatarURL() },
          footer: { text: 'NexaWorlds Logs' },
          timestamp: new Date().toISOString(),
        }],
      };
      await logChannel.send(logEmbed);
    }

    // Auto-role
    const autoRole = process.env.AUTO_ROLE_ID;
    if (autoRole) {
      try {
        await member.roles.add(autoRole);
      } catch (error) {
        console.error('Failed to add auto-role:', error);
      }
    }

    console.log(`Member joined: ${member.user.username} (${member.id})`);
  },
};
