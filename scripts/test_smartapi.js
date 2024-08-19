process.env.SYNC_AND_EXIT="true" 
const sync = require("../packages/bte-server/built/controllers/cron/test_smartapi.js").default;
sync();
