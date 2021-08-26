const app = require("./app");
const cron = require("./controllers/cron/index");

const PORT = Number.parseInt(process.env.PORT) || 3000;

if (!(process.env.DISABLE_SMARTAPI_SYNC === 'true')) {
  cron();
}



app.listen(PORT, () => console.log(`App listening at http://localhost:3000`))
