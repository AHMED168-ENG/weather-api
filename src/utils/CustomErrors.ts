export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized Access") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ServiceUnavailableError extends Error {
  constructor(message = "Service Unavailable") {
    super(message);
    this.name = "ServiceUnavailableError";
  }
}
