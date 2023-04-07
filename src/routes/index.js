const routesMetaKG = require("./metakg");
const routesFrontPage = require("./frontpage");
const routesPerformance = require("./performance");
const routesV1QueryByAPI = require("./v1/query_v1_by_api");
const routesV1QueryByTeam = require("./v1/query_v1_by_team");
const routesV1Query = require("./v1/query_v1");
const routesV1AsyncQuery = require('./v1/asyncquery_v1');
const routesV1AsyncQueryByAPI = require("./v1/asyncquery_v1_by_api");
const routesV1AsyncQueryByTeam = require("./v1/asyncquery_v1_by_team");
const routesV1CheckQueryStatus = require('./v1/asyncquery_status');
const routesV1MetaKG = require("./v1/meta_knowledge_graph_v1")
const routesV1MetaKGByAPI = require("./v1/meta_knowledge_graph_v1_by_api");
const routesV1MetaKGByTeam = require("./v1/meta_knowledge_graph_v1_by_team");
const ErrorHandler = require("../middlewares/error");
const LoggingHandler = require("../middlewares/logging");
const routesBullBoardPage = require("./bullboard");

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
        routesBullBoardPage.setRoutes(app);
        routesPerformance.setRoutes(app);
        routesV1QueryByAPI.setRoutes(app);
        routesV1QueryByTeam.setRoutes(app);
        LoggingHandler.setRoutes(app);
        routesV1Query.setRoutes(app);
        ErrorHandler.setRoutes(app);
    }

}

module.exports = {
    routes: new Routes(),
    tasks: {
        query_v1: routesV1Query.task,
        query_v1_by_api: routesV1QueryByAPI.task,
        query_v1_by_team: routesV1QueryByTeam.task,
        asyncquery_status: routesV1CheckQueryStatus.task,
        // async processor uses thread
        asyncquery_v1: routesV1AsyncQuery.task,
        asyncquery_v1_by_api: routesV1AsyncQueryByAPI.task,
        asyncquery_v1_by_team: routesV1AsyncQueryByTeam.task,
        // Not threaded due to being lightweight/speed being higher priority
        performance: routesPerformance.task,
        metakg: routesMetaKG.task,
        meta_knowledge_graph_v1: routesV1MetaKG.task,
        meta_knowledge_graph_v1_by_api: routesV1MetaKGByAPI.task,
        meta_knowledge_graph_v1_by_team: routesV1MetaKGByTeam.task,
    }
}
