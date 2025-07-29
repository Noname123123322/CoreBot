# PteroStats Integration

PteroStats has been integrated into this project using **Git Submodules** so you can easily track updates from the upstream repository.

## Adding PteroStats as a Submodule

1. Add the submodule:

```bash
git submodule add https://github.com/HirziDevs/PteroStats.git external/PteroStats
```

2. Initialize and update submodule:

```bash
git submodule update --init --recursive
```

3. When upstream releases a new version (e.g., `v4.1.0`), update submodule:

```bash
cd external/PteroStats
git checkout v4.1.0 # or latest tag
cd -
```

4. Commit the changes:

```bash
git add external/PteroStats
git commit -m "Update PteroStats to v4.1.0"
```

## Configuration

### `pterostats-config.yml`

```yml
panel_url: https://your-pterodactyl-panel.com
panel_api_key: ${PTERODACTYL_API_KEY}
channel_id: 123456789012345678
log_error: true
custom_emoji: true
blacklist_nodes: []
notifier:
  enabled: true
  webhook_url: https://discord.com/api/webhooks/123/ABC
```

Place the file in the root project directory or in `config/` and reference it in your environment variables:

```env
PTEROSTATS_CONFIG_PATH=./pterostats-config.yml
```

## Running PteroStats with the Bot

The bot uses **PteroStats as a library** to collect stats and push them to Discord.

`src/pterostats/statsCollector.js`:

```javascript
const { spawn } = require('child_process');
const path = require('path');
const { logger } = require('../utils/logger');

function startPteroStats() {
  const scriptPath = path.join(__dirname, '../../external/PteroStats/index.js');

  const child = spawn('node', [scriptPath], {
    env: {
      ...process.env,
      CONFIG_PATH: process.env.PTEROSTATS_CONFIG_PATH || '../../pterostats-config.yml',
    },
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  child.on('error', (err) => logger.error('PteroStats subprocess error:', err));
  child.on('exit', (code) => logger.warn(`PteroStats subprocess exited with code ${code}`));
}

module.exports = { startPteroStats };
```

The bot will spawn PteroStats as a child process, ensuring it runs alongside the bot. Logs will be merged into the bot's console and log files.

---

**Note:** You can also deploy PteroStats as a standalone server using the PteroStats egg. In that case, configure `PTEROSTATS_URL` and set `PTEROSTATS_ENABLED=false` in your `.env` file.