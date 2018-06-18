const Logger = require('../Logger');

const Config = () => {
    const cartmineScript = document.querySelector('script[data-cartmine]');
    const cartmineScriptParent = cartmineScript.parentElement;
    const useForm = (cartmineScriptParent.tagName === 'form' && cartmineScriptParent.action);

    if (!cartmineScript) {
        Logger.add('Cartmine script was not added properly - [data-cartmine] is required');
    }
    return {
        cartmineScript,
        cartmineForm: (useForm) ? cartmineScriptParent : false
    };
};

module.exports = Config();
