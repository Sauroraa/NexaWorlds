import { Client, Events } from 'discord.js';

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`NexaBot connecte en tant que ${client.user?.tag}`);
    console.log(`Serveurs: ${client.guilds.cache.size}`);

    // Start status rotation & server monitoring
    client.statusService.start();
  },
};
