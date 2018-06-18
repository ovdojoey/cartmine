const CartItem = require('../CartItem');
const listeners = require('./listeners.js');
const Logger = require('../Logger');

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
            if (dataItemElems.length === 0) {
                Logger.add(`The data map selector ${dataItem.selector} did not resolve to any HTML element on this page`, 'info');
            }
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
