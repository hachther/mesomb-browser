import RestError from "./RestError";

export default class ServerError extends RestError {
  override name = 'ServerError';
}
