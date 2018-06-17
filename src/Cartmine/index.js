const Cart = require('../Cart');
const options = require('../Options');
const shoppableItems = require('../ShoppableItems');

class Cartmine {
    constructor() {
        this.cart = new Cart();
        this.options = options;
        this.authToken = null;

        // Find all items that are able to be added to cart in DOM
        shoppableItems.find(this.cart);
    }
    checkout() {
        // console.log(this.cart.get());
    }
    onCheckout(func) {
        this.onCheckoutHandler = func;
    }
    setAuthToken(token) {
        this.authToken = token;
    }
    static start() {
        if (!window.Cartmine) {
            window.Cartmine = new Cartmine();
        }
        return window.Cartmine;
    }
}

module.exports = Cartmine;
