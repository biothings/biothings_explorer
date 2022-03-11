const redis = require("redis");
// const { checkServerIdentity } = require("tls");
// const redisLock = require('redis-lock');
const { promisify } = require("util");

let client;

const enableRedis = (!(process.env.REDIS_HOST === undefined)) && (!(process.env.REDIS_PORT === undefined));

if (enableRedis === true) {
    const details = {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    };
    if (process.env.REDIS_PASSWORD) { details.auth_pass = process.env.REDIS_PASSWORD }
    if (process.env.REDIS_TLS_ENABLED) { details.tls = { checkServerIdentity: () => undefined } }
    client = redis.createClient(details);
}

const timeoutFunc = (func, timeoutms=0) => {
    return (...args) => {
      return new Promise(async (resolve, reject) => {
        const timeout = timeoutms
          ? timeoutms
          : parseInt(process.env.REDIS_TIMEOUT || 30000);
        let done = false;
        setTimeout(() => {
          if (!done) {
            reject(new Error(`redis call timed out, args: ${JSON.stringify(...args)}`));
          }
        }, timeout);
        const returnValue = await func(...args);
        done = true;
        resolve(returnValue);
      });
    };
  };

const redisClient =
enableRedis === true
? {
    ...client,
    getAsync: timeoutFunc(promisify(client.get).bind(client)),
    setAsync: timeoutFunc(promisify(client.set).bind(client)),
    hsetAsync: timeoutFunc(promisify(client.hset).bind(client)),
    hgetallAsync: timeoutFunc(promisify(client.hgetall).bind(client)),
    expireAsync: timeoutFunc(promisify(client.expire).bind(client)),
    delAsync: timeoutFunc(promisify(client.del).bind(client)),
    // lock: timeoutFunc(promisify(redisLock(client)), 20 * 60 * 1000),
    hmsetAsync: timeoutFunc(promisify(client.hmset).bind(client)),
    keysAsync: timeoutFunc(promisify(client.keys).bind(client)),
    existsAsync: timeoutFunc(promisify(client.exists).bind(client)),
    }
: {};

module.exports = redisClient;
