const compression = require('compression')
const cors = require("cors");
var bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const dotenv = require("dotenv");


module.exports = class Config {
    constructor(app) {
        this.app = app;
    }

    setConfig() {
        this.setDotEnv();
        this.setNodeEnv();
        this.setBodyParser();
        this.setCors();
        this.setCompression();
        this.setHttpHeaders();
        this.setLimiter();
        return this.app;
    }

    setDotEnv() {
        dotenv.config();
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
            windowMs: 1 * 60 * 1000, //1min
            max: process.env.MAX_QUERIES_PER_MIN || 30
        });
        this.app.use("/v1/query", limiter);
    }
}