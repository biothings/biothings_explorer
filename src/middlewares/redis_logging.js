const redisLogger = require("../controllers/redis_logger")

class RedisLoggingMiddleware {
  setRoutes(app) {
    app.use((req, res, next) => {
      res.on("finish", () => {
        if (res.statusCode >= 500) {
          redisLogger.logServerFailiure();
        } else if (res.statusCode >= 400) {
          redisLogger.logUserFailiure();
        } else if (res.statusCode >= 100) {
          redisLogger.logSuccess();
        }
      });
      next();
    })
  }
}

module.exports = new RedisLoggingMiddleware();