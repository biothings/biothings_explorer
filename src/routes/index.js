const routesMetaKG = require("./metakg");
const routesPredicates = require("./predicates");
const routesV1Predicates = require("./predicates_v1");
const routesPredicatesByAPI = require("./predicates_by_api");
const routesV1PredicatesByAPI = require("./predicates_v1_by_api");
const routesV1PredicatesByTeam = require("./predicates_v1_by_team");
const routesFrontPage = require("./frontpage");
const routesPerformance = require("./performance");
const routesQueryByAPI = require("./query_by_api");
const routesV1QueryByAPI = require("./query_v1_by_api");
const routesV1QueryByTeam = require("./query_v1_by_team");
const routesQueryBySource = require("./query_by_source");
const routesQuery = require("./query");
const routesV1Query = require("./query_v1");
const ErrorHandler = require("../middlewares/error");
const LoggingHandler = require("../middlewares/logging");

class Routes {
    setRoutes(app) {
        routesMetaKG.setRoutes(app);
        routesPredicates.setRoutes(app);
        routesV1Predicates.setRoutes(app);
        routesPredicatesByAPI.setRoutes(app);
        routesV1PredicatesByAPI.setRoutes(app);
        routesV1PredicatesByTeam.setRoutes(app);
        routesFrontPage.setRoutes(app);
        routesPerformance.setRoutes(app);
        routesQueryByAPI.setRoutes(app);
        routesV1QueryByAPI.setRoutes(app);
        routesV1QueryByTeam.setRoutes(app);
        routesQueryBySource.setRoutes(app);
        routesQuery.setRoutes(app);
        LoggingHandler.setRoutes(app);
        routesV1Query.setRoutes(app);
        ErrorHandler.setRoutes(app);
    }
}

module.exports = new Routes();