const rt = require("./reasonerTranslator");
const pred = require("./predicates");
const express = require('express');
const compression = require('compression')
const cors = require("cors");
var bodyParser = require('body-parser');
//const expressWinston = require("express-winston");
//const { createLogger, transports, format } = require("winston");
//const winston = require("winston");
//const ElasticsearchTransport = require('winston-elasticsearch');
const app = express()

app.use(cors());
app.use(compression());

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

const port = 3000
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

app.post('/query', jsonParser, async (req, res, next) => {
    //logger.info("query /query endpoint")
    try {
        const queryGraph = req.body.message.query_graph;
        let rt1 = new rt(queryGraph);
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

(async () => {
    const server = await require("biothings-explorer-graphql");
    server.applyMiddleware({ app });
})();

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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))