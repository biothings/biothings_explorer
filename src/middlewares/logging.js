const winston = require('winston');
const expressWinston = require('express-winston');
require('winston-daily-rotate-file');


class LoggingHandler {
    setRoutes(app) {
        const transport = new (winston.transports.DailyRotateFile)({
            filename: 'BioThings-Explorer-TRAPI-%DATE%.log',
            dirname: (process.env.NODE_ENV !== "production") ? "." : "/var/log/bte",
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        });
        app.use(expressWinston.logger({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.colorize(),
                winston.format.json(),

            ),
            transports: [
                transport
            ],
            requestWhitelist: ['headers', 'body'],
            meta: true, // optional: control whether you want to log the meta data about the request (default to true)
            msg: "HTTP {{req.ip}} {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
            expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
            colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
            ignoreRoute: function (req, res) { return false; }, // optional: allows to skip some log messages based on request and/or response
            statusLevels: false,
            level: (req, res) => {
                let level = "";
                if (res.statusCode >= 100) { level = "info"; }
                if (res.statusCode >= 400) { level = "warn"; }
                if (res.statusCode >= 500) { level = "error"; }
                // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
                if (res.statusCode == 401 || res.statusCode == 403) { level = "critical"; }
                // No one should be using the old path, so always warn for those
                return level;
            }
        }));
    }
}

module.exports = new LoggingHandler();