import Customer from "./Customer";
import Location from "./Location";
import Product from "./Product";
/**
 * A MeSomb transaction
 */
export default class Transaction {
    pk: string;
    success: string;
    type: string;
    amount: number;
    fees: number;
    b_party: string;
    message: string;
    service: string;
    reference?: string;
    ts: Date;
    country: string;
    currency: string;
    fin_trx_id: string;
    trxamount?: number;
    location?: Location;
    customer?: Customer;
    products?: Product[];
    /**
     *
     * @param {Object} data
     * @param {string} data.pk - ID of the transaction
     */
    constructor(data: Record<string, any>);
}
