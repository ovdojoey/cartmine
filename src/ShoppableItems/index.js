const CartItem = require('../CartItem');

module.exports = {
    find(cart) {
        const items = [].slice.call(document.querySelectorAll('[data-cartmine-item]'));
        items.forEach((item) => {
            if (CartItem.validate(item)) {
                const addableItem = new CartItem(item);

                // Update any out of date cart items (price, etc)
                cart.update(addableItem);

                // Add item to cart
                CartItem.addClickListener(item, () => {
                    cart.add(addableItem);
                });
            }
        });
    }
};
