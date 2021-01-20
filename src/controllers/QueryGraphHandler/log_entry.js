module.exports = class LogEntry {

    constructor(level = "DEBUG", code = null, message = null) {
        this.level = level;
        this.message = message;
        this.code = code;
    }

    getLog() {
        return {
            timestamp: new Date().toISOString(),
            level: this.level,
            message: this.message,
            code: this.code
        }
    }
}