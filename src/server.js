const debug = require("debug")("bte:biothings-explorer-trapi:server-start");

async function main() {
  await testRedisConnection(); // must happen before app to avoid issues
  const app = require("./app");
  const cron = require("./controllers/cron/index");
  const PORT = Number.parseInt(process.env.PORT) || 3000;
  cron();
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
    console.log(`⭐⭐⭐ BioThings Explorer is ready! ⭐ Try it now @ http://localhost:${PORT} ✨`)
  });
  process.env.DEBUG_COLORS = 'true';
}

async function testRedisConnection() {
  const { redisClient } = require("@biothings-explorer/query_graph_handler");

  if (redisClient.clientEnabled) { // redis enabled
    debug('Checking connection to redis...');
    try {
      await redisClient.client.pingTimeout();
      debug('Redis connection successful.');
    } catch (error) {
      debug(`Redis connection failed due to error ${error}`);
      debug(`Disabling redis for current server runtime...`);
      process.env.INTERNAL_DISABLE_REDIS = true;
    }
  }
}

main();
