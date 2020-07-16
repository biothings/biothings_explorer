const rt = require("./reasonerTranslator");

const express = require('express')
const cors = require("cors");
var bodyParser = require('body-parser')
const app = express()

app.use(cors())
const port = 3000
var jsonParser = bodyParser.json()

app.get('/', (req, res) => {
    res.redirect("https://smart-api.info/ui/dc91716f44207d2e1287c727f281d339");
})

app.post('/query', jsonParser, async (req, res, next) => {
    console.log(req.body);
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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))