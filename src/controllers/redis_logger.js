// const { redisClient } = require("@biothings-explorer/query_graph_handler");
const Redis = require("ioredis");

class RedisLogger {
  prefix = "bte:logging:"
  logs = ["test", "successes", "server_failiures", "user_failiures"]

  async logTest(value) {
    if (this.clientEnabled) await this.client.set(this.prefix+"test", value)
  }

  async logUserFailiure() {
    if (this.clientEnabled) await this.client.incr(this.prefix+"user_failiures")
  }
  
  async logServerFailiure() {
    if (this.clientEnabled) await this.client.incr(this.prefix+"server_failiures")
  }

  async logSuccess() {
    if (this.clientEnabled) await this.client.incr(this.prefix+"successes")
  }

  async getLogs() {
    const log_results = {}
    if (this.clientEnabled) {
      await Promise.all(this.logs.map((log) => {
        return (async () => {
          log_results[log] = await this.client.get(this.prefix+log)
        })()
      }))
    }
    return log_results
  }

  constructor() {
    if (process.env.REDIS_HOST === undefined || process.env.REDIS_PORT === undefined) {
      this.clientEnabled = false;
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
}

module.exports = new RedisLogger()