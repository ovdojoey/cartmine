const Cartmine = require('./Cartmine');
const Errors = require('./Errors');
const options = require('./Options');

console.log(Cartmine.start());

if (options.testing) {
    Errors.log();
}
