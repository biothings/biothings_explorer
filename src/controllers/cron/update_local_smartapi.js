const debug = require("debug")("biothings-explorer-trapi:cron");
const axios = require("axios");
const fs = require("fs");
var path = require('path');
const cron = require('node-cron');


const updateSmartAPISpecs = async () => {
    const SMARTAPI_URL = 'https://smart-api.info/api/query?q=tags.name:translator&size=150&fields=paths,servers,tags,components.x-bte*,info';
    const res = await axios.get(SMARTAPI_URL);
    const localFilePath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
    fs.writeFile(localFilePath, JSON.stringify(res.data), (err) => {
        if (err) throw err;
    });
}
module.exports = () => {
    cron.schedule('*/10 * * * *', async () => {
        debug(`Updating local copy of SmartAPI specs now at ${new Date().toUTCString()}!`);
        try {
            await updateSmartAPISpecs();
            debug("Successfull updated the local copy of SmartAPI specs.")
        } catch (err) {
            debug(`Updating local copy of SmartAPI specs failed! The error message is ${err.toString()}`)
        }
    });
}