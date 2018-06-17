const Cart = require('../Cart');
const options = require('../Options');
const shoppableItems = require('../ShoppableItems');

class Cartmine {
    constructor() {
        this.cart = new Cart();
        this.options = options;
        this.authToken = null;
        this.onCheckoutHandler = null;
        // Find all items that are able to be added to cart in DOM
        shoppableItems.find(this.cart);
    }
    checkout() {
        if (this.onCheckoutHandler) {
            this.onCheckoutHandler();
        } else {
            this.submit();
        }
    }
    onCheckout(func) {
        this.onCheckoutHandler = func.bind(this);
    }
    submit(token) {
        if (token !== undefined) {
            this.setAuthToken(token);
        }
        // Send all data to this.options.checkoutUrl

    }
    makePurchaseDocument() {
        const purchaseDocument = {
            cartmine: this,
            subtotal: this.getSubtotal(),
            items: this.cart.get(),
            currencyCode: this.options.currency,
            tax: this.options.tax
        };

        if (this.authToken) {
            purchaseDocument.authToken = this.authToken;
        }

        return JSON.stringify(purchaseDocument);
    }
    setAuthToken(token) {
        this.authToken = token;
    }
    getSubtotal() {
        return this.cart.getSubtotal();
    }
    static start() {
        if (!window.Cartmine) {
            window.Cartmine = new Cartmine();
        }
        return window.Cartmine;
    }
}

module.exports = Cartmine;
