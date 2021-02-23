exports.removeQuotesFromQuery = (queryString) => {
    if (queryString.startsWith('"') && queryString.endsWith('"')) {
        return queryString.slice(1, -1);
    } else if (queryString.startsWith("'") && queryString.endsWith("'")) {
        return queryString.slice(1, -1);
    } else {
        return queryString;
    }
}

exports.removeBioLinkPrefix = (input) => {
    if (typeof input === 'string' && input.startsWith('biolink:')) {
        return input.slice(8);
    }
    return input;
}

exports.toArray = (input) => {
    if (Array.isArray(input)) {
        return input
    }
    return [input];
}
