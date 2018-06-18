(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Storage = require('../Storage');
const notifications = require('../Notifications');

let items = Storage.get('cart') || {};

class Cart {
    add(cartItem) {
        let item;
        if (items[cartItem.id]) {
            item = items[cartItem.id];
        } else {
            items[cartItem.id] = cartItem;
            item = cartItem;
        }
        item.quantity++;
        this.save();
        notifications.create({type: 'addToCart', item});
        return item;
    }
    save() {
        Storage.set('cart', items);
        return true;
    }
    clear() {
        items = {};
        this.save();
        return true;
    }
    remove(item) {
        const newCart = Object.assign({}, items);
        delete newCart[item.id];
        items = newCart;
        this.save();
        return true;
    }
    changeQuantity(item, qty) {
        if (!Number.isInteger(qty)) {
            return false;
        }
        items[item.id].quantity = qty;
        this.save();
        return true;
    }
    get() {
        // return a clone of items to prevent modification
        const publicCart = JSON.parse(JSON.stringify(items));
        return publicCart;
    }
    getSubtotal() {
        return Object.keys(items).map((itemKey) => {
            const item = items[itemKey];
            return item.amount * item.quantity;
        }).reduce((acc, cum) => {
            return cum + acc;
        }, 0);
    }
    update(shoppableItem) {
        const cartItem = items[shoppableItem.id];
        if (cartItem) {
            for (const prop in shoppableItem) {
                if (prop !== 'quantity') {
                    cartItem[prop] = shoppableItem[prop];
                }
            }
        }
        this.save();
    }
}

module.exports = Cart;

},{"../Notifications":8,"../Storage":10}],2:[function(require,module,exports){
const isValid = require('./isValid.js');

class CartItem {
    constructor(elem) {
        this.id = elem.dataset.id;
        this.amount = parseInt(elem.dataset.amount, 10);
        this.name = elem.dataset.name;
        this.description = elem.dataset.description;
        this.quantity = 0;
    }
    setQuantity(qty) {
        this.quantity = qty;
    }
    static validate(elem) {
        return isValid(elem);
    }
    static resolveReference(elem) {
        const referenced = document.querySelector(`[data-id=${elem.dataset.ref}]`);
        if (!referenced) {
            return false;
        }
        return referenced;
    }
}

module.exports = CartItem;

},{"./isValid.js":3}],3:[function(require,module,exports){
const Errors = require('../Errors');
const itemsValidated = {};

module.exports = (elem) => {
    let errors = 0;
    const id = elem.dataset.id;
    const ref = elem.dataset.ref;
    if (!id && !ref) {
        Errors.add(`[data-id] or [data-ref] is required for a cart item element: ${elem.outerHTML}`);
        errors++;
    }
    if (itemsValidated[id] && !elem.dataset.referenced) {
        Errors.add(`ID ${id} already used on another element. Use [data-ref] to point to another ID.  This item will be disabled: ${elem.outerHTML}`);
        errors++;
    }
    if (isNaN(parseInt(elem.dataset.amount), 10)) {
        Errors.add(`Invalid amount.  Amount must be in base units (cents): ${elem.outerHTML}`);
        errors++;
    }
    itemsValidated[id] = true;
    return errors === 0;
};

},{"../Errors":7}],4:[function(require,module,exports){
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

},{"../Cart":1,"../DOM":5,"../Errors":7,"../Options":9}],5:[function(require,module,exports){
const CartItem = require('../CartItem');
const listeners = require('./listeners.js');


module.exports = {
    setupItems(Cartmine) {
        if (Cartmine.options.dataMapId) {
            this.mapDataToItems(Cartmine);
        }
        const items = [].slice.call(document.querySelectorAll('[data-cartmine-item]'));
        this.addItems(Cartmine, items);
    },
    addItems(Cartmine, items) {
        items.forEach((item) => {
            let reference = null;
            if (item.dataset.ref) {
                reference = item;
                item = CartItem.resolveReference(item);
                if (!item) {
                    return false;
                }
                item.setAttribute('data-referenced', true);
            }
            if (CartItem.validate(item)) {
                const addableItem = new CartItem(item);

                // Update any out of date cart items (price, etc)
                Cartmine.cart.update(addableItem);

                // Add item to cart
                listeners.add({
                    elem: (reference) ? reference : item,
                    handler: () => {
                        Cartmine.cart.add(addableItem);
                    }
                });
            }
        });
    },
    mapDataToItems(Cartmine) {
        const dataMapId = Cartmine.options.dataMapId;
        const dataMapScript = document.getElementById(dataMapId);
        if (!dataMapScript) {
            return false;
        }
        const dataItems = JSON.parse(dataMapScript.innerHTML);
        const itemsToAdd = [];
        Object.keys(dataItems).forEach((dataItemKey) => {
            const dataItem = dataItems[dataItemKey];
            if (!dataItem.selector) {
                return false;
            }
            const dataItemElems = [].slice.call(document.querySelectorAll(dataItem.selector));
            dataItemElems.forEach((elem) => {
                elem.setAttribute('data-id', dataItemKey);
                Object.keys(dataItem).forEach((dataItemPropKey) => {
                    elem.setAttribute(`data-${dataItemPropKey}`, dataItem[dataItemPropKey]);
                });
                itemsToAdd.push(elem);
            });
        });
        this.addItems(Cartmine, itemsToAdd);
    },
    setupCheckoutButtons(Cartmine) {
        const checkoutButtons = [].slice.call(document.querySelectorAll('[data-cartmine-checkout]'));
        checkoutButtons.forEach((button) => {
            listeners.add({
                elem: button,
                handler: () => {
                    Cartmine.checkout();
                }
            });
        });
    }
};

},{"../CartItem":2,"./listeners.js":6}],6:[function(require,module,exports){
module.exports = {
    add({
        elem,
        handler,
        listeners = ['click']
    }) {
        listeners.forEach((listener) => {
            elem.addEventListener(listener, handler);
        });
    }
};

},{}],7:[function(require,module,exports){
/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

class Errors {
    constructor() {
        this.errors = [];
        this.warns = [];
        this.infos = [];
    }
    add(message, level = 'error') {
        switch (level) {
            case 'error':
                this.errors.push(message);
                break;
            case 'warn':
                this.warns.push(message);
                break;
            case 'info':
                this.infos.push(message);
                break;
        }
    }
    get() {
        return {
            errors: this.errors,
            warns: this.warms,
            infos: this.infos,
        };
    }
    log() {
        console.log('%c Cartmine Report ', 'background: #222; color: #bada55; font-size: 18px; padding: 12px;');
        console.log(`%c Errors (${this.errors.length}): `, 'color: red', `${this.errors.length > 0 ? '\r\n' : ''}`, this.errors.join('\r\n '));
        console.log(`%c Warnings (${this.warns.length}): `, 'color: orange', `${this.warns.length > 0 ? '\r\n' : ''}`, this.warns.join('\r\n '));
        console.log(`%c Infos (${this.infos.length}): `, 'color: blue', `${this.infos.length > 0 ? '\r\n' : ''}`, this.infos.join('\r\n '));
    }
}

module.exports = new Errors();

},{}],8:[function(require,module,exports){
class Notifications {
    create({ type, item }) {
        switch (type) {
            case 'addToCart':
                this.addToCart(item);
                break;
        }
    }
    addToCart(item) {
        const notificationString = `${item.quantity} ${item.name || ''} Added to Cart!`;
        this.show(notificationString);
    }
    show(string) {
        console.log(string);
    }
}

module.exports = new Notifications();

},{}],9:[function(require,module,exports){
const cartmineScript = document.querySelector('script[data-cartmine]');
const options = {
    currencyCode: cartmineScript.getAttribute('data-currency') || 'USD',
    testing: (cartmineScript.getAttribute('data-testing') === 'true'),
    checkoutUrl: cartmineScript.getAttribute('data-checkout-url'),
    taxRate: cartmineScript.getAttribute('data-tax-rate') || null,
    dataMapId: cartmineScript.getAttribute('data-items-map-id') || null,
};
module.exports = options;

},{}],10:[function(require,module,exports){
/* global Cookies */
class Storage {
    constructor() {
        this.supportsLocalStore = this.doesSupportLocalStore();
    }
    doesSupportLocalStore() {
        try {
            localStorage.setItem('test', true);
            localStorage.removeItem('test');
            return true;
        } catch(err) {
            return false;
        }
    }
    set(item, value) {
        const jsonValue = JSON.stringify(value);
        if (this.supportsLocalStore) {
            window.localStorage.setItem(item, jsonValue);
        } else {
            Cookies.set(item, jsonValue);
        }
        return true;
    }
    get(item) {
        let value;
        if (this.supportsLocalStore) {
            value = window.localStorage.getItem(item);
        } else {
            value = Cookies.get(item) || null;
        }
        return JSON.parse(value);
    }
}

module.exports = new Storage();

},{}],11:[function(require,module,exports){
const Cartmine = require('./Cartmine');

// Start Cartmine
Cartmine.start();

},{"./Cartmine":4}]},{},[11]);
