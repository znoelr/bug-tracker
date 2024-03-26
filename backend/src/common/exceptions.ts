import { HTTP_BAD_REQUEST, HTTP_FORBIDDEN, HTTP_NOT_FOUND, HTTP_UNAUTHORIZED } from "./http-status-codes";

export class BaseHttpException extends Error {
  public http_code: number = 500;

  constructor(message?: string) {
    super();
    this.message = message || 'Something went wrong';
  }
}

export class NotFoundException extends BaseHttpException {
  public http_code: number = HTTP_NOT_FOUND;

  constructor(message?: string) {
    super();
    this.message = message || 'Not Found';
  }
}

export class BadRequestException extends BaseHttpException {
  public http_code: number = HTTP_BAD_REQUEST;

  constructor(message?: string) {
    super();
    this.message = message || 'Bad Request';
  }
}

export class UnauthorizedExeption extends BaseHttpException {
  public http_code: number = HTTP_UNAUTHORIZED;

  constructor(message?: string) {
    super();
    this.message = message || 'Unauthorized';
  }
}

export class ForbiddenExeption extends BaseHttpException {
  public http_code: number = HTTP_FORBIDDEN;

  constructor(message?: string) {
    super();
    this.message = message || 'Forbiden resource';
  }
}
