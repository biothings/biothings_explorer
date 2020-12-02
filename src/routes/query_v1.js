const TRAPIGraphHandler = require("../controllers/QueryGraphHandler/index");
const swaggerValidation = require('openapi-validator-middleware');
const inputValidationOptions = {
    formats: [
        { name: 'double', pattern: /\d+(\.\d+)?/ },
        { name: 'int64', pattern: /^\d{1,19}$/ },
        { name: 'int32', pattern: /^\d{1,10}$/ },
        {
            name: 'file',
            validate: () => {
                return true;
            }
        }
    ],
    beautifyErrors: true,
    //firstError: true,
    expectFormFieldsInBody: true
};
swaggerValidation.init("docs/smartapi.yaml", inputValidationOptions);

class V1RouteQuery {
    setRoutes(app) {
        app.post('/v1/query', swaggerValidation.validate, async (req, res, next) => {
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
                next(error);
            }
        });
    }
}

module.exports = new V1RouteQuery();