const cartmineScript = document.querySelector('script[data-cartmine]');
const options = {
    currencyCode: cartmineScript.getAttribute('data-currency') || 'USD',
    testing: (cartmineScript.getAttribute('data-testing') === 'true'),
    checkoutUrl: cartmineScript.getAttribute('data-checkout-url'),
    tax: cartmineScript.getAttribute('data-tax-rate') || 0,
};
module.exports = options;
