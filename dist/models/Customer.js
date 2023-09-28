export default class Customer {
    email;
    phone;
    town;
    region;
    country;
    // tslint:disable-next-line:variable-name
    first_name;
    // tslint:disable-next-line:variable-name
    last_name;
    address;
    constructor(data) {
        this.email = data['email'];
        this.phone = data['phone'];
        this.town = data['town'];
        this.region = data['region'];
        this.country = data['country'];
        this.first_name = data['first_name'];
        this.last_name = data['last_name'];
        this.address = data['address'];
    }
}
