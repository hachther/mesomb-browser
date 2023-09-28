export default class Product {
    name;
    category;
    quantity;
    amount;
    constructor(data) {
        this.name = data['name'];
        this.category = data['category'];
        this.quantity = data['quantity'];
        this.amount = data['amount'];
    }
}
