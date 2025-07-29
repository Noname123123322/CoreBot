const fs = require('fs-extra');
const path = require('path');
const { logger } = require('./logger');

const DATA_DIR = path.join(__dirname, '../../data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// Ensure directories exist
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(BACKUP_DIR);

// Database files
const DB_FILES = {
  users: 'users.json',
  servers: 'servers.json',
  plans: 'plans.json',
  logs: 'activity_logs.json'
};

class Database {
  constructor() {
    this.cache = new Map();
    this.locks = new Map();
  }

  async initialize() {
    try {
      // Initialize all database files
      for (const [name, filename] of Object.entries(DB_FILES)) {
        const filePath = path.join(DATA_DIR, filename);

        if (!await fs.pathExists(filePath)) {
          await fs.writeJson(filePath, {}, { spaces: 2 });
          logger.info(`Created database file: ${filename}`);
        }

        // Load into cache
        const data = await fs.readJson(filePath);
        this.cache.set(name, data);
      }

      logger.info('Database initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async read(dbName) {
    if (!DB_FILES[dbName]) {
      throw new Error(`Unknown database: ${dbName}`);
    }

    try {
      // Return from cache if available
      if (this.cache.has(dbName)) {
        return this.cache.get(dbName);
      }

      const filePath = path.join(DATA_DIR, DB_FILES[dbName]);
      const data = await fs.readJson(filePath);
      this.cache.set(dbName, data);
      return data;
    } catch (error) {
      logger.error(`Error reading database ${dbName}:`, error);
      return {};
    }
  }

  async write(dbName, data) {
    if (!DB_FILES[dbName]) {
      throw new Error(`Unknown database: ${dbName}`);
    }

    // Prevent concurrent writes
    const lockKey = `write_${dbName}`;
    if (this.locks.has(lockKey)) {
      await this.locks.get(lockKey);
    }

    const writePromise = this._performWrite(dbName, data);
    this.locks.set(lockKey, writePromise);

    try {
      await writePromise;
      this.locks.delete(lockKey);
    } catch (error) {
      this.locks.delete(lockKey);
      throw error;
    }
  }

  async _performWrite(dbName, data) {
    try {
      const filePath = path.join(DATA_DIR, DB_FILES[dbName]);
      const tempPath = `${filePath}.tmp`;

      // Write to temporary file first
      await fs.writeJson(tempPath, data, { spaces: 2 });

      // Atomic move
      await fs.move(tempPath, filePath, { overwrite: true });

      // Update cache
      this.cache.set(dbName, data);

      logger.debug(`Database ${dbName} written successfully`);
    } catch (error) {
      logger.error(`Error writing database ${dbName}:`, error);
      throw error;
    }
  }

  async backup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(BACKUP_DIR, timestamp);

      await fs.ensureDir(backupDir);

      for (const [name, filename] of Object.entries(DB_FILES)) {
        const sourcePath = path.join(DATA_DIR, filename);
        const backupPath = path.join(backupDir, filename);

        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, backupPath);
        }
      }

      logger.info(`Database backup created: ${timestamp}`);
      return backupDir;
    } catch (error) {
      logger.error('Error creating database backup:', error);
      throw error;
    }
  }

  async getUserPlan(userId) {
    const users = await this.read('users');
    return users[userId] || null;
  }

  async setUserPlan(userId, planData) {
    const users = await this.read('users');
    users[userId] = {
      ...planData,
      lastModified: new Date().toISOString()
    };
    await this.write('users', users);
  }

  async removeUserPlan(userId) {
    const users = await this.read('users');
    delete users[userId];
    await this.write('users', users);
  }

  async getServer(serverId) {
    const servers = await this.read('servers');
    return servers[serverId] || null;
  }

  async setServer(serverId, serverData) {
    const servers = await this.read('servers');
    servers[serverId] = {
      ...serverData,
      lastUpdate: new Date().toISOString()
    };
    await this.write('servers', servers);
  }

  async logActivity(userId, action, details = {}) {
    const logs = await this.read('logs');
    const logId = Date.now().toString();

    logs[logId] = {
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    };

    await this.write('logs', logs);
  }

  async getRecentLogs(limit = 50) {
    const logs = await this.read('logs');
    const entries = Object.entries(logs)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, limit);

    return entries.map(([id, log]) => ({ id, ...log }));
  }
}

// Create singleton instance
const db = new Database();

// Initialize database
const initializeDatabase = async () => {
  await db.initialize();
};

module.exports = {
  db,
  initializeDatabase
};
