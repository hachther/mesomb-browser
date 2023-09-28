/**
 * Class represent and MeSomb Application
 */
export default class Application {
    key: string;
    logo: string;
    private readonly balances;
    countries: string[];
    description: string;
    is_live: boolean;
    name: string;
    readonly security: any;
    status: 'LIVE' | 'PENDING' | 'DEVELOPMENT';
    url: string;
    /**
     *
     * @param {Object} data
     * @param {string} data.key - The application key provider by MeSomb
     * @param {string} [data.logo] - The URL of your application in MeSomb
     * @param {Object[]} data.balances - Balance details for all account of the application (One account by service)
     * @param {string} data.balances.county - The country of the balance account
     * @param {string} data.balances.service - The service of the balance account
     * @param {string} data.balances.value - The balance available in the account
     * @param {string} data.countries - List of countries handle by the application
     * @param {string} [data.description] - Description you provided when create your application
     * @param {boolean} data.is_live - true if you can provide live transaction or not
     * @param {boolean} data.name - The name of your application in MeSomb
     * @param {Object} data.security - Security settings of your application
     * @param {Object} data.status - The status of your application
     */
    constructor(data: Record<string, any>);
    /**
     * Get current balance
     *
     * @param {string} [country] - If you want the balance for a specific country
     * @param {string} [service] - If you want the balance for a specific service
     */
    getBalance(country?: string, service?: string): number;
}
