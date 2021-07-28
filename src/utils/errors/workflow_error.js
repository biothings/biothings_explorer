class WorkflowError extends Error {
    constructor(message = "BTE doesn't handle the operations specified in the workflow field", ...params) {
        super(...params);

        this.name = 'WorkflowError';
        this.message = message;
        this.statusCode = 400;
    }
}

module.exports = WorkflowError;
