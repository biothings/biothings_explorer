var path = require('path');

class RoutePerformance {
    setRoutes(app) {
        app.get('/performance', function (req, res) {
            res.sendFile(path.join(path.resolve(__dirname, '../..'), 'performance-test/report.html'));
        });
    }
}

module.exports = new RoutePerformance();