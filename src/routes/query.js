const rt = require("../controllers/reasonerTranslator");
const rt2 = require("../controllers/reasonerTranslator2");

class RouteQuery {
    setRoutes(app) {
        app.post('/query', async (req, res, next) => {
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
    }
}

module.exports = new RouteQuery();