const redisLogger = require("../controllers/redis_logger")

class RedisLoggingMiddleware {
  setRoutes(app) {
    app.use((req, res, next) => {
      const resEnd = res.end;
      res.end = (chunk, encoding) => {
        if (res.statusCode >= 500) {
          redisLogger.logServerFailiure();
        } else if (res.statusCode >= 400) {
          redisLogger.logUserFailiure();
        } else if (res.statusCode >= 100) {
          redisLogger.logSuccess();
        }
        res.end = resEnd
        res.end(chunk, encoding)
      };
      next();
    })
  }
}

module.exports = new RedisLoggingMiddleware();