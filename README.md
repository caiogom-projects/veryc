# 📦 Sistema Simples de Registro de Entradas (Bipe de Estoque)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)

Um sistema web leve, rápido e totalmente executado no lado do cliente (Front-End) desenvolvido para melhorar o fluxo de recebimento, conferência e devolução de mercadorias através de leitores de código de barras (bipes) ou digitação manual.

---

## 🚀 Funcionalidades Principais

- **⏱️ Registro em Tempo Real:** Captura automática da data e hora exatas de cada bipe no padrão brasileiro (`DD/MM/AAAA` | `HH:MM:SS`).
- **🛡️ Dados (LocalStorage):** Os dados ficam na memória do navegador. Você pode recarregar a página (F5) ou fechar a aba que o lote continuará lá.
- **🔍 Busca:** Barra de pesquisa que filtra por código de barras, número da NFe ou observações sem recarregar a página.
- **📑 Paginação:** Controle do volume de exibição na tela (10, 20, 30, 40 ou 50 itens por página).
- **📊 Exportação para Excel:** Botão que gera um arquivo `.xlsx`, aplicando títulos e ajuste automático da largura das colunas.
- **⚙️ Gerenciamento de Registros:** Botão para deletar bipes lançados incorretamente ou caso desejar uma limpeza total, é possível, para início de uma nova operação.

---

## 🛠️ O que foi utilizado até o momento?

O projeto foi construído sem a necessidade de frameworks pesados:

- **HTML5:** Estruturação semântica da aplicação.
- **CSS3:** Layout limpo, responsivo, focado no uso de qualquer pessoa.
- **JavaScript (ES6+):** Manipulação nativa do DOM, tratamento de eventos e gerenciamento de arrays/objetos.
- **SheetJS (XLSX):** Biblioteca utilizada para a conversão de objetos JSON diretamente para planilhas do Microsoft Excel.

---

## 📁 Estrutura do Projeto

```text
├── css/
│   └── estilo.css         # Toda a identidade visual e design do sistema
├── js/
│   └── app.js             # O "motor" lógico: regras de negócio, LocalStorage e Excel
├── index.html             # A interface principal do usuário
└── README.md              # Documentação do sistema
