const app = require("./app");

const PORT = Number.parseInt(process.env.PORT) || 3000;


app.listen(PORT, () => console.log(`App listening at http://localhost:3000`))
