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
