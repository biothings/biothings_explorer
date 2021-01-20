class InvalidQueryGraphError extends Error {
    constructor(message = "Your Input Query Graph is invalid.", ...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidQueryGraphError);
        }

        this.name = 'InvalidQueryGraphError';
        this.message = message;
        this.statusCode = 400;
    }
}

module.exports = InvalidQueryGraphError;