const cartmineScript = document.querySelector('script[data-cartmine]');
const options = {
    currencyCode: cartmineScript.getAttribute('data-currency') || 'USD',
    testing: (cartmineScript.getAttribute('data-testing') === 'true'),
    checkoutUrl: cartmineScript.getAttribute('data-checkout-url'),
    taxRate: cartmineScript.getAttribute('data-tax-rate') || null,
    dataMapId: cartmineScript.getAttribute('data-items-map-id') || null,
};
module.exports = options;
