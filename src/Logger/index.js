/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

class Logger {
    constructor() {
        this.errors = [];
        this.warns = [];
        this.infos = [];
    }
    add(message, level = 'error') {
        switch (level) {
            case 'error':
                this.errors.push(message);
                break;
            case 'warn':
                this.warns.push(message);
                break;
            case 'info':
                this.infos.push(message);
                break;
        }
    }
    get() {
        return {
            errors: this.errors,
            warns: this.warms,
            infos: this.infos,
        };
    }
    log() {
        console.log('%c Cartmine Report ', 'background: #222; color: #bada55; font-size: 18px; padding: 12px;');
        console.log(`%c Errors (${this.errors.length}): `, 'color: red', `${this.errors.length > 0 ? '\r\n' : ''}`, this.errors.join('\r\n '));
        console.log(`%c Warnings (${this.warns.length}): `, 'color: orange', `${this.warns.length > 0 ? '\r\n' : ''}`, this.warns.join('\r\n '));
        console.log(`%c Infos (${this.infos.length}): `, 'color: blue', `${this.infos.length > 0 ? '\r\n' : ''}`, this.infos.join('\r\n '));
    }
}

module.exports = new Logger();
