import RestError from "./RestError";

export default class InvalidClientRequestError extends RestError {
  override name = 'InvalidClientRequestError';
}
