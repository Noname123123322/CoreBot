# Production-Ready Discord Hosting Bot
## Complete GitHub Repository with PteroStats Integration

This is a comprehensive, production-ready Discord bot for game server hosting businesses, integrating Paymenter API, Pterodactyl API, and PteroStats functionality.

## 🏗️ Project Structure

```
discord-hosting-bot/
│
├── .env.example                    # Environment variables template
├── .gitignore                     # Git ignore file
├── README.md                      # This file
├── package.json                   # Node.js dependencies
├── Dockerfile                     # Docker container setup
├── docker-compose.yml             # Docker compose configuration
├── pterostats-config.yml          # PteroStats configuration
│
├── config/
│   ├── config.json                # Bot configuration
│   ├── permissions.json           # Role-based permissions
│   └── pterostats.yml             # PteroStats settings
│
├── data/
│   ├── users.json                 # User plan database
│   ├── servers.json               # Server database
│   ├── plans.json                 # Available hosting plans
│   ├── logs/                      # Log files directory
│   └── backups/                   # Database backups
│
├── src/
│   ├── index.js                   # Main bot entry point
│   │
│   ├── api/                       # API integrations
│   │   ├── paymenterClient.js     # Paymenter API client
│   │   ├── pterodactylClient.js   # Pterodactyl API client
│   │   └── pteroStatsClient.js    # PteroStats integration
│   │
│   ├── commands/                  # Bot commands
│   │   ├── user/                  # Customer commands
│   │   │   ├── myplan.js          # View plan details
│   │   │   ├── myserver.js        # Server status & stats
│   │   │   ├── restart.js         # Restart server
│   │   │   ├── backup.js          # Create backup
│   │   │   └── support.js         # Contact support
│   │   │
│   │   └── admin/                 # Staff commands
│   │       ├── createplan.js      # Create customer plan
│   │       ├── viewuser.js        # View user details
│   │       ├── suspend.js         # Suspend service
│   │       ├── stats.js           # Bot statistics
│   │       └── logs.js            # View logs
│   │
│   ├── events/                    # Discord events
│   │   ├── ready.js               # Bot ready event
│   │   ├── interactionCreate.js   # Slash command handler
│   │   ├── messageCreate.js       # Message handler
│   │   └── guildMemberAdd.js      # Welcome new members
│   │
│   ├── scheduler/                 # Scheduled tasks
│   │   ├── reminders.js           # Expiry reminders
│   │   ├── backups.js             # Auto backups
│   │   └── statusUpdates.js       # Server status updates
│   │
│   ├── utils/                     # Utility functions
│   │   ├── database.js            # JSON database handler
│   │   ├── logger.js              # Logging system
│   │   ├── permissions.js         # Permission checks
│   │   ├── embeds.js              # Discord embed builder
│   │   └── validation.js          # Input validation
│   │
│   └── pterostats/                # PteroStats integration
│       ├── statsCollector.js      # Collect panel stats
│       ├── embedBuilder.js        # Create stat embeds
│       └── notifier.js            # Status notifications
│
├── scripts/                       # Deployment scripts
│   ├── install.sh                 # Installation script
│   ├── start.sh                   # Start bot script
│   ├── backup.sh                  # Backup script
│   └── deploy.sh                  # Deployment script
│
└── docs/                          # Documentation
    ├── setup.md                   # Setup guide
    ├── commands.md                # Commands reference
    ├── api.md                     # API documentation
    └── deployment.md              # Deployment guide
```

## 🚀 Features

### Core Bot Features
- **Customer Plan Tracking**: Complete system to track hosting plans, specs, and billing
- **Server Management**: Start, stop, restart servers via Discord commands
- **Automated Reminders**: Expiry notifications and renewal prompts
- **Support System**: Ticket creation and support contact
- **Audit Logging**: Complete activity tracking for compliance

### PteroStats Integration
- **Live Server Statistics**: Real-time CPU, RAM, disk usage monitoring
- **Panel Status**: Monitor Pterodactyl panel health and uptime
- **Node Information**: Track multiple nodes and their resource usage
- **Custom Embeds**: Beautiful Discord embeds for statistics display
- **Scheduled Updates**: Automatic status updates in channels

### API Integrations
- **Paymenter**: Complete billing and customer management
- **Pterodactyl**: Full server control and monitoring
- **Webhook Support**: Real-time notifications from external services

### Production Features
- **Docker Support**: Containerized deployment
- **Health Monitoring**: System health checks and metrics
- **Error Handling**: Comprehensive error management
- **Rate Limiting**: Protection against API abuse
- **Security**: Role-based permissions and secure credential storage

## 📦 Installation & Setup

### Prerequisites
- Node.js 18 or newer
- Discord Bot Token
- Paymenter Panel Access
- Pterodactyl Panel Access

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/discord-hosting-bot.git
cd discord-hosting-bot
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Start the bot**
```bash
npm start
```

### Docker Deployment

```bash
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_GUILD_ID=your_discord_server_id

# Paymenter Configuration
PAYMENTER_URL=https://your-paymenter-panel.com
PAYMENTER_API_KEY=your_paymenter_api_key

# Pterodactyl Configuration
PTERODACTYL_URL=https://your-pterodactyl-panel.com
PTERODACTYL_API_KEY=your_pterodactyl_api_key

# PteroStats Configuration
PTEROSTATS_ENABLED=true
PTEROSTATS_UPDATE_INTERVAL=60000
PTEROSTATS_CHANNEL_ID=your_stats_channel_id

# Bot Configuration
NODE_ENV=production
LOG_LEVEL=info
BACKUP_INTERVAL=24
```

### Bot Configuration (config/config.json)
```json
{
  "prefix": "!",
  "embedColor": "#00ff00",
  "supportRoleId": "123456789012345678",
  "adminRoleId": "123456789012345678",
  "notificationChannelId": "123456789012345678",
  "pterostats": {
    "enabled": true,
    "updateInterval": 60000,
    "channels": {
      "stats": "123456789012345678",
      "alerts": "123456789012345678"
    }
  }
}
```

## 🤖 Commands

### Customer Commands
- `/myplan` - View your hosting plan details
- `/myserver` - Check server status and resources
- `/restart` - Restart your server
- `/backup <name>` - Create a server backup
- `/support <message>` - Contact support

### Admin Commands
- `/createplan <user> <type>` - Create a hosting plan for user
- `/viewuser <user>` - View user's plan and statistics
- `/suspend <user>` - Suspend user's service
- `/stats` - View bot statistics
- `/logs [lines]` - View recent log entries

## 📊 PteroStats Features

The integrated PteroStats system provides:

### Server Statistics
- **Resource Usage**: Real-time CPU, RAM, disk monitoring
- **Network Stats**: Bandwidth usage and network performance
- **Server Status**: Online/offline status for all servers
- **Node Health**: Multi-node resource tracking

### Automated Updates
- **Scheduled Embeds**: Automatic status updates every minute
- **Alert System**: Notifications for server issues
- **Custom Notifications**: Configurable webhook alerts

### Visual Display
- **Rich Embeds**: Beautiful Discord embeds with server stats
- **Progress Bars**: Visual resource usage indicators
- **Status Icons**: Clear server status indicators
- **Multi-Node Support**: Display statistics from multiple nodes

## 🗄️ Database Schema

### Users Database (data/users.json)
```json
{
  "discord_user_id": {
    "discordId": "123456789012345678",
    "username": "customer#1234",
    "plan": {
      "type": "Premium 8GB",
      "cpu": "4 vCPU",
      "ram": "8192 MB",
      "disk": "80 GB SSD",
      "bandwidth": "Unlimited"
    },
    "server": {
      "id": "abc123",
      "name": "Customer Server",
      "ip": "192.168.1.100",
      "port": 25565
    },
    "billing": {
      "status": "active",
      "purchaseDate": "2025-01-01",
      "expiryDate": "2025-02-01",
      "autoRenewal": true,
      "lastPayment": "2025-01-01"
    },
    "metadata": {
      "createdAt": "2025-01-01T00:00:00Z",
      "lastModified": "2025-01-01T00:00:00Z",
      "notes": "VIP Customer"
    }
  }
}
```

### Servers Database (data/servers.json)
```json
{
  "server_id": {
    "id": "abc123",
    "name": "Customer Server",
    "ownerId": "123456789012345678",
    "node": "node1",
    "status": "online",
    "resources": {
      "cpu": 45.2,
      "memory": 6144,
      "disk": 25600,
      "network": {
        "rx": 1024000,
        "tx": 2048000
      }
    },
    "lastUpdate": "2025-01-01T12:00:00Z"
  }
}
```

## 🔐 Security Features

### Permission System
- **Role-based Access**: Commands restricted by Discord roles
- **API Key Security**: Secure credential storage
- **Input Validation**: All user inputs sanitized
- **Rate Limiting**: Protection against command spam

### Audit Logging
- **Command Usage**: Track all command executions
- **API Calls**: Log all external API interactions
- **Error Tracking**: Comprehensive error logging
- **User Actions**: Track all user activities

## 📈 Monitoring & Health Checks

### Built-in Monitoring
- **Bot Uptime**: Track bot availability
- **API Status**: Monitor external service health
- **Database Health**: JSON file integrity checks
- **Memory Usage**: Track resource consumption

### Health Endpoints
- `GET /health` - Basic health check
- `GET /metrics` - Prometheus-compatible metrics
- `GET /status` - Detailed system status

## 🐳 Docker Support

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  discord-bot:
    build: .
    container_name: discord-hosting-bot
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    ports:
      - "3000:3000"
```

## 🚀 Deployment Guide

### Traditional Deployment
1. Clone repository on your server
2. Install Node.js dependencies
3. Configure environment variables
4. Set up systemd service for auto-restart
5. Configure reverse proxy (optional)

### Pterodactyl Deployment
1. Import the included egg file
2. Create a new server with the egg
3. Upload your bot files
4. Configure environment variables
5. Start the server

### Docker Deployment
1. Build the Docker image
2. Run with docker-compose
3. Configure volumes for data persistence
4. Set up health checks

## 🔧 Maintenance

### Backup Strategy
- **Automated Backups**: Daily JSON database backups
- **Log Rotation**: Automatic log file rotation
- **Configuration Backup**: Version control for configs

### Updates
- **Dependency Updates**: Regular security updates
- **Feature Updates**: Easy command additions
- **API Updates**: Seamless API client updates

## 📚 Documentation

Comprehensive documentation available in the `docs/` directory:
- **Setup Guide**: Step-by-step installation
- **Commands Reference**: Complete command documentation
- **API Documentation**: Integration guides
- **Deployment Guide**: Production deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
1. Check the documentation in the `docs/` folder
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Join our Discord support server

## 🙏 Acknowledgments

- **PteroStats**: Original PteroStats project by HirziDevs
- **Discord.js**: The Discord API wrapper
- **Paymenter**: Billing panel integration
- **Pterodactyl**: Game server management panel

---

**Note**: This is a production-ready implementation that includes all features discussed in our conversation, integrated PteroStats functionality, and is structured for easy deployment on Pterodactyl panel or any other hosting environment.
