const Queue = require('bull');
const redisClient = require('../../utils/cache/redis-client');

exports.getQueryQueue = (name) => {
    let queryQueue = null;
    if(Object.keys(redisClient).length !== 0){
        let details = { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }
        if( process.env.REDIS_PASSWORD) {
            details.password = process.env.REDIS_PASSWORD
        }
        queryQueue = new Queue(name, process.env.REDIS_HOST ?
            { redis: details } : 'redis://127.0.0.1:6379',
            {
                defaultJobOptions: {
                    timeout: process.env.JOB_TIMEOUT,
                    removeOnFail: true
                },
                settings: {
                    maxStalledCount: 1,
                    //lockDuration: 300000
                    lockDuration: 3600000   // 60min
                }
            }).on('error', function (error){
            console.log('err', error)
        });
    }
    return queryQueue
}
