const redis = require("redis");
const { checkServerIdentity } = require("tls");
const { promisify } = require("util");

let client;

const enableRedis = (!(process.env.REDIS_HOST === undefined)) && (!(process.env.REDIS_PORT === undefined));

if (enableRedis === true) {
    const details = {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    };
    if (process.env.REDIS_PASSWORD) { details.auth_pass = process.env.REDIS_PASSWORD }
    if (process.end.REDIS_TLS_ENABLED) { details.tls = { checkServerIdentity: () => undefined } }
    client = redis.createClient(details);
}

const redisClient = (enableRedis === true) ? {
    ...client,
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
    hmsetAsync: promisify(client.hmset).bind(client),
    keysAsync: promisify(client.keys).bind(client),
    existsAsync: promisify(client.exists).bind(client)
} : {};

module.exports = redisClient;
