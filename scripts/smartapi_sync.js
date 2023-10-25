process.env.DEBUG="bte*"
process.env.SYNC_AND_EXIT="true" 
sync = require("../packages/bte-server/built/controllers/cron/update_local_smartapi.js");
sync();
