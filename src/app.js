const express = require('express');
const Config = require("./config/index");
const { routes } = require("./routes/index");


class App {
    constructor() {
        this.app = express();
        this.config = new Config(this.app);
        this.app = this.config.setConfig();
        routes.setRoutes(this.app);
    }
}

module.exports = new App().app;
