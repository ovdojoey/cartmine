const Cart = require('../Cart');
const Errors = require('../Errors');
const DOM = require('../DOM');
const options = require('../Options');

class Cartmine {
    constructor() {
        this.cart = new Cart();
        this.options = options;
        this.authToken = null;
        this.onCheckoutHandler = null;

        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }
    checkout() {
        if (this.onCheckoutHandler) {
            this.onCheckoutHandler();
        } else {
            this.submit();
        }
    }
    onCheckout(func) {
        this.onCheckoutHandler = func;
    }
    submit(token) {
        if (token !== undefined) {
            this.setAuthToken(token);
        }
        // Send all data to this.options.checkoutUrl
        console.log(this.makePurchaseDocument())
    }
    makePurchaseDocument() {
        const cartItems = this.cart.get();
        const purchaseDocument = {
            options: this.options,
            subtotal: this.getSubtotal(),
            items: Object.keys(cartItems).map((cartItemKey) => cartItems[cartItemKey]),
            currencyCode: this.options.currency,
            taxRate: this.options.taxRate
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
    init() {
        DOM.setupItems(this);
        DOM.setupCheckoutButtons(this);
        if (options.testing) {
            Errors.log();
        }
    }
    static start() {
        if (!window.Cartmine) {
            window.Cartmine = new Cartmine();
        }
        return window.Cartmine;
    }
}

module.exports = Cartmine;
