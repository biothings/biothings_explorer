const call_api = require("@biothings-explorer/call-apis");
const QEdge2BTEEdgeHandler = require("./qedge2bteedge");
const NodesUpdateHandler = require("./update_nodes");
//const CacheHandler = require("./cache_handler");

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
        await executor.query(this.resolveOutputIDs);
        return executor.result;
    }

    /**
     * @private
     */
    async _postQueryFilter(response) {
        return response;
    }

    async query(qEdges) {
        let nodeUpdate = new NodesUpdateHandler(qEdges);
        await nodeUpdate.setEquivalentIDs(qEdges);
        let edgeConverter = new QEdge2BTEEdgeHandler(qEdges, this.kg);
        let bteEdges = edgeConverter.convert(qEdges);
        this.logs = [...this.logs, ...edgeConverter.logs];
        let expanded_bteEdges = this._expandBTEEdges(bteEdges);
        let query_res = await this._queryBTEEdges(expanded_bteEdges);
        let processed_query_res = await this._postQueryFilter(query_res);
        nodeUpdate.update(processed_query_res);
        return processed_query_res;
        // let cacheHandler = new CacheHandler(qEdges);
        // let { cachedResults, nonCachedEdges } = await cacheHandler.categorizeEdges(qEdges);
        // let nodeUpdate = new NodesUpdateHandler(nonCachedEdges);
        // await nodeUpdate.setEquivalentIDs(nonCachedEdges);
        // let edgeConverter = new QEdge2BTEEdgeHandler(nonCachedEdges, this.kg);
        // let bteEdges = edgeConverter.convert(nonCachedEdges);
        // this.logs = [...this.logs, ...edgeConverter.logs];
        // let expanded_bteEdges = this._expandBTEEdges(bteEdges);
        // let query_res = await this._queryBTEEdges(expanded_bteEdges);
        // await cacheHandler.cacheEdges(query_res);
        // query_res = [...query_res, ...cachedResults];
        // let processed_query_res = await this._postQueryFilter(query_res);
        // nodeUpdate.update(processed_query_res);
        // return processed_query_res;
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