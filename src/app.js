const express = require('express');
const Config = require("./config/index");
const routes = require("./routes/index");
const serverAdapter = require("./bulladapter");

class App {
    constructor() {
        this.app = express();
        this.config = new Config(this.app);
        this.app = this.config.setConfig();
        routes.setRoutes(this.app);
        serverAdapter.setBasePath('/admin/queues')
        this.app.use('/admin/queues', serverAdapter.getRouter());

    }
}

module.exports = new App().app;