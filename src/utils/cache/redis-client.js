const redis = require("redis");
const { promisify } = require("util");

let client;

const enableRedis = (!(process.env.REDIS_HOST === undefined)) && (!(process.env.REDIS_PORT === undefined));

if (enableRedis === true) {
    const details = {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
    };
    if (process.env.REDIS_PASSWORD) { details.password = process.env.REDIS_PASSWORD }
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
