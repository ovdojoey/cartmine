const Logger = require('../Logger');
const itemsValidated = {};

module.exports = (elem) => {
    let errors = 0;
    const id = elem.dataset.id;
    const ref = elem.dataset.ref;
    if (!id && !ref) {
        Logger.add(`[data-id] or [data-ref] is required for a cart item element: ${elem.outerHTML}`);
        errors++;
    }
    if (itemsValidated[id] && !elem.dataset.referenced) {
        Logger.add(`ID ${id} already used on another element. Use [data-ref] to point to another ID.  This item will be disabled: ${elem.outerHTML}`);
        errors++;
    }
    if (isNaN(parseInt(elem.dataset.amount), 10)) {
        Logger.add(`Invalid amount.  Amount must be in base units (cents): ${elem.outerHTML}`);
        errors++;
    }
    itemsValidated[id] = true;
    return errors === 0;
};
