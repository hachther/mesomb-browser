import Application from '../models/Application';
import Product from '../models/Product';
import Customer from '../models/Customer';
import TransactionResponse from '../models/TransactionResponse';
import "isomorphic-fetch";
export interface MoneyCollectRequest {
    amount: number;
    service: string;
    payer: string;
    date?: Date;
    nonce: string;
    trxID?: string | number | null;
    country?: string;
    currency?: string;
    feesIncluded?: boolean;
    mode?: 'synchronous' | 'asynchronous';
    conversion?: boolean;
    location?: Location;
    customer?: Customer;
    products?: Product[] | Product;
    extra?: Record<string, any>;
}
export interface MoneyDepositRequest {
    amount: number;
    service: string;
    receiver: string;
    date?: Date;
    nonce: string;
    trxID?: string | number;
    country?: string;
    currency?: string;
    fees?: boolean;
    conversion?: boolean;
    location?: Location;
    customer?: Customer;
    products?: Product[] | Product;
    extra?: Record<string, any>;
}
/**
 * Containing all operations provided by MeSomb Payment Service.
 *
 * [Check the documentation here](https://mesomb.hachther.com/en/api/schema/)
 */
export declare class PaymentOperation {
    /**
     * Your service application key on MeSomb
     *
     * @private
     */
    private readonly applicationKey;
    /**
     * Your access key provided by MeSomb
     *
     * @private
     */
    private readonly accessKey;
    /**
     * Your secret key provided by MeSomb
     *
     * @private
     */
    private readonly secretKey;
    /**
     * @constructor
     * @param {string} applicationKey - AppKey provider by MeSomb
     * @param {string} accessKey - API access generated on MeSomb
     * @param {string} secretKey - API secret generated on MeSomb
     */
    constructor({ applicationKey, accessKey, secretKey }: {
        applicationKey: string;
        accessKey: string;
        secretKey: string;
    });
    private _buildUrl;
    private _getAuthorization;
    private processClientException;
    private _executeRequest;
    /**
     * Collect money a user account
     * [Check the documentation here](https://mesomb.hachther.com/en/api/schema/)
     *
     * @param {Object} params - Details of the transaction to perform
     * @param {number} params.amount amount to collect
     * @param {(ORANGE|MTN|AIRTEL)} params.service payment service
     * @param {string} params.payer - account number to collect from
     * @param {Date} [params.date=new Date()] - date of the request
     * @param {string} params.nonce - unique string on each request
     * @param {string} [params.country=CM] - 2 letters country code of the service (configured during your service registration in MeSomb)
     * @param {string} [params.currency=XAF] - currency of your service depending on your country
     * @param {boolean} [params.feesIncluded=true] - false if your want MeSomb fees to be computed and included in the amount to collect
     * @param {asynchronous|synchronous} [params.mode=synchronous] - define if it is asynchronous or synchronous transaction mode
     * @param {boolean} [params.conversion=false] - true in case of foreign currently defined if you want to rely on MeSomb to convert the amount in the local currency
     * @param {Object} [params.location] -  Map containing the location of the customer with the following attributes
     * @param {string} params.location.location - The location of the customer
     * @param {string} params.location.town - The town of the customer
     * @param {string} [params.location.region] - The region of the customer
     * @param {string} [params.location.country] - ISO code of the customer country
     * @param {Object[]} [params.products] - It is ArrayList of products. Each product are Map with the following attributes: name string, category string, quantity int and amount float
     * @param {string} params.products[].name - Name of the product
     * @param {string} [params.products[].category] - Category of the product if exists
     * @param {number} [params.products[].quantity=1] - Quantity of the product sold
     * @param {number} [params.products[].amount] - Total cost of the production in the transaction
     * @param {Object} [params.customer] - a Map containing information about the customer
     * @param {string} [params.customer.phone] - Phone number of the customer international format
     * @param {string} [params.customer.email] - Email address of the customer
     * @param {string} [params.customer.first_name] - First name of the customer
     * @param {string} [params.customer.last_name] - Last name of the customer
     * @param {string} [params.customer.address] - Living address of the customer
     * @param {string} [params.customer.town] - Living town of the customer
     * @param {string} [params.customer.region] - Living region of the customer
     * @param {string} [params.customer.country] - Living country of the customer (2-letter ISO format)
     * @param {string} [params.trxID] - if you want to include your transaction ID in the request
     * @param {Object} [params.extra] - Map to add some extra attribute depending on the API documentation
     *
     * @return TransactionResponse
     */
    makeCollect({ amount, service, payer, date, nonce, trxID, country, currency, feesIncluded, mode, conversion, location, customer, products, extra, }: MoneyCollectRequest): Promise<TransactionResponse>;
    /**
     * Method to make deposit in a receiver mobile account.
     * [Check the documentation here](https://mesomb.hachther.com/en/api/v1.1/schema/)
     *
     * @param {Object} params - Details of the transaction to perform
     * @param {number} params.amount amount to depose
     * @param {(ORANGE|MTN|AIRTEL)} params.service payment service
     * @param {string} params.receiver - account number where to depose money
     * @param {Date} [params.date] - date of the request
     * @param {string} params.nonce - unique string on each request
     * @param {string} [params.country=CM] - 2 letters country code of the service (configured during your service registration in MeSomb)
     * @param {string} [params.currency=XAF] - currency of your service depending on your country
     * @param {boolean} [params.conversion=false] - true in case of foreign currently defined if you want to rely on MeSomb to convert the amount in the local currency
     * @param {Object} [params.location] -  Map containing the location of the customer with the following attributes
     * @param {string} params.location.location - The location of the customer
     * @param {string} params.location.town - The town of the customer
     * @param {string} [params.location.region] - The region of the customer
     * @param {string} [params.location.country] - ISO code of the customer country
     * @param {Object[]} [params.products] - It is ArrayList of products. Each product are Map with the following attributes: name string, category string, quantity int and amount float
     * @param {string} params.products[].name - Name of the product
     * @param {string} [params.products[].category] - Category of the product if exists
     * @param {number} [params.products[].quantity=1] - Quantity of the product sold
     * @param {number} [params.products[].amount] - Total cost of the production in the transaction
     * @param {Object} [params.customer] - a Map containing information about the customer
     * @param {string} [params.customer.phone] - Phone number of the customer international format
     * @param {string} [params.customer.email] - Email address of the customer
     * @param {string} [params.customer.first_name] - First name of the customer
     * @param {string} [params.customer.last_name] - Last name of the customer
     * @param {string} [params.customer.address] - Living address of the customer
     * @param {string} [params.customer.town] - Living town of the customer
     * @param {string} [params.customer.region] - Living region of the customer
     * @param {string} [params.customer.country] - Living country of the customer (2-letter ISO format)
     * @param {string} [params.trxID] - if you want to include your transaction ID in the request
     * @param {Object} [params.extra] - Map to add some extra attribute depending on the API documentation
     *
     * @return TransactionResponse
     */
    makeDeposit({ amount, service, receiver, date, nonce, trxID, country, currency, conversion, location, customer, products, extra }: MoneyDepositRequest): Promise<TransactionResponse>;
    /**
     * Update security parameters of your service on MeSomb
     *
     * @param {string} field - which security field you want to update (check API documentation)
     * @param {SET|UNSET} action - define the action you want to perform
     * @param {any} [value] - value of the field
     * @param {Date} [date] - date of the request
     *
     * @return Application
     */
    updateSecurity(field: string, action: 'SET' | 'UNSET', value?: any, date?: Date): Promise<Application>;
    /**
     * Get the current status of your service on MeSomb
     *
     * @param {Date} [date=new Date()] - date of the request
     */
    getStatus(date?: Date): Promise<Application>;
    /**
     *
     * @param {string[]} ids - List of transaction ID to check
     * @param {MESOMB|EXTERNAL} [source=MESOMB] - EXTERNAL if IDs provided are was generated by your system
     */
    getTransactions(ids: string[], source?: string): Promise<Record<string, any>[]>;
    /**
     *
     * @param {string[]} ids - List of transaction ID to check
     * @param {MESOMB|EXTERNAL} [source=MESOMB] - EXTERNAL if IDs provided are was generated by your system
     */
    checkTransactions(ids: string[], source?: string): Promise<Record<string, any>[]>;
}
