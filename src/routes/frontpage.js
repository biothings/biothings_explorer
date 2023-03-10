const utils = require("../utils/common");

class RouteFrontPage {
    setRoutes(app) {
        app.get('/', (req, res) => {
            res.send(__dirname + '../web-app/dist/index.html')
        })
        .all(utils.methodNotAllowed);
    }
}

module.exports = new RouteFrontPage();
