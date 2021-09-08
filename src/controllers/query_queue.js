const Queue = require('bull');
const redisClient = require('../utils/cache/redis-client');

let queryQueue = null;
if(Object.keys(redisClient).length !== 0){
    let details = { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }
    if( process.env.REDIS_PASSWORD) {
        details.password = process.env.REDIS_PASSWORD
    }
    queryQueue = new Queue('get query graph', process.env.REDIS_HOST ?
        { redis: details } : 'redis://127.0.0.1:6379',
        {
            defaultJobOptions: {
                timeout: process.env.JOB_TIMEOUT,
            },
            settings: {
                maxStalledCount: 0,
                lockDuration: 300000
            }
        }).on('error', function (error){
        console.log('err', error)
    });
}

module.exports = queryQueue;

