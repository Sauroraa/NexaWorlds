import { Events, GuildMember } from 'discord.js';
import { Colors } from '../embeds/colors';

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember) {
    const client = member.client as any;

    // Log channel
    const logChannel = member.guild.channels.cache.get(process.env.LOG_JOIN_CHANNEL || '');
    if (logChannel && logChannel.isTextBased()) {
      const logEmbed = {
        embeds: [{
          title: '👋 Depart membre',
          color: Colors.WARNING,
          description: `${member.user.username} a quitte le serveur.`,
          fields: [
            { name: 'ID', value: member.id, inline: true },
            { name: 'A rejoint', value: member.joinedAt?.toLocaleDateString() || 'Inconnu', inline: true },
            { name: 'Membre #', value: String(member.guild.memberCount), inline: true },
          ],
          thumbnail: { url: member.user.displayAvatarURL() },
          footer: { text: 'NexaWorlds Logs' },
          timestamp: new Date().toISOString(),
        }],
      };
      await logChannel.send(logEmbed);
    }

    console.log(`Member left: ${member.user.username} (${member.id})`);
  },
};
