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

    //operation so that KEY_1 can be updated with max length of KEY_2 (array)
    this.client.defineCommand("arrayLenUpdate", {
      numberOfKeys: 2,
      lua: `
      local len = #(redis.call('SMEMBERS', KEYS[2]) or {})
      local val = redis.call('GET', KEYS[1]) or 0
      if tonumber(val) < len then redis.call('SET', KEYS[1], len)
      end
      `,
    });
    
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

  async startRequest(requestNum) {
    if (this.clientEnabled) {
      await this.client.sadd(this.prefix+"requests", requestNum)
      await this.client.arrayLenUpdate(this.prefix+"high_requests", this.prefix+"requests")
    }
  }

  async endRequest(requestNum) {
    if (this.clientEnabled) {
      await this.client.srem(this.prefix+"requests", requestNum)
    }
  }

  async getConcurrentHighMark() {
    return await this.client.get(this.prefix+"high_requests")
  }

  async getLogs() {
    if (this.clientEnabled) {
      const [user_failiures, server_failiures, successes, concurrent_high_mark] = await Promise.all([
        this.getUserFailiures(),
        this.getServerFailiures(),
        this.getSuccesses(),
        this.getConcurrentHighMark()
      ])

      return {
        user_failiures,
        server_failiures,
        successes,
        concurrent_high_mark
      }
    }
    return {};
  }
}

module.exports = new RedisLogger("bte:logging:")