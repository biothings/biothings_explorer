var path = require('path');
const fs = require('fs');
const debug = require("debug")("biothings-explorer-trapi:performance");

class RoutePerformance {
    setRoutes(app) {
        app.get('/performance', function (req, res) {
            debug("start to retrieve performance log.")
            const file_path = path.resolve(__dirname, '../../performance-test/report.html');
            debug(`file path is ${file_path}`);
            try {
                fs.access(file_path, fs.constants.R_OK, (err) => {
                    debug("performance file exists!")
                    res.sendFile(file_path)
                })
                // if (fs.existsSync(file_path)) {
                //     debug("performance file exists!")
                //     res.sendFile(file_path)
                // }
            } catch (err) {
                res.end(JSON.stringify({ "error": err.toString() }));
            }
        });
    }
}

module.exports = new RoutePerformance();