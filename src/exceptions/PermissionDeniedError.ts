import RestError from "./RestError";

export default class PermissionDeniedError extends RestError {
  override name = 'PermissionDeniedError';
}
