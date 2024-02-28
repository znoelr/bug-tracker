import { HTTP_NOT_FOUND } from "./http-status-codes";

export class NotFoundException extends Error {
  public http_code: number = HTTP_NOT_FOUND;

  constructor(message?: string) {
    super();
    this.message = message || 'Not Found';
  }
}