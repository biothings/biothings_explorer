var path = require('path');

class RoutePerformance {
    setRoutes(app) {
        app.get('/performance', function (req, res) {
            const file_path = path.join(path.resolve(__dirname, '../..'), 'performance-test/report.html');
            try {
                if (fs.existsSync(file_path)) {
                    res.sendFile(file_path)
                }
            } catch (err) {
                res.end(JSON.stringify({ "error": "file not exists" }));
            }
        });
    }
}

module.exports = new RoutePerformance();