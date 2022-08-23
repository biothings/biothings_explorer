const { redisLogger } = require("../controllers/redis_logger")

class RouteLogs {
  setRoutes(app) {
    app.get('/logs', async (req, res, next) => {
      try {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(await redisLogger.getLogs()));
      } catch (e) {
        console.error(e)
      }
    })
  }
}

module.exports = new RouteLogs();