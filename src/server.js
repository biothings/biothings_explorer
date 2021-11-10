const app = require("./app");
const cron = require("./controllers/cron/index");


async function main() {
  const PORT = Number.parseInt(process.env.PORT) || 3000;
  cron();
  app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
  process.env.DEBUG_COLORS = 'true';
}

main();
