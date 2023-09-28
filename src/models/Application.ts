/**
 * Class represent and MeSomb Application
 */
export default class Application {
  public key: string;
  public logo: string;
  private readonly balances: { country: string; service: string; value: number }[];
  public countries: string[];
  public description: string;
  // tslint:disable-next-line:variable-name
  public is_live: boolean;
  public name: string;
  public readonly security: any;
  public status: 'LIVE' | 'PENDING' | 'DEVELOPMENT';
  public url: string;

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
  public constructor(data: Record<string, any>) {
    this.key = data['key'];
    this.logo = data['logo'];
    this.balances = data['balances'];
    this.countries = data['countries'];
    this.description = data['description'];
    this.is_live = data['is_live'];
    this.name = data['name'];
    this.security = data['security'];
    this.status = data['status'];
    this.url = data['url'];
  }

  /**
   * Get current balance
   *
   * @param {string} [country] - If you want the balance for a specific country
   * @param {string} [service] - If you want the balance for a specific service
   */
  public getBalance(country?: string, service?: string) {
    let balances = this.balances;

    if (country) {
      balances = balances.filter((b) => b.country === country);
    }

    if (service) {
      balances = balances.filter((b) => b.service === service);
    }

    return balances.reduce((acc, item) => acc + item.value, 0);
  }
}
