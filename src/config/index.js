const compression = require('compression')
const cors = require("cors");
var bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const dotenv = require("dotenv");
const Sentry = require('@sentry/node');


module.exports = class Config {
    constructor(app) {
        this.app = app;
    }

    setConfig() {
        this.setSentry();
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
        const slowLimiter = rateLimit({
            windowMs: 1 * 60 * 1000, //1min
            max: process.env.MAX_QUERIES_PER_MIN || 15
        });
        const medLimiter = rateLimit({
            windowMs: 1 * 60 * 1000, //1min
            max: process.env.MAX_QUERIES_PER_MIN || 30
        });
        const fastLimiter = rateLimit({
            windowMs: 1 * 60 * 1000, //1min
            max: process.env.MAX_QUERIES_PER_MIN || 60
        });
        this.app.use("/v1/query", slowLimiter);
        this.app.use("/v1/team/:team_name/query", slowLimiter);
        this.app.use("/v1/team/:team_name/query", slowLimiter);
        this.app.use("/v1/meta_knowledge_graph", medLimiter);
        this.app.use("/v1/team/:teamName/meta_knowledge_graph", medLimiter);
        this.app.use("/v1/smartapi/:smartapiID/meta_knowledge_graph", medLimiter);
    }

    setSentry() {
        Sentry.init({
            dsn: "https://5297933ef0f6487c9fd66532bb1fcefe@o4505444772806656.ingest.sentry.io/4505449737420800",
            integrations: [
              // enable HTTP calls tracing
              new Sentry.Integrations.Http({ tracing: true }),
              // enable Express.js middleware tracing
              new Sentry.Integrations.Express({ app: this.app }),
              // Automatically instrument Node.js libraries and frameworks
              ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
            ],
          
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        });

        // RequestHandler creates a separate execution context, so that all
        // transactions/spans/breadcrumbs are isolated across requests
        this.app.use(Sentry.Handlers.requestHandler({user: false}));
        // TracingHandler creates a trace for every incoming request
        this.app.use(Sentry.Handlers.tracingHandler());
    }
}
