import RestError from "./RestError";

export default class ServiceNotFoundError extends RestError {
  override name = 'ServiceNotFoundError';
}
