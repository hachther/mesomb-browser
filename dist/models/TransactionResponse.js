import Transaction from "./Transaction";
export default class TransactionResponse {
    success;
    message;
    redirect;
    transaction;
    reference;
    status;
    constructor(data) {
        this.success = data['success'];
        this.message = data['message'];
        this.redirect = data['redirect'];
        this.transaction = new Transaction(data['transaction']);
        this.reference = data['reference'];
        this.status = data['status'];
    }
    isOperationSuccess() {
        return this.success;
    }
    isTransactionSuccess() {
        return this.success && this.status === 'SUCCESS';
    }
}
