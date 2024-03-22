process.env.DEBUG="bte*"
process.env.SYNC_AND_EXIT="true" 
const sync = require("../packages/bte-server/built/controllers/cron/update_local_smartapi.js").default;
sync();
