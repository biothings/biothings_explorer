const fetch = require('node-fetch');
const fs = require('fs/promises');
const path = require('path');
const InferredQueryHandler = require('../packages/query_graph_handler/built/inferred_mode/inferred_mode').default;
const TRAPIQueryHandler = require('../packages/query_graph_handler/built/index').default;

const PORT = Number.parseInt(process.env.PORT) || 3000;
const url = `http://localhost:${PORT}/v1/query`;

async function main() {
    /** @type { {[template: string]: {count: number, totalMs: number, avgMs: number?}} } */
    const templateTimes = {};

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
            const start = Date.now();
            try {
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({message: { query_graph: templateQueryGraph }})
                });
                if (resp.status < 300) {
                    const end = Date.now();
                    templateTimes[template].count++;
                    templateTimes[template].totalMs += end - start;
                } else if (resp.status == 500) {
                    const is_timeout = (await resp.json())?.description?.includes?.("time");
                    if (is_timeout) {
                        templateTimes[template].count++;
                        templateTimes[template].totalMs += 10 * 60 * 1000; // timeout = 10 minutes
                    }
                }
            } catch (e) {
                console.log(`Error while requesting: ${e} ${e.stack}`)
            } 
        }
    }
    Object.values(templateTimes).map(a => a.avgMin = parseFloat((a.totalMs / a.count / 60 / 1000).toFixed(2)));
    console.log(templateTimes)
}

main();