const rt = require("./reasonerTranslator");
const rt2 = require("./reasonerTranslator2");
const pred = require("./predicates");
const assoc = require("./association");
const rt3 = require("./individual");
const express = require('express');
const compression = require('compression')
const cors = require("cors");
var bodyParser = require('body-parser');
const getServer = require("biothings-explorer-graphql");
const depthLimit = require("graphql-depth-limit");
const rateLimit = require("express-rate-limit");
const port = 3000
const helmet = require("helmet");
//const expressWinston = require("express-winston");
//const { createLogger, transports, format } = require("winston");
//const winston = require("winston");
//const ElasticsearchTransport = require('winston-elasticsearch');
const createServer = () => {
    const app = express()

    app.use(cors());
    app.use(compression());
    app.use(helmet());
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200
    });
    app.use("/query", limiter);

    // const esTransportOpts = {
    //     level: "info",
    //     transformer: logData => {
    //         return {
    //             "@timestamp": (new Date()).getTime(),
    //             severity: logData.level,
    //             message: `[${logData.level}] LOG Message: ${logData.message}`,
    //             fields: {}
    //         }
    //     }
    // };
    // const logger = winston.createLogger({
    //     transports: [
    //         new transports.File({ filename: "logfile.log", level: "info" }),
    //         new transports.Console(),
    //         new ElasticsearchTransport(esTransportOpts)
    //     ]
    // });

    // app.use(expressWinston.logger({
    //     transports: [
    //         new transports.File({ filename: "logfile.log", level: "info", 'timestamp': true }),
    //         new (winston.transports.Console)({ 'timestamp': true }),
    //         new ElasticsearchTransport(esTransportOpts)
    //     ],
    //     format: format.combine(
    //         format.colorize(),
    //         format.json(),
    //         format.prettyPrint(),
    //         format.timestamp()
    //     )
    // }));


    var jsonParser = bodyParser.json()

    app.get('/', (req, res) => {
        //logger.info("query / endpoint")
        res.redirect("https://smart-api.info/ui/dc91716f44207d2e1287c727f281d339");
    })

    app.get('/predicates', (req, res) => {
        try {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(pred()));
        } catch (error) {
            console.log(error);
            res.end();
        }
    })

    app.get('/metakg', async (req, res) => {
        try {
            res.setHeader('Content-Type', 'application/json');
            let api = undefined, source = undefined;
            if (req.query.api !== undefined) {
                if (req.query.api.startsWith('"') && req.query.api.endsWith('"')) {
                    api = req.query.api.slice(1, -1);
                } else {
                    api = req.query.api;
                }
            }
            if (req.query.provided_by !== undefined) {
                if (req.query.provided_by.startsWith('"') && req.query.provided_by.endsWith('"')) {
                    source = req.query.provided_by.slice(1, -1);
                } else {
                    source = req.query.provided_by;
                }
            }
            let assocs = await assoc(req.query.subject, req.query.object, req.query.predicate, api, source);
            res.end(JSON.stringify(assocs));
        } catch (error) {
            console.log(error);
            res.end();
        }
    })

    app.post('/query', jsonParser, async (req, res, next) => {
        //logger.info("query /query endpoint")
        try {
            const queryGraph = req.body.message.query_graph;
            let rt1 = new rt(queryGraph);
            await rt1.queryPlan();
            await rt1.queryExecute();
            //console.log(rt1.query_result);
            rt1.responseTranslate();
            let rf2 = new rt2(rt1.queryGraph, rt1.reasonStdAPIResponse.knowledge_graph, rt1.reasonStdAPIResponse.results);
            rf2.queryPlan();
            await rf2.queryExecute();
            rf2.responseTranslate();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(rf2.reasonStdAPIResponse));
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            console.log(error);
            res.end(JSON.stringify(
                {
                    "query_graph": req.body.message.query_graph,
                    "knowledge_graph": {
                        "edges": [],
                        "nodes": []
                    },
                    "results": []
                }
            ));
        }
    });

    app.post('/smartapi/:smartapiID/query', jsonParser, async (req, res, next) => {
        //logger.info("query /query endpoint")
        try {
            const queryGraph = req.body.message.query_graph;
            const smartapiID = req.params.smartapiID;
            let rt1 = new rt3(queryGraph, smartapiID);
            await rt1.queryPlan();
            await rt1.queryExecute();
            //console.log(rt1.query_result);
            rt1.responseTranslate();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(rt1.reasonStdAPIResponse));
        } catch (error) {
            console.log(error);
            res.end();
        }
    });

    app.post('/source/:sourcename/query', jsonParser, async (req, res, next) => {
        //logger.info("query /query endpoint")
        try {
            const sourceName = req.params.sourcename;
            const queryGraph = req.body.message.query_graph;
            let rt1 = new rt(queryGraph, sourceName);
            await rt1.queryPlan();
            await rt1.queryExecute();
            //console.log(rt1.query_result);
            rt1.responseTranslate();
            let rf2 = new rt2(rt1.queryGraph, rt1.reasonStdAPIResponse.knowledge_graph, rt1.reasonStdAPIResponse.results);
            rf2.queryPlan();
            await rf2.queryExecute();
            rf2.responseTranslate();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(rf2.reasonStdAPIResponse));
        } catch (error) {
            console.log(error);
            res.end();
        }
    });

    // (async () => {

    //     const config = {
    //         introspection: true,
    //         playground: true,
    //         validationRules: [depthLimit(5)] //limit query depth to 5
    //     }
    //     const server = await getServer(config);
    //     server.applyMiddleware({ app });
    // })();

    // app.use(expressWinston.errorLogger({
    //     transports: [
    //         new transports.Console({})
    //     ],
    //     format: format.combine(
    //         format.colorize(),
    //         format.json(),
    //         format.prettyPrint(),
    //         format.timestamp()
    //     )
    // }));
    return app
}


module.exports = createServer;