const rt3 = require("../controllers/individual");

class RouteQueryByAPI {
    setRoutes(app) {
        app.post('/smartapi/:smartapiID/query', async (req, res, next) => {
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
    }
}

module.exports = new RouteQueryByAPI();