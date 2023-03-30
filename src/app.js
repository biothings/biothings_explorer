const express = require('express');
const Config = require("./config/index");
const { routes } = require("./routes/index");

const path = __dirname + '/web-app/dist/';

class App {
    constructor() {
        this.app = express();
        this.app.use(express.static(path));
        this.config = new Config(this.app);
        this.app = this.config.setConfig();
        routes.setRoutes(this.app);
    }
}

module.exports = new App().app;
