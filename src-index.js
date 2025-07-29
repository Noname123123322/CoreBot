require('dotenv').config();
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const { createServer } = require('http');
const fs = require('fs');
const path = require('path');
const { logger } = require('./utils/logger');
const { initializeDatabase } = require('./utils/database');
const { startScheduler } = require('./scheduler/reminders');
const { startPteroStats } = require('./pterostats/statsCollector');

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Initialize collections
client.commands = new Collection();
client.cooldowns = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      logger.debug(`Loaded command: ${command.data.name}`);
    } else {
      logger.warn(`Command at ${filePath} is missing required "data" or "execute" property.`);
    }
  }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
  logger.debug(`Loaded event: ${event.name}`);
}

// Health check server
const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      discord: client.isReady() ? 'connected' : 'disconnected',
      memory: process.memoryUsage()
    }));
  } else if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    const metrics = `
# HELP bot_uptime_seconds Bot uptime in seconds
# TYPE bot_uptime_seconds counter
bot_uptime_seconds ${process.uptime()}

# HELP bot_memory_usage_bytes Memory usage in bytes
# TYPE bot_memory_usage_bytes gauge
bot_memory_usage_bytes{type="rss"} ${process.memoryUsage().rss}
bot_memory_usage_bytes{type="heapUsed"} ${process.memoryUsage().heapUsed}
bot_memory_usage_bytes{type="heapTotal"} ${process.memoryUsage().heapTotal}

# HELP bot_discord_status Discord connection status
# TYPE bot_discord_status gauge
bot_discord_status ${client.isReady() ? 1 : 0}
`;
    res.end(metrics);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Initialize application
async function initialize() {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized');

    // Start health check server
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      logger.info(`Health check server running on port ${port}`);
    });

    // Login to Discord
    await client.login(process.env.DISCORD_TOKEN);

  } catch (error) {
    logger.error('Failed to initialize bot:', error);
    process.exit(1);
  }
}

// Error handling
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
  client.destroy();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  client.destroy();
  server.close();
  process.exit(0);
});

// Start the bot
initialize();
