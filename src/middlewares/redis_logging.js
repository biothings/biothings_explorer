const redisLogger = require("../controllers/redis_logger")

class RedisLoggingMiddleware {
  cur_req_id = 0

  setRoutes(app) {
    app.use((req, res, next) => {
      this.cur_req_id++
      const req_id = this.cur_req_id
      redisLogger.startRequest(req_id)

      //when a response has been fully sent
      res.on("finish", () => {
        console.log(`Exiting with ${res.statusCode}`)
        if (res.statusCode >= 500) {
          redisLogger.logServerFailiure();
        } else if (res.statusCode >= 400) {
          redisLogger.logUserFailiure();
        } else if (res.statusCode >= 100) {
          redisLogger.logSuccess();
        }
      });

      //when a response has been fully sent OR connection closed prematurely
      res.on("close", () => {
        redisLogger.endRequest(req_id)
      });
      setTimeout(next,2000)
    })
  }
}

module.exports = new RedisLoggingMiddleware();