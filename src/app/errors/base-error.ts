const enum HttpStatusCode {
  // eslint-disable-next-line no-unused-vars
  OK = 200,
  // eslint-disable-next-line no-unused-vars
  BAD_REQUEST = 400,
  // eslint-disable-next-line no-unused-vars
  NOT_FOUND = 404,
  // eslint-disable-next-line no-unused-vars
  INTERNAL_SERVER = 500,
}

module.exports = class BaseError extends Error {
  public readonly name: string = '';

  public readonly httpCode: HttpStatusCode | undefined;

  public readonly isOperational: boolean = false;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    description: string,
    isOperational: boolean
  ) {
    super(description);
    // It was recommend when targeting ES5.
    // The chain is lost after calling super, so it had to be re-established.
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
};
