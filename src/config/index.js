const compression = require('compression')
const cors = require("cors");
var bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

module.exports = class Config {
    constructor(app) {
        this.app = app;
    }

    setConfig() {
        this.setNodeEnv();
        this.setBodyParser();
        this.setCors();
        this.setCompression();
        this.setHttpHeaders();
        this.setLimiter();
        return this.app;
    }

    setNodeEnv() {
        process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    }

    setBodyParser() {
        // support application/json type post data
        this.app.use(bodyParser.json({ limit: '50mb' }));
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        return this.app;
    }

    setCors() {
        const options = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
        };
        this.app.use(cors(options));
    }

    setCompression() {
        this.app.use(compression());
    }

    setHttpHeaders() {
        this.app.use(
            helmet({
                contentSecurityPolicy: false,
            })
        )
    }

    setLimiter() {
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, //15mins
            max: 200 //200 requests
        });
        this.app.use("/query", limiter);
    }
}