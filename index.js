#!/usr/bin/env node
const createServer = require("./server");

app = createServer();


app.listen(3000, () => console.log(`App listening at http://localhost:3000`))
