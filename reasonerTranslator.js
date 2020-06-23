/**
 * Translator Reasoner Std API query graph into BTE input
 */
module.exports = class ReasonerQueryGraphTranslator {
    constructor(queryGraph) {
        this.queryGraph = queryGraph;
    }

    /**
     * Restructure the nodes from query graph
     */
    restructureNodes() {
        this.nodes = {};
        this.queryGraph.nodes.map(node => {
            if ("curie" in node) {
                this.nodes[node.id] = node;
            }
        })
    }

}