const call_api = require("@biothings-explorer/call-apis");
const QEdge2BTEEdgeHandler = require("./qedge2bteedge");
const NodesUpdateHandler = require("./update_nodes");
const debug = require("debug")("biothings-explorer-trapi:batch_edge_query");
const CacheHandler = require("./cache_handler");

module.exports = class BatchEdgeQueryHandler {
    constructor(kg, resolveOutputIDs = true) {
        this.kg = kg;
        this.subscribers = [];
        this.logs = [];
        this.resolveOutputIDs = resolveOutputIDs;
    }

    /**
     * @param {Array} qEdges - an array of TRAPI Query Edges;
     */
    setEdges(qEdges) {
        this.qEdges = qEdges;
    }

    /**
     * 
     */
    getEdges() {
        return this.qEdges;
    }

    /**
     * @private
     */
    _expandBTEEdges(bteEdges) {
        return bteEdges;
    }

    /**
     * @private
     */
    async _queryBTEEdges(bteEdges) {
        let executor = new call_api(bteEdges);
        const res = await executor.query(this.resolveOutputIDs);
        this.logs = [...this.logs, ...executor.logs]
        return res;
    }

    /**
     * @private
     */
    async _postQueryFilter(response) {
        return response;
    }

    async query(qEdges) {
        const nodeUpdate = new NodesUpdateHandler(qEdges);;
        await nodeUpdate.setEquivalentIDs(qEdges);
        const cacheHandler = new CacheHandler(qEdges);
        const { cachedResults, nonCachedEdges } = await cacheHandler.categorizeEdges(qEdges);
        this.logs = [...this.logs, ...cacheHandler.logs];
        let query_res;

        if (nonCachedEdges.length === 0) {
            query_res = [];
        } else {
            debug('Start to convert qEdges into BTEEdges....');
            const edgeConverter = new QEdge2BTEEdgeHandler(nonCachedEdges, this.kg);
            const bteEdges = edgeConverter.convert(nonCachedEdges);
            debug(`qEdges are successfully converted into ${bteEdges.length} BTEEdges....`);
            this.logs = [...this.logs, ...edgeConverter.logs];
            if (bteEdges.length === 0 && cachedResults.length === 0) {
                return [];
            }
            const expanded_bteEdges = this._expandBTEEdges(bteEdges);
            debug('Start to query BTEEdges....');
            query_res = await this._queryBTEEdges(expanded_bteEdges);
            debug('BTEEdges are successfully queried....');
            await cacheHandler.cacheEdges(query_res);
        }
        query_res = [...query_res, ...cachedResults];
        const processed_query_res = await this._postQueryFilter(query_res);
        debug(`Total number of response is ${processed_query_res.length}`);
        debug('Start to update nodes.')
        nodeUpdate.update(processed_query_res);
        debug('update nodes completed')
        return processed_query_res;
    }

    /**
     * Register subscribers
     * @param {object} subscriber 
     */
    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    /**
     * Unsubscribe a listener
     * @param {object} subscriber 
     */
    unsubscribe(subscriber) {
        this.subscribers = this.subscribers.filter(fn => {
            if (fn != subscriber)
                return fn
        })
    }

    /**
     * Nofity all listeners
     */
    notify(res) {
        this.subscribers.map(subscriber => {
            subscriber.update(res);
        })
    }
}