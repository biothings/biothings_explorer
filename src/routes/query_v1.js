const TRAPIGraphHandler = require("../controllers/QueryGraphHandler/index");

class V1RouteQuery {
    setRoutes(app) {
        app.post('/v1/query', async (req, res, next) => {
            //logger.info("query /query endpoint")
            try {
                const queryGraph = req.body.message.query_graph;
                const handler = new TRAPIGraphHandler();
                handler.setQueryGraph(queryGraph);
                await handler.query();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(handler.getResponse()));
            }
            catch (error) {
                console.log(error);
                res.setHeader('Content-Type', 'application/json');
                if (error === 400) {
                    res.status(400).send({ "error": "unable to process your query graph" });
                    res.end();
                    return
                }
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

module.exports = new V1RouteQuery();