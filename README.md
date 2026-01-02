# Chainguard - Validador de Transações

Aplicação web para validar transações de criptomoedas com suporte multi-língua (Português, Inglês, Espanhol).

## Estrutura do Projeto

```
chainguard_project3/
├── index.html              # Página principal
├── app.js                  # Lógica da aplicação
├── script.js               # Funções auxiliares (RPC, validação)
├── styles.css              # Estilos CSS
├── translations.js         # Sistema de tradução
└── locales/                # Pasta de traduções (referência - usar translations.js)
```

## Funcionalidades

- **Validador de Transações**: Verifica transações em Bitcoin, Ethereum e Litecoin
- **Suporte Multi-língua**: Português, Inglês e Espanhol com seletor no topo da página
- **Persistência de Preferência**: A escolha de idioma é guardada em localStorage
- **Gráfico em Tempo Real**: Gráfico de preços de Bitcoin com Chart.js

## Como Usar

### Iniciar o Servidor

```bash
# Node.js (recomendado)
npx http-server -p 8000

# Ou Python 3
python -m http.server 8000
```

Depois abre: `http://localhost:8000`

### Sistema de Tradução

O sistema usa um ficheiro JavaScript puro (`translations.js`) com um objeto global `translator`:

```javascript
translator.t('form.title')        // Obter tradução
translator.setLanguage('en')      // Mudar idioma
translator.currentLanguage        // Idioma actual
```

### Adicionar Novas Traduções

1. Edita `translations.js`
2. Adiciona a chave nos 3 idiomas (pt, en, es):
```javascript
"minha.chave": "Texto em Português"
```

3. No HTML, usa o atributo `data-i18n`:
```html
<h1 data-i18n="minha.chave">Texto em Português</h1>
```

## Ficheiros Principais

- **translations.js**: Classe `Translator` que gerencia tradução e persistência de idioma
- **app.js**: Lógica principal - formulário, validação, seletor de idioma
- **script.js**: Funções RPC para comunicação com blockchain
- **index.html**: Estrutura HTML com atributos `data-i18n` e `data-i18n-option`

## Requisitos

- Servidor web (para evitar problemas CORS)
- Navegador moderno com suporte ES6+

## Notas

- Não usa dependências NPM - tudo é carregado localmente
- Sem complexidade de i18next - apenas JavaScript puro
- Gráfico Chart.js carregado via CDN

---

## Autor

**Projeto:** Chainguard Project 3  
**Data:** Dezembro 2025  
**Versão:** 1.0.0

---

## Características

- Validação de transações em 40+ blockchains
- Interface multi-língua (PT, EN, ES)
- Detecção automática de idioma
- Gráficos animados em tempo real
- Design responsivo e moderno
- Persistência de preferências do utilizador
- Sem dependências de build (CDN)
- Fácil de estender e personalizar

---

**Pronto para usar! Abra `index.html` e comece a validar transações.**
