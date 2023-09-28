import { MeSomb } from '../MeSomb';
import { Signature } from '../Signature';
import ServiceNotFoundError from '../exceptions/ServiceNotFoundError';
import ServerError from '../exceptions/ServerError';
import PermissionDeniedError from '../exceptions/PermissionDeniedError';
import InvalidClientRequestError from '../exceptions/InvalidClientRequestError';
import Application from '../models/Application';
import Transaction from '../models/Transaction';
import TransactionResponse from '../models/TransactionResponse';
import "isomorphic-fetch";
/**
 * Containing all operations provided by MeSomb Payment Service.
 *
 * [Check the documentation here](https://mesomb.hachther.com/en/api/schema/)
 */
export class PaymentOperation {
    /**
     * Your service application key on MeSomb
     *
     * @private
     */
    applicationKey;
    /**
     * Your access key provided by MeSomb
     *
     * @private
     */
    accessKey;
    /**
     * Your secret key provided by MeSomb
     *
     * @private
     */
    secretKey;
    /**
     * @constructor
     * @param {string} applicationKey - AppKey provider by MeSomb
     * @param {string} accessKey - API access generated on MeSomb
     * @param {string} secretKey - API secret generated on MeSomb
     */
    constructor({ applicationKey, accessKey, secretKey }) {
        this.applicationKey = applicationKey;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
    }
    _buildUrl(endpoint) {
        return `${MeSomb.HOST}/${MeSomb.LANGUAGE}/api/${MeSomb.APIVERSION}/${endpoint}`;
    }
    _getAuthorization(method, endpoint, date, nonce, headers = {}, body) {
        const url = this._buildUrl(endpoint);
        const credentials = { accessKey: this.accessKey, secretKey: this.secretKey };
        return Signature.signRequest('payment', method, url, date, nonce, credentials, headers, body || {});
    }
    async processClientException(response) {
        let message = await response.text();
        let code;
        if (message.startsWith('{')) {
            const data = JSON.parse(message);
            message = data.detail;
            code = data.code;
        }
        switch (response.status) {
            case 404:
                throw new ServiceNotFoundError(message);
            case 403:
            case 401:
                throw new PermissionDeniedError(message);
            case 400:
                throw new InvalidClientRequestError(message, code);
            default:
                throw new ServerError(message, code);
        }
    }
    async _executeRequest(method, endpoint, date, nonce, body = null, mode = 'asynchronous') {
        const url = this._buildUrl(endpoint);
        const headers = {
            'x-mesomb-date': String(date.getTime()),
            'x-mesomb-nonce': nonce,
            'Content-Type': 'application/json',
            'X-MeSomb-Application': this.applicationKey,
            'X-MeSomb-OperationMode': mode,
        };
        if (body && body['trxID']) {
            headers['X-MeSomb-TrxID'] = String(body['trxID']);
            delete body['trxID'];
        }
        if (body) {
            body['source'] = `MeSombJS/v${MeSomb.VERSION}`;
        }
        let authorization;
        if (method === 'POST' && body) {
            authorization = this._getAuthorization(method, endpoint, date, nonce, { 'content-type': 'application/json' }, body);
        }
        else {
            authorization = this._getAuthorization(method, endpoint, date, nonce);
        }
        headers['Authorization'] = authorization;
        const response = await fetch(url, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers,
        });
        if (response.status >= 400) {
            await this.processClientException(response);
        }
        return await response.json();
    }
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
    async makeCollect({ amount, service, payer, date = new Date(), nonce, trxID, country = 'CM', currency = 'XAF', feesIncluded = true, mode = 'synchronous', conversion = false, location, customer, products, extra, }) {
        const endpoint = 'payment/collect/';
        let body = {
            amount,
            service,
            payer,
            country,
            currency,
            fees: feesIncluded,
            conversion,
        };
        if (trxID) {
            body['trxID'] = trxID;
        }
        if (location) {
            body['location'] = location;
        }
        if (customer) {
            body['customer'] = customer;
        }
        if (products) {
            body['products'] = Array.isArray(products) ? products : [products];
        }
        if (extra) {
            body = Object.assign(body, extra);
        }
        return new TransactionResponse(await this._executeRequest('POST', endpoint, date, nonce, body, mode));
    }
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
    async makeDeposit({ amount, service, receiver, date = new Date(), nonce, trxID, country = 'CM', currency = 'XAF', conversion = false, location, customer, products, extra }) {
        const endpoint = 'payment/deposit/';
        let body = { amount, receiver, service, country, currency, conversion };
        if (trxID) {
            body['trxID'] = trxID;
        }
        if (location) {
            body['location'] = location;
        }
        if (customer) {
            body['customer'] = customer;
        }
        if (products) {
            body['products'] = Array.isArray(products) ? products : [products];
        }
        if (extra) {
            body = Object.assign(body, extra);
        }
        return new TransactionResponse(await this._executeRequest('POST', endpoint, date, nonce, body));
    }
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
    async updateSecurity(field, action, value = null, date) {
        const endpoint = 'payment/security/';
        if (!date) {
            date = new Date();
        }
        const body = { field, action };
        if (action !== 'UNSET') {
            body['value'] = value;
        }
        return new Application(await this._executeRequest('POST', endpoint, date, '', body));
    }
    /**
     * Get the current status of your service on MeSomb
     *
     * @param {Date} [date=new Date()] - date of the request
     */
    async getStatus(date = new Date()) {
        const endpoint = 'payment/status/';
        return new Application(await this._executeRequest('GET', endpoint, date, ''));
    }
    /**
     *
     * @param {string[]} ids - List of transaction ID to check
     * @param {MESOMB|EXTERNAL} [source=MESOMB] - EXTERNAL if IDs provided are was generated by your system
     */
    async getTransactions(ids, source = 'MESOMB') {
        const endpoint = `payment/transactions/?ids=${ids.join(',')}&source=${source}`;
        return (await this._executeRequest('GET', endpoint, new Date(), '')).map((d) => new Transaction(d));
    }
    /**
     *
     * @param {string[]} ids - List of transaction ID to check
     * @param {MESOMB|EXTERNAL} [source=MESOMB] - EXTERNAL if IDs provided are was generated by your system
     */
    async checkTransactions(ids, source = 'MESOMB') {
        const endpoint = `payment/transactions/check/?ids=${ids.join(',')}&source=${source}`;
        return (await this._executeRequest('GET', endpoint, new Date(), '')).map((d) => new Transaction(d));
    }
}
