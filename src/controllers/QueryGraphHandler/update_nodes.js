const id_resolver = require("biomedical_id_resolver");
const _ = require("lodash");
const debug = require("debug")("biothings-explorer-trapi:nodeUpdateHandler");


module.exports = class NodesUpdateHandler {
    constructor(qEdges) {
        this.qEdges = qEdges;
    }

    /**
     * @private
     * s
     */
    _getCuries(qEdges) {
        let curies = {};
        qEdges.map(edge => {
            if (edge.hasInputResolved()) {
                return;
            }
            if (edge.hasInput()) {
                const inputCategories = edge.getSubject().getCategories();
                inputCategories.map(category => {
                    if (!(category in curies)) {
                        curies[category] = [];
                    }
                    curies[category] = [...curies[category], ...edge.getInputCurie()];
                })

            }
        })
        return curies;
    }

    /**
     * Resolve input ids
     * @param {object} curies - each key represents the category, e.g. gene, value is an array of curies.
     */
    async _getEquivalentIDs(curies) {
        const resolver = new id_resolver.Resolver("biolink");
        const equivalentIDs = await resolver.resolve(curies);
        return equivalentIDs;
    }

    async setEquivalentIDs(qEdges) {
        const curies = this._getCuries(this.qEdges);
        if (curies.length === 0) {
            return;
        }
        debug(`curies: ${JSON.stringify(curies)}`);
        const equivalentIDs = await this._getEquivalentIDs(curies);
        qEdges.map(edge => {
            debug(`Edge input curie is ${edge.getInputCurie()}`);
            let edgeEquivalentIDs = Object.keys(equivalentIDs)
                .filter(key => edge.getInputCurie().includes(key))
                .reduce((res, key) => {
                    return { ...res, [key]: equivalentIDs[key] };
                }, {});
            debug(`Edge Equivalent IDs are: ${JSON.stringify(edgeEquivalentIDs)}`);
            if (Object.keys(edgeEquivalentIDs).length > 0) {
                edge.getSubject().setEquivalentIDs(edgeEquivalentIDs);
            }
        })
        return;
    }

    _createEquivalentIDsObject(record) {
        if (record.$output.obj !== undefined) {
            return {
                [record.$output.obj.primaryID]: record.$output.obj
            }
        } else {
            return
        }

    }

    /**
     * Update nodes with equivalent ids based on query response.
     * @param {object} queryResult - query response
     */
    update(queryResult) {
        const node_dict = {};
        const id_dict = {};
        // queryResult.map(record => {
        //     record.$edge_metadata.trapi_qEdge_obj.getOutputNode().updateEquivalentIDs(
        //         this._createEquivalentIDsObject(record)
        //     );
        // })
        queryResult.map(record => {
            const nodeID = record.$edge_metadata.trapi_qEdge_obj.getOutputNode().getID();
            if (!(nodeID in id_dict)) {
                id_dict[nodeID] = {};
                node_dict[nodeID] = record.$edge_metadata.trapi_qEdge_obj.getOutputNode();
            }
            if (!(record.$output.obj.primaryID in id_dict[nodeID])) {
                id_dict[nodeID][record.$output.obj.primaryID] = record.$output.obj;
            }
        })
        for (const nodeID in id_dict) {
            node_dict[nodeID].updateEquivalentIDs(id_dict[nodeID]);
        }
    }
}