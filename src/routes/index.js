const routesMetaKG = require("./metakg");
const routesPredicates = require("./v0/predicates");
const routesV1Predicates = require("./v1/predicates_v1");
const routesPredicatesByAPI = require("./v0/predicates_by_api");
const routesV1PredicatesByAPI = require("./v1/predicates_v1_by_api");
const routesV1PredicatesByTeam = require("./v1/predicates_v1_by_team");
const routesFrontPage = require("./frontpage");
const routesPerformance = require("./performance");
const routesQueryByAPI = require("./v0/query_by_api");
const routesV1QueryByAPI = require("./v1/query_v1_by_api");
const routesV1QueryByTeam = require("./v1/query_v1_by_team");
const routesQueryBySource = require("./v0/query_by_source");
const routesQuery = require("./v0/query");
const routesV1Query = require("./v1/query_v1");
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