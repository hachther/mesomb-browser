export default class Location {
    town;
    region;
    country;
    constructor(data) {
        this.town = data['town'];
        this.region = data['region'];
        this.country = data['country'];
    }
}
