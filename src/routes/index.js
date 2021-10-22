const routesMetaKG = require("./metakg");
const routesFrontPage = require("./frontpage");
const routesPerformance = require("./performance");
const routesV1QueryByAPI = require("./v1/query_v1_by_api");
const routesV1QueryByTeam = require("./v1/query_v1_by_team");
const routesQueryTest = require("./v1/query_test");
const routesV1Query = require("./v1/query_v1");
const routesV1AsyncQuery = require('./v1/asyncquery_v1');
const routesV1AsyncQueryByAPI = require("./v1/asyncquery_v1_by_api");
const routesV1AsyncQueryByTeam = require("./v1/asyncquery_v1_by_team");
const routesV1CheckQueryStatus = require('./v1/check_query_status');
const routesV1MetaKG = require("./v1/meta_knowledge_graph_v1")
const routesV1MetaKGByAPI = require("./v1/meta_knowledge_graph_v1_by_api");
const routesV1MetaKGByTeam = require("./v1/meta_knowledge_graph_v1_by_team");
const ErrorHandler = require("../middlewares/error");
const LoggingHandler = require("../middlewares/logging");

class Routes {
    setRoutes(app) {
        routesMetaKG.setRoutes(app);
        routesV1MetaKG.setRoutes(app);
        routesV1AsyncQuery.setRoutes(app);
        routesV1AsyncQueryByAPI.setRoutes(app);
        routesV1AsyncQueryByTeam.setRoutes(app);
        routesV1MetaKGByAPI.setRoutes(app);
        routesV1MetaKGByTeam.setRoutes(app);
        routesV1CheckQueryStatus.setRoutes(app);
        routesFrontPage.setRoutes(app);
        routesPerformance.setRoutes(app);
        routesV1QueryByAPI.setRoutes(app);
        routesV1QueryByTeam.setRoutes(app);
        LoggingHandler.setRoutes(app);
        routesV1Query.setRoutes(app);
        routesQueryTest.setRoutes(app);
        ErrorHandler.setRoutes(app);
    }

}

module.exports = {
    routes: new Routes(),
    threadHandlers: {
        query_v1: routesV1Query.workerHandler,
        query_v1_by_api: routesV1QueryByAPI.workerHandler,
        query_v1_by_team: routesV1QueryByTeam.workerHandler,
        query_test: routesQueryTest.workerHandler,
        asyncquery_v1: routesV1AsyncQuery.workerHandler, //TODO
        asyncquery_v1_by_api: routesV1AsyncQueryByAPI.workerHandler, //TODO
        asyncquery_v1_by_team: routesV1AsyncQueryByTeam.workerHandler, //TODO
        check_query_status: routesV1CheckQueryStatus.workerHandler, //TODO
        // Not threaded due to being lightweight/speed being higher priority
        performance: routesPerformance.workerHandler,
        metakg: routesMetaKG.workerHandler,
        meta_knowledge_graph_v1: routesV1MetaKG.workerHandler,
        meta_knowledge_graph_v1_by_api: routesV1MetaKGByAPI.workerHandler,
        meta_knowledge_graph_v1_by_team: routesV1MetaKGByTeam.workerHandler,
    }
}
