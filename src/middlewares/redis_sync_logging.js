const redisLogger = require("../controllers/redis_logger")

class RedisSyncLoggingMiddleware {
  cur_req_id = 0

  getMiddleware() {
    return (req, res, next) => {
      this.cur_req_id++
      const req_id = this.cur_req_id
      redisLogger.startSyncRequest(req_id)
      console.log(`Starting ${req_id}`)

      //when a response has been fully sent OR connection closed prematurely
      res.on("close", () => {
        console.log(`Ending ${req_id}`)
        redisLogger.endSyncRequest(req_id)
      });
      // setTimeout(next,2000)
      next()
    }
  }
}

module.exports = new RedisSyncLoggingMiddleware();