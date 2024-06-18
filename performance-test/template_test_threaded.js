const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const InferredQueryHandler = require('../packages/query_graph_handler/built/inferred_mode/inferred_mode').default;
const TRAPIQueryHandler = require('../packages/query_graph_handler/built/index').default;

if (isMainThread) {
    const CORE_CONCURRENCY_RATIO = parseInt(process.env.CORE_CONCURRENCY_RATIO) || 0.5;
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
            let templates = 0;
            const filePath = path.resolve(templateDataPath, file);
            const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
            if (data.ids) {
                for (const id of data.ids) {
                    const queryGraph = JSON.parse(JSON.stringify(data.message.query_graph));
                    for (const node of Object.values(queryGraph.nodes)) {
                        if (node.ids === "{ID}") {
                            node.ids = Array.isArray(id) ? id : [id];
                        }
                    }
                    templates += await handleQueryGraph(queryGraph, templateTimes, tasks);
                }
            } else {
                templates += await handleQueryGraph(data.message.query_graph, templateTimes, tasks);
            }

            console.log(`${templates} templates found for ${file}`)
        }
        
        let task_position = threads;
        const first_tasks = tasks.slice(0, threads);
        await Promise.all(first_tasks.map(({ template, queryGraph }) => {
            let worker = new Worker(__filename);
            return new Promise((resolve) => {
                const genTimeout = () => setTimeout(() => {
                    worker.terminate();
                    templateTimes[curTemplate].count += 1;
                    templateTimes[curTemplate].totalMs += 10 * 60 * 1000; // 10 mins if there is a timeout
                    if (task_position >= tasks.length) {
                        resolve();
                    } else {
                        const { template: taskTemplate, queryGraph } = tasks[task_position];
                        curTemplate = taskTemplate;
                        task_position++;
                        worker = new Worker(__filename);
                        worker.postMessage({ queryGraph });
                        worker.on('message', handleMsg);
                        cancelTimeout = genTimeout();
                    }
                }, 1000 * 60 * 5); // 5 mins timeout
                let curTemplate = template;
                let cancelTimeout = genTimeout();
                const handleMsg = (msg) => {
                    clearTimeout(cancelTimeout);
                    if (msg.good) {
                        templateTimes[curTemplate].count += 1;
                        templateTimes[curTemplate].totalMs += msg.totalMs;
                    }
                    if (task_position >= tasks.length) {
                        resolve();
                    } else {
                        const { template: taskTemplate, queryGraph: taskQueryGraph } = tasks[task_position];
                        curTemplate = taskTemplate;
                        task_position++;
                        worker.postMessage({ queryGraph: taskQueryGraph });
                        cancelTimeout = genTimeout();
                    }
                }
                worker.on('message', handleMsg);
                worker.postMessage({ queryGraph });                
            });
        }));

        Object.values(templateTimes).map(a => a.avgMin = parseFloat((a.totalMs / a.count / 60 / 1000).toFixed(2)));
        console.log(templateTimes)
    }

    async function handleQueryGraph(queryGraph, templateTimes, tasks) {
        let templates = 0;
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
            templates++
        }
        return templates
    }

    main();

} 
else {
    async function threadMain(queryGraph) {
        const queryHandler = new TRAPIQueryHandler({}, path.resolve(__dirname, "../packages/bte-server/data/smartapi_specs.json"), path.resolve(__dirname, "../packages/bte-server/data/predicates.json"));
        queryHandler.setQueryGraph(queryGraph);
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
    parentPort.once('message', message => {
       threadMain(message.queryGraph); 
    });
}


