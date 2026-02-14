import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import { ApiService } from './services/ApiService';
import { RedisService } from './services/RedisService';
import { StatusService } from './services/StatusService';
import { loadCommands } from './utils/commandLoader';
import { loadEvents } from './utils/eventLoader';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// Extend client with custom properties
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
    api: ApiService;
    redis: RedisService;
    statusService: StatusService;
  }
}

client.commands = new Collection();
client.api = new ApiService(
  process.env.API_URL || 'http://localhost:3001/api',
  process.env.API_KEY || '',
);
client.redis = new RedisService(process.env.REDIS_URL || 'redis://localhost:6379');
client.statusService = new StatusService(client);

async function main() {
  // Load commands and events
  await loadCommands(client);
  await loadEvents(client);

  // Login
  await client.login(process.env.DISCORD_TOKEN);

  console.log('NexaBot started successfully!');
}

main().catch(console.error);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down NexaBot...');
  client.redis.disconnect();
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down NexaBot...');
  client.redis.disconnect();
  client.destroy();
  process.exit(0);
});
