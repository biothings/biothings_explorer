const Redis = require("ioredis");

class RedisLogger {
  constructor(prefix) {
    this.prefix = prefix;
    this.clientEnabled = process.env.REDIS_HOST !== undefined && process.env.REDIS_PORT !== undefined;

    if (!this.clientEnabled) {
      return;
    }

    if (process.env.REDIS_CLUSTER === 'true') {
      const details = { redisOptions: {} };

      if (process.env.REDIS_PASSWORD) {
        details.redisOptions.password = process.env.REDIS_PASSWORD;
      }
      if (process.env.REDIS_TLS_ENABLED) {
        details.redisOptions.tls = { checkServerIdentity: () => undefined };
      }

      this.client = new Redis.Cluster([
        {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
      ], details);
    } else {
      const details = {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      };
      if (process.env.REDIS_PASSWORD) {
        details.password = process.env.REDIS_PASSWORD;
      }
      if (process.env.REDIS_TLS_ENABLED) {
        details.tls = { checkServerIdentity: () => undefined };
      }
      this.client = new Redis(details);
    }
    this.clientEnabled = true;
  }

  async logUserFailiure() {
    if (this.clientEnabled) await this.client.incr(this.prefix+"user_failiures")
  }

  async getUserFailiures() {
    if (this.clientEnabled) return await this.client.get(this.prefix+"user_failiures")
  }
  
  async logServerFailiure() {
    if (this.clientEnabled) await this.client.incr(this.prefix+"server_failiures")
  }

  async getServerFailiures() {
    if (this.clientEnabled) return await this.client.get(this.prefix+"server_failiures")
  }

  async logSuccess() {
    if (this.clientEnabled) await this.client.incr(this.prefix+"successes")
  }

  async getSuccesses() {
    if (this.clientEnabled) return await this.client.get(this.prefix+"successes")
  }

  async getLogs() {
    if (this.clientEnabled) {
      const [user_failiures, server_failiures, successes] = await Promise.all([
        this.getUserFailiures(),
        this.getServerFailiures(),
        this.getSuccesses()
      ])

      return {
        user_failiures,
        server_failiures,
        successes
      }
    }
    return {};
  }
}

module.exports = new RedisLogger("bte:logging:")