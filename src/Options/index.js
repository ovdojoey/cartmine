const cartmineScript = document.querySelector('script[data-cartmine]');
const options = {
    currency: cartmineScript.getAttribute('data-currency') || 'USD',
    testing: (
        cartmineScript.getAttribute('data-testing') === true
        || cartmineScript.getAttribute('data-testing') === 'true'
    ),
};
module.exports = options;
