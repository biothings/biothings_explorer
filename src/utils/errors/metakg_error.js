class MetaKGLoadingError extends Error {
    constructor(message = "Failed to load metakg", ...params) {
        super(...params);

        this.name = 'MetaKGLoadingError';
        this.message = message;
        this.statusCode = 400;
    }
}

module.exports = MetaKGLoadingError;