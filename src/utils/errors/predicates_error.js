class PredicatesLoadingError extends Error {
    constructor(message = "Failed to load metakg", ...params) {
        super(...params);

        this.name = 'PredicatesLoadingError';
        this.message = message;
        this.statusCode = 400;
    }
}

module.exports = PredicatesLoadingError;