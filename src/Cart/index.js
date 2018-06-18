const Storage = require('../Storage');
const notifications = require('../Notifications');
const DOM = require('../DOM');

let items = Storage.get('cart') || {};

class Cart {
    constructor() {
        DOM.getCartItems().forEach((shoppableItem) => {
            const cartItem = items[shoppableItem.id];
            if (cartItem) {
                for (const prop in shoppableItem) {
                    if (prop !== 'quantity') {
                        cartItem[prop] = shoppableItem[prop];
                    }
                }
            }
            this.save();
        });
    }
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

}

module.exports = Cart;
