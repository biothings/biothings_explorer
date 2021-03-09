const _ = require("lodash");
const LogEntry = require("./log_entry");
const ID_WITH_PREFIXES = ["MONDO", "DOID", "UBERON",
    "EFO", "HP", "CHEBI", "CL", "MGI", "NCIT"];
const debug = require("debug")("biothings-explorer-trapi:qedge2btedge");


module.exports = class QEdge2BTEEdgeHandler {
    constructor(qEdges, kg) {
        this.qEdges = qEdges;
        this.kg = kg;
        this.logs = [];
    }

    setQEdges(qEdges) {
        this.qEdges = qEdges;
    }

    _findAPIsFromSmartAPIEdges(smartapiEdges) {
        return smartapiEdges.map(edge => edge.association.api_name);
    }

    /**
     * Get SmartAPI Edges based on TRAPI Query Edge.
     * @private
     * @param {object} kg - SmartAPI Knowledge Graph Object
     * @param {object} qEdge - TRAPI Query Edge Object
     */
    _getSmartAPIEdges(qEdge, kg = this.kg) {
        debug(`Subject node is ${qEdge.getSubject().id}`);
        debug(`Object node is ${qEdge.getObject().id}`);
        let filterCriteria = {
            input_type: qEdge.getSubject().getCategories(),
            output_type: qEdge.getObject().getCategories(),
            predicate: qEdge.getPredicate()
        };
        debug(`Filter criteria is: ${JSON.stringify(filterCriteria)}`);
        let smartapi_edges = kg.filter(filterCriteria);
        smartapi_edges = smartapi_edges.map(item => {
            item.reasoner_edge = qEdge;
            return item;
        });
        if (smartapi_edges.length === 0) {
            debug(`No smartapi edge found for ${qEdge.getID()}`)
            this.logs.push(new LogEntry("WARNING", null, `BTE didn't find any smartapi edges corresponding to ${qEdge.getID()}`).getLog())
        } else {
            this.logs.push(new LogEntry("DEBUG", null, `BTE found ${smartapi_edges.length} smartapi edges corresponding to ${qEdge.getID()}. These smartaip edges comes from ${new Set(this._findAPIsFromSmartAPIEdges(smartapi_edges)).size} unique APIs. They are ${Array.from(new Set(this._findAPIsFromSmartAPIEdges(smartapi_edges))).join(',')}`).getLog())
        }
        return smartapi_edges;
    }

    /**
     * @private
     * @param {object} resolvedIDs 
     * @param {object} smartAPIEdge 
     */
    _createNonBatchSupportBTEEdges(smartAPIEdge) {
        const bteEdges = [];
        const inputID = smartAPIEdge.association.input_id;
        const inputType = smartAPIEdge.association.input_type;
        const resolvedIDs = smartAPIEdge.reasoner_edge.getSubject().getEquivalentIDs();
        for (const curie in resolvedIDs) {
            resolvedIDs[curie].map(entity => {
                if (entity.semanticType === inputType && inputID in entity.dbIDs) {
                    entity.dbIDs[inputID].map(id => {
                        const edge = _.cloneDeep(smartAPIEdge);
                        edge.input = id;
                        edge.input_resolved_identifiers = {
                            [curie]: [entity]
                        };
                        if (ID_WITH_PREFIXES.includes(inputID) || id.toString().includes(':')) {
                            edge.original_input = {
                                [id]: curie
                            }
                        } else {
                            edge.original_input = {
                                [inputID + ':' + id]: curie
                            };
                        }
                        const edgeToBePushed = _.cloneDeep(edge);
                        edgeToBePushed.reasoner_edge = smartAPIEdge.reasoner_edge;
                        bteEdges.push(edgeToBePushed);
                    })
                }
            })

        }
        return bteEdges;
    }

    /**
     * @private
     * @param {object} resolvedIDs 
     * @param {object} smartAPIEdge 
     */
    _createBatchSupportBTEEdges(smartAPIEdge) {
        const id_mapping = {};
        const inputs = [];
        const bteEdges = [];
        const input_resolved_identifiers = {};
        const inputID = smartAPIEdge.association.input_id;
        const inputType = smartAPIEdge.association.input_type;
        let resolvedIDs = smartAPIEdge.reasoner_edge.getSubject().getEquivalentIDs();
        debug(`Resolved ids: ${JSON.stringify(resolvedIDs)}`);
        debug(`Input id: ${inputID}`);
        for (const curie in resolvedIDs) {
            resolvedIDs[curie].map(entity => {
                if (entity.semanticType === inputType && inputID in entity.dbIDs) {
                    entity.dbIDs[inputID].map(id => {
                        if (ID_WITH_PREFIXES.includes(inputID) || id.includes(':')) {
                            id_mapping[id] = curie;
                        } else {
                            id_mapping[inputID + ':' + id] = curie;
                        }
                        input_resolved_identifiers[curie] = [entity];
                        inputs.push(id);
                    })
                }
            })
        }
        if (Object.keys(id_mapping).length > 0) {
            const edge = _.cloneDeep(smartAPIEdge);
            edge.input = inputs;
            edge.input_resolved_identifiers = input_resolved_identifiers;
            edge.original_input = id_mapping;
            const edgeToBePushed = _.cloneDeep(edge);
            edgeToBePushed.reasoner_edge = smartAPIEdge.reasoner_edge;
            bteEdges.push(edgeToBePushed);
        }
        return bteEdges;
    }



    /**
     * Add inputs to smartapi edges
     */
    _createBTEEdges(edge) {
        const supportBatch = edge.query_operation.supportBatch;
        let bteEdges;
        if (supportBatch === false) {
            bteEdges = this._createNonBatchSupportBTEEdges(edge);
        } else {
            bteEdges = this._createBatchSupportBTEEdges(edge);
        };
        return bteEdges;
    }

    convert(qEdges) {
        let bteEdges = [];
        qEdges.map(edge => {
            const smartapi_edges = this._getSmartAPIEdges(edge);
            debug(`${smartapi_edges.length} SmartAPI edges are retrieved....`)
            smartapi_edges.map(item => {
                let newEdges = this._createBTEEdges(item);
                debug(`${newEdges.length} BTEEdges are created....`)
                newEdges = newEdges.map(e => {
                    e.filter = edge.filter;
                    return e;
                })
                bteEdges = [...bteEdges, ...newEdges];
            })
        });
        if (bteEdges.length === 0) {
            debug(`No bte edge found for this query batch.`)
            this.logs.push(new LogEntry("WARNING", null, `BTE didn't find any bte edges for this batch. Your query terminates.`).getLog())
        } else {
            debug(`BTE found ${bteEdges.length} bte edges for this batch.`)
            this.logs.push(new LogEntry("DEBUG", null, `BTE found ${bteEdges.length} bte edges for this batch.`).getLog())
        }
        return bteEdges;
    }
}