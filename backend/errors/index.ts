export class ServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export class NotFoundError extends ServiceError {
  constructor(message = 'Resource not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ServiceError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ServiceError {
  constructor(message = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class InternalServerError extends ServiceError {
  constructor(message = 'Internal server error') {
    super(500, message);
    this.name = 'InternalServerError';
  }
}

export class InvalidCredentialsError extends ServiceError {
  constructor(message = 'Invalid credentials') {
    super(401, message);
    this.name = 'InvalidCredentialsError';
  }
}

export class InvalidRequestError extends ServiceError {
  constructor(message = 'Invalid request data') {
    super(400, message);
    this.name = 'InvalidRequestError';
  }
}

export class UserAlreadyExistsError extends ServiceError {
  constructor(message = 'User already exists') {
    super(409, message);
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserNotFoundError extends ServiceError {
  constructor(message = 'User not found') {
    super(404, message);
    this.name = 'UserNotFoundError';
  }
}

export class UserNotLoggedInError extends ServiceError {
  constructor(message = 'User is not logged in') {
    super(401, message);
    this.name = 'UserNotLoggedInError';
  }
}

export class FailedToFetchDataError extends ServiceError {
  constructor(message = 'Failed to fetch data from external service') {
    super(502, message);
    this.name = 'FailedToFetchDataError';
  }
}

export class DatabaseOperationError extends ServiceError {
  constructor(message = 'Database operation failed') {
    super(500, message);
    this.name = 'DatabaseOperationError';
  }
}
