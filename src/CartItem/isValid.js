const Errors = require('../Errors');
const itemsValidated = {};

module.exports = (elem) => {
    let errors = 0;
    const id = elem.dataset.id;
    if (!id) {
        Errors.add(`[data-id] is required for a cart item element: ${elem.outerHTML}`);
        errors++;
    }
    if (itemsValidated[id]) {
        Errors.add(`ID ${id} already used. Item ID must be distinct for element: ${elem.outerHTML}`);
        errors++;
    }
    if (isNaN(parseInt(elem.dataset.amount), 10)) {
        Errors.add(`Invalid amount.  Amount must be in base units (cents): ${elem.outerHTML}`);
        errors++;
    }
    itemsValidated[id] = true;
    return errors === 0;
};
