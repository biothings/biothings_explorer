export class BTEError extends Error {
  statusCode: string;
  constructor(message = 'Query aborted', name = 'QueryAborted', code = '501', ...params: any) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BTEError);
    }

    this.name = name;
    this.message = message;
    this.statusCode = code;
  }
}

export class InvalidQueryGraphError extends Error {
  statusCode: number;
  constructor(message = 'Your Input Query Graph is invalid.', ...params: string[]) {
    super(...params);

    Object.setPrototypeOf(this, InvalidQueryGraphError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidQueryGraphError);
    }

    this.name = 'InvalidQueryGraphError';
    this.message = message;
    this.statusCode = 400;
  }
}