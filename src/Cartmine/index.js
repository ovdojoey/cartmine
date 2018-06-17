const Cart = require('../Cart');
const options = require('../Options');
const shoppableItems = require('../ShoppableItems');

class Cartmine {
    constructor() {
        this.cart = new Cart();
        this.options = options;
        shoppableItems.find(this.cart);
    }
    checkout() {
        // console.log(this.cart.get());
    }
    static start() {
        if (!window.Cartmine) {
            window.Cartmine = new Cartmine();
        }
        return window.Cartmine;
    }
}

module.exports = Cartmine;
