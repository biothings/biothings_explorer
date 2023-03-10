class RouteFrontPage {
    setRoutes(app) {
        app.get('/', (req, res) => {
            res.send(__dirname + '../web-app/dist/index.html')
        })
    }
}

module.exports = new RouteFrontPage();