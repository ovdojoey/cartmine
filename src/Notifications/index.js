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
