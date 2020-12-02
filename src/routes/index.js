const routesMetaKG = require("./metakg");
const routesPredicates = require("./predicates");
const routesFrontPage = require("./frontpage");
const routesPerformance = require("./performance");
const routesQueryByAPI = require("./query_by_api");
const routesQueryBySource = require("./query_by_source");
const routesQuery = require("./query");
const routesV1Query = require("./query_v1");
const ErrorHandler = require("../middlewares/error");
const LoggingHandler = require("../middlewares/logging");

class Routes {
    setRoutes(app) {
        routesMetaKG.setRoutes(app);
        routesPredicates.setRoutes(app);
        routesFrontPage.setRoutes(app);
        routesPerformance.setRoutes(app);
        routesQueryByAPI.setRoutes(app);
        routesQueryBySource.setRoutes(app);
        routesQuery.setRoutes(app);
        LoggingHandler.setRoutes(app);
        routesV1Query.setRoutes(app);
        ErrorHandler.setRoutes(app);
    }
}

module.exports = new Routes();