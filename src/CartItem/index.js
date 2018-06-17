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
    static addClickListener(elem, handler) {
        elem.addEventListener('click', handler);
    }
}

module.exports = CartItem;
