export default class RestError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
