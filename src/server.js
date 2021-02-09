const app = require("./app");
const cron = require("./controllers/cron/index");

const PORT = Number.parseInt(process.env.PORT) || 3000;

cron();



app.listen(PORT, () => console.log(`App listening at http://localhost:3000`))
