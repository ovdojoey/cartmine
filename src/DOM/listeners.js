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
