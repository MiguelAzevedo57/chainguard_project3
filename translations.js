const translations = {
    pt: {
        "lang.portuguese": "Português",
        "lang.english": "English",
        "lang.spanish": "Español",
        "form.title": "Validador de Transações",
        "form.chain": "Chain",
        "form.chain.bitcoin": "Bitcoin",
        "form.chain.ethereum": "Ethereum",
        "form.chain.litecoin": "Litecoin",
        "form.txhash": "Hash da Transação",
        "form.txhash.placeholder": "Insira o hash da transação",
        "form.destination": "Endereço de Destino Esperado",
        "form.destination.placeholder": "Insira o endereço de destino esperado",
        "form.amount": "Valor Esperado (Wei/Satoshi)",
        "form.amount.placeholder": "Insira o valor esperado",
        "form.validate": "Validar Transação",
        "result.validating": "Validando transação...",
        "result.notFound": "Transação não encontrada",
        "result.wrongData": "Dados da transação não correspondem",
        "result.valid": "✓ Transação válida",
        "result.error": "Erro:",
        "result.expected": "Esperado",
        "result.real": "Real",
        "result.dest": "Destino:",
        "result.value": "Valor:",
        "result.ok": "OK",
        "result.wrong": "ERRADO"
    },
    en: {
        "lang.portuguese": "Português",
        "lang.english": "English",
        "lang.spanish": "Español",
        "form.title": "Transaction Validator",
        "form.chain": "Chain",
        "form.chain.bitcoin": "Bitcoin",
        "form.chain.ethereum": "Ethereum",
        "form.chain.litecoin": "Litecoin",
        "form.txhash": "Transaction Hash",
        "form.txhash.placeholder": "Enter the transaction hash",
        "form.destination": "Expected Destination Address",
        "form.destination.placeholder": "Enter the expected destination address",
        "form.amount": "Expected Amount (Wei/Satoshi)",
        "form.amount.placeholder": "Enter the expected amount",
        "form.validate": "Validate Transaction",
        "result.validating": "Validating transaction...",
        "result.notFound": "Transaction not found",
        "result.wrongData": "Transaction data does not match",
        "result.valid": "✓ Valid transaction",
        "result.error": "Error:",
        "result.expected": "Expected",
        "result.real": "Real",
        "result.dest": "Destination:",
        "result.value": "Amount:",
        "result.ok": "OK",
        "result.wrong": "WRONG"
    },
    es: {
        "lang.portuguese": "Português",
        "lang.english": "English",
        "lang.spanish": "Español",
        "form.title": "Validador de Transacciones",
        "form.chain": "Cadena",
        "form.chain.bitcoin": "Bitcoin",
        "form.chain.ethereum": "Ethereum",
        "form.chain.litecoin": "Litecoin",
        "form.txhash": "Hash de Transacción",
        "form.txhash.placeholder": "Ingrese el hash de transacción",
        "form.destination": "Dirección de Destino Esperada",
        "form.destination.placeholder": "Ingrese la dirección de destino esperada",
        "form.amount": "Cantidad Esperada (Wei/Satoshi)",
        "form.amount.placeholder": "Ingrese la cantidad esperada",
        "form.validate": "Validar Transacción",
        "result.validating": "Validando transacción...",
        "result.notFound": "Transacción no encontrada",
        "result.wrongData": "Los datos de transacción no coinciden",
        "result.valid": "✓ Transacción válida",
        "result.error": "Error:",
        "result.expected": "Esperado",
        "result.real": "Real",
        "result.dest": "Destino:",
        "result.value": "Cantidad:",
        "result.ok": "OK",
        "result.wrong": "INCORRECTO"
    }
};

class Translator {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'pt';
        this.updatePage();
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updatePage();
    }

    t(key) {
        return translations[this.currentLanguage][key] || key;
    }

    updatePage() {
        // Atualizar todos os elementos com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = this.t(key);
                } else {
                    element.value = this.t(key);
                }
            } else {
                element.textContent = this.t(key);
            }
        });

        // Atualizar select options
        document.querySelectorAll('[data-i18n-option]').forEach(element => {
            const key = element.getAttribute('data-i18n-option');
            element.textContent = this.t(key);
        });

        // Atualizar language selector
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.value = this.currentLanguage;
        }
    }
}

// Criar instância global
const translator = new Translator();
