const call_api = require("@biothings-explorer/call-apis");
const QEdge2BTEEdgeHandler = require("./qedge2bteedge");
const NodesUpdateHandler = require("./update_nodes");

module.exports = class BatchEdgeQueryHandler {
    constructor() {
        this.subscribers = [];
        this.logs = [];
    }

    /**
     * 
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
        await executor.query();
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
        let edgeConverter = new QEdge2BTEEdgeHandler(qEdges);
        let bteEdges = edgeConverter.convert(qEdges);
        this.logs = [...this.logs, ...edgeConverter.logs];
        let expanded_bteEdges = this._expandBTEEdges(bteEdges);
        let query_res = await this._queryBTEEdges(expanded_bteEdges);
        let processed_query_res = await this._postQueryFilter(query_res);
        nodeUpdate.update(processed_query_res);
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