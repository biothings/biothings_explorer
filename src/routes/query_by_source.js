const rt = require("../controllers/reasonerTranslator");
const rt2 = require("../controllers/reasonerTranslator2");

class RouteQueryBySource {
    setRoutes(app) {
        app.post('/source/:sourcename/query', async (req, res, next) => {
            //logger.info("query /query endpoint")
            try {
                const sourceName = req.params.sourcename;
                const queryGraph = req.body.message.query_graph;
                let rt1 = new rt(queryGraph, undefined, sourceName);
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
    }
}

module.exports = new RouteQueryBySource();