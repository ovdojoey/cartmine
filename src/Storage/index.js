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
