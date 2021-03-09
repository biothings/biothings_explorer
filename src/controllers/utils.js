const { set } = require("lodash");

exports.toArray = (input) => {
    if (Array.isArray(input)) {
        return input;
    }
    return [input];
}

exports.getUnique = (input) => {
    return Array.from(new Set(input));
}

exports.removeBioLinkPrefix = (input) => {
    if (input && input.startsWith("biolink:")) {
        return input.slice(8);
    }
    return input;
}