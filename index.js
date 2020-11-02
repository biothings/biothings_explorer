#!/usr/bin/env node
const createServer = require("./server");

app = createServer();

let port = argv.port || 3000;

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))
