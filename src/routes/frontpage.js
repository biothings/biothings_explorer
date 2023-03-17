const utils = require("../utils/common");

class RouteFrontPage {
    setRoutes(app) {
        app.get('/:var(about|try-it)?', (req, res) => {
            res.send(__dirname + '../web-app/dist/index.html')
        })
        .all(utils.methodNotAllowed);
    }
}

module.exports = new RouteFrontPage();
