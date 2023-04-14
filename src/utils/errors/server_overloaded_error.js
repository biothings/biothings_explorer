class ServerOverloadedError extends Error {
  constructor(message, retryAfter, ...params) {
    super(params);
    this.name = "ServerOverloadedError";
    this.message = message ?? "Server is overloaded, please try again later.";
    this.status = 503;
    this.retryAfter = retryAfter ?? 60;
  }
}

module.exports = ServerOverloadedError;
