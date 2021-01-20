class RouteFrontPage {
    setRoutes(app) {
        app.get('/', (req, res) => {
            res.redirect("https://smart-api.info/ui/dc91716f44207d2e1287c727f281d339");
        })
    }
}

module.exports = new RouteFrontPage();