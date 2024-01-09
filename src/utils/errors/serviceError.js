const { StatusCodes } = require('http-status-codes');

class ServiceError extends Error {
    constructor(
        message = 'Something went wrong',
        explainatiom = 'Service layer error',
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super();
        this.name = "ServiceError";
        this.message = message;
        this.explainatiom = explainatiom;
        this.statusCode = statusCode;
    }
}

module.exports = ServiceError;