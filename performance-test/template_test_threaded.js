const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const InferredQueryHandler = require('../packages/query_graph_handler/built/inferred_mode/inferred_mode').default;
const TRAPIQueryHandler = require('../packages/query_graph_handler/built/index').default;

if (isMainThread) {
        
    const CORE_CONCURRENCY_RATIO = parseInt(process.env.CORE_CONCURRENCY_RATIO) || 0.25;
    const MEM_CONCURRENCY_RATIO = parseFloat(process.env.MEM_CONCURRENCY_RATIO) || 0.6;
    const CORE_LIMIT = Math.ceil(os.cpus().length * CORE_CONCURRENCY_RATIO);
    const MEM_LIMIT = Math.ceil((os.totalmem() / 1e9) * MEM_CONCURRENCY_RATIO);
    let threads = Math.ceil(Math.min(CORE_LIMIT, MEM_LIMIT));
    console.log("Threads: " + threads)

    async function main() {
        /** @type { {[template: string]: {count: number, totalMs: number, avgMs: number?}} } */
        const templateTimes = {};

        /** @type { {queryGraph: string, template: string}[] } */
        const tasks = [];

        // get list of all files in template_data
        const templateDataPath = path.resolve(__dirname, './template_data');
        const files = await fs.readdir(templateDataPath);

        for (const file of files) {
            console.log(file)
            // read the file
            const filePath = path.resolve(templateDataPath, file);
            const data = await fs.readFile(filePath, 'utf-8');
            const queryGraph = JSON.parse(data).message.query_graph;

            // create a new InferredQueryHandler instance
            const parentHandler = new TRAPIQueryHandler();
            parentHandler.setQueryGraph(queryGraph);
            parentHandler._initializeResponse();
            await parentHandler.addQueryNodes();
            await parentHandler._processQueryGraph(parentHandler.queryGraph);
            const handler = new InferredQueryHandler(parentHandler, parentHandler.queryGraph, [], {}, parentHandler.path, parentHandler.predicatePath, true);

            // get templates
            const { qEdge, qSubject, qObject } = handler.getQueryParts();
            const subQueries = await handler.createQueries(qEdge, qSubject, qObject);


            // go through each template
            for (const { template, queryGraph: templateQueryGraph } of subQueries) {
                if (!templateTimes[template]) {
                    templateTimes[template] = { count: 0, totalMs: 0 };
                }
                tasks.push({ template, queryGraph: templateQueryGraph })
            }
        }

        
        for (let i = 0; i < tasks.length; i += threads) {
            const subtasks = tasks.slice(i, i + threads);
            await Promise.all(subtasks.map(({ template, queryGraph }) => {
                const worker = new Worker(__filename, { workerData: { queryGraph }});
                return new Promise((resolve) => {
                    const cancelTimeout = setTimeout(() => {
                        worker.terminate();
                        templateTimes[template].count += 1;
                        templateTimes[template].totalMs += 10 * 60 * 1000; // 10 mins if there is a timeout
                        resolve();
                    }, 1000 * 60 * 5); // 5 mins timeout
                    worker.on('message', (msg) => {
                        clearTimeout(cancelTimeout);
                        if (msg.good) {
                            templateTimes[template].count += 1;
                            templateTimes[template].totalMs += msg.totalMs;
                        }
                        resolve();
                    });
                    
                })
            }));
        }

        Object.values(templateTimes).map(a => a.avgMin = parseFloat((a.totalMs / a.count / 60 / 1000).toFixed(2)));
        console.log(templateTimes)
    }

    main();

} 
else {
    async function threadMain() {
        const queryHandler = new TRAPIQueryHandler({}, path.resolve(__dirname, "../packages/bte-server/data/smartapi_specs.json"), path.resolve(__dirname, "../packages/bte-server/data/predicates.json"));
        queryHandler.setQueryGraph(workerData.queryGraph);
        try {
            const start = Date.now();
            await queryHandler.query();
            parentPort.postMessage({ good: true, totalMs: Date.now() - start });
        } catch (e) {
            console.error(e);
            parentPort.postMessage({ good: false });
            return;
        }
    }
    threadMain();
}


