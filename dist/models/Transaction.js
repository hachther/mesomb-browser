import Customer from "./Customer";
import Location from "./Location";
import Product from "./Product";
/**
 * A MeSomb transaction
 */
export default class Transaction {
    pk;
    success;
    type;
    amount;
    fees;
    b_party;
    message;
    service;
    reference;
    ts;
    country;
    currency;
    fin_trx_id;
    trxamount;
    location;
    customer;
    products;
    /**
     *
     * @param {Object} data
     * @param {string} data.pk - ID of the transaction
     */
    constructor(data) {
        this.pk = data['pk'];
        this.success = data['success'];
        this.type = data['type'];
        this.amount = data['amount'];
        this.fees = data['fees'];
        this.b_party = data['b_party'];
        this.message = data['message'];
        this.service = data['service'];
        this.reference = data['reference'];
        this.ts = data['ts'];
        this.country = data['country'];
        this.currency = data['currency'];
        this.fin_trx_id = data['fin_trx_id'];
        this.trxamount = data['trxamount'];
        if (data['location']) {
            this.location = new Location(data['location']);
        }
        if (data['customer']) {
            this.customer = new Customer(data['customer']);
        }
        this.products = data['products']?.map((d) => new Product(d));
    }
}
