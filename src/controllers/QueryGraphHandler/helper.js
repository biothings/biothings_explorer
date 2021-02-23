const crypto = require("crypto");
const reverse = require("./reverse");

module.exports = class QueryGraphHelper {

    constructor() {
        this.reverse = reverse;
    }

    _generateHash(stringToBeHashed) {
        return crypto.createHash('md5').update(stringToBeHashed).digest('hex');
    }

    _getInputQueryNodeID(record) {
        return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? record.$edge_metadata.trapi_qEdge_obj.getObject().getID() : record.$edge_metadata.trapi_qEdge_obj.getSubject().getID());
    }

    _getOutputQueryNodeID(record) {
        return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? record.$edge_metadata.trapi_qEdge_obj.getSubject().getID() : record.$edge_metadata.trapi_qEdge_obj.getObject().getID());
    }

    _getOutputID(record) {
        return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? record.$input.obj.primaryID : record.$output.obj.primaryID);
    }

    _getInputID(record) {
        return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? record.$output.obj.primaryID : record.$input.obj.primaryID);
    }

    _getPredicate(record) {
        return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? "biolink:" + this.reverse.reverse(record.$edge_metadata.predicate) : "biolink:" + record.$edge_metadata.predicate);
    }

    _getAPI(record) {
        return record.$edge_metadata.api_name || '';
    }

    _getSource(record) {
        return record.$edge_metadata.source || '';
    }

    _createUniqueEdgeID(record) {
        const edgeMetaData = [this._getInputID(record), this._getOutputID(record), this._getPredicate(record), this._getAPI(record), this._getSource(record)];
        // return this._generateHash(edgeMetaData.join('-'));
        return edgeMetaData.join('-');
    }

    _getInputCategory(record) {
        return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? record.$edge_metadata.trapi_qEdge_obj.getObject().getCategory() : record.$edge_metadata.trapi_qEdge_obj.getSubject().getCategory());
    }

    _getOutputCategory(record) {
        return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? record.$edge_metadata.trapi_qEdge_obj.getSubject().getCategory() : record.$edge_metadata.trapi_qEdge_obj.getObject().getCategory());
    }

    _getOutputLabel(record) {
        return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? record.$input.obj.label : record.$output.obj.label);
    }

    _getInputLabel(record) {
        return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? record.$output.obj.label : record.$input.obj.label);
    }

    _getInputEquivalentIds(record) {
        try {
            return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? record.$output.obj.curies : record.$input.obj.curies);
        } catch (err) {
            return null;
        }

    }

    _getOutputEquivalentIds(record) {
        try {
            return ((record.$edge_metadata.trapi_qEdge_obj.isReversed()) ? record.$input.obj.curies : record.$output.obj.curies);
        } catch (err) {
            return null;
        }

    }
}