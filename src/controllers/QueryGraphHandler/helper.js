const { exec } = require("child_process");
const crypto = require("crypto");

module.exports = class QueryGraphHelper {

    _generateHash(stringToBeHashed) {
        return crypto.createHash('sha1').update(stringToBeHashed).digest('hex');
    }

    _getInputQueryNodeID(record) {
        return ((record["$reasoner_edge"].isReversed()) ? record["$reasoner_edge"].getObject().getID() : record["$reasoner_edge"].getSubject().getID());
    }

    _getOutputQueryNodeID(record) {
        return ((record["$reasoner_edge"].isReversed()) ? record["$reasoner_edge"].getSubject().getID() : record["$reasoner_edge"].getObject().getID());
    }

    _getOutputID(record) {
        return ((record["$reasoner_edge"].isReversed()) ? record["$original_input"][record["$input"]] : record.id);
    }

    _getInputID(record) {
        return ((record["$reasoner_edge"].isReversed()) ? record.id : record["$original_input"][record["$input"]]);
    }

    _getAPI(record) {
        return record["$association"].api_name || '';
    }

    _getSource(record) {
        return record["$association"].source || '';
    }

    _createUniqueEdgeID(record) {
        const edgeMetaData = [this._getInputID(record), this._getOutputID(record), this._getAPI(record), this._getSource(record)];
        return this._generateHash(edgeMetaData.join('-'));
    }

    _getInputCategory(record) {
        return ((record["$reasoner_edge"].isReversed()) ? record["$reasoner_edge"].getObject().getCategory() : record["$reasoner_edge"].getSubject().getCategory());
    }

    _getOutputCategory(record) {
        return ((record["$reasoner_edge"].isReversed()) ? record["$reasoner_edge"].getSubject().getCategory() : record["$reasoner_edge"].getObject().getCategory());
    }

    _getOutputLabel(record) {
        return ((record["$reasoner_edge"].isReversed()) ? record["$input_resolved_identifiers"][record["$original_input"][record["$input"]]].id.label : record.label);
    }

    _getInputLabel(record) {
        return ((record["$reasoner_edge"].isReversed()) ? record.label : record["$input_resolved_identifiers"][record["$original_input"][record["$input"]]].id.label);
    }

    _getInputEquivalentIds(record) {
        try {
            return ((record["$reasoner_edge"].isReversed()) ? record.$output_id_mapping.resolved : record["$input_resolved_identifiers"][record["$original_input"][record["$input"]]]);
        } catch (err) {
            return null;
        }

    }

    _getOutputEquivalentIds(record) {
        try {
            return ((record["$reasoner_edge"].isReversed()) ? record["$input_resolved_identifiers"][record["$original_input"][record["$input"]]] : record.$output_id_mapping.resolved);
        } catch (err) {
            return null;
        }

    }
}