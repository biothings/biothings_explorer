const fs = require('fs/promises');
const path = require('path');
const InferredQueryHandler = require('../packages/query_graph_handler/built/inferred_mode/inferred_mode').default;
const TRAPIQueryHandler = require('../packages/query_graph_handler/built/index').default;

async function main() {
    /** @type { {[template: string]: {count: number, totalMs: number}} } */
    const templateTimes = {};

    // get list of all files in template_data
    const templateDataPath = path.resolve(__dirname, './template_data');
    const files = await fs.readdir(templateDataPath);
    
    for (const file of files) {
        // read the file
        const filePath = path.resolve(templateDataPath, file);
        const data = await fs.readFile(filePath, 'utf-8');
        const queryGraph = JSON.parse(data);
        
        // create a new InferredQueryHandler instance
        const parentHandler = new TRAPIQueryHandler();
        const handler = new InferredQueryHandler(parentHandler, queryGraph, [],{}, parentHandler.path, parentHandler.predicatePath, true);

        // get templates
        const { qEdge, qSubject, qObject } = handler.getQueryParts();
        const subQueries = await handler.createQueries(qEdge, qSubject, qObject);

        // go through each templtea
        for (const {template, queryGraph} of subQueries) {
            if (!templateTimes[template]) {
                templateTimes[template] = {count: 0, totalMs: 0};
            }
            const start = Date.now();
            const newHandler = new TRAPIQueryHandler();
            newHandler.setQueryGraph(queryGraph);
            await newHandler.query();
            const end = Date.now();
            templateTimes[template].count++;
            templateTimes[template].totalMs += end - start;
        }
    }
}

main();