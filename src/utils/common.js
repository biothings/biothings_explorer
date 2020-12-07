exports.removeQuotesFromQuery = (queryString) => {
    if (queryString.startsWith('"') && queryString.endsWith('"')) {
        return queryString.slice(1, -1);
    } else if (queryString.startsWith("'") && queryString.endsWith("'")) {
        return queryString.slice(1, -1);
    } else {
        return queryString;
    }
}
