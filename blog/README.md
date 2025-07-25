# Aula 03 – Projeto Node.js com Express

## Visão Geral
Este projeto é um exemplo de aplicação Node.js utilizando o framework Express para gerenciamento de produtos. O objetivo é demonstrar a estruturação de um projeto modular, seguindo boas práticas de organização e convenções de código.

## Estrutura de Pastas
```
Aula 03/
│   index.js                # Ponto de entrada da aplicação
│   package.json            # Dependências e scripts do projeto
│
├── docs/                   # Documentação e convenções
│   └── convencoes.md       # Convenções de nomenclatura
│
├── src/
│   ├── config/
│   │   └── database.js     # Simulação de banco de dados (array de produtos)
│   └── modules/
│       ├── cliente/
│       │   └── fazerdepois.js # (Arquivo placeholder)
│       └── produto/
│           ├── controllers/
│           │   └── produto.controller.js # (Controller de produto)
│           ├── models/
│           │   └── produto.model.js      # (Model de produto)
│           └── routes/
│               └── produto.route.js      # (Rotas de produto)
```

## Tecnologias Utilizadas
- **Node.js**
- **Express**
- **dotenv** (para variáveis de ambiente)

## Convenções de Código
As convenções de nomenclatura e organização estão detalhadas em [`docs/convencoes.md`](./docs/convencoes.md). Resumidamente:
- **Arquivos:** kebab-case
- **Variáveis de ambiente:** UPPERCASE
- **Classes:** PascalCase
- **Funções e métodos:** camelCase
- **Constantes:** lowercase
- **Variáveis:** camelCase

## Como Rodar o Projeto
1. **Pré-requisitos:**
   - Node.js instalado
   - npm instalado

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na raiz da pasta `Aula 03` com o conteúdo:
     ```env
     PORTA=3000
     ```

4. **Inicie a aplicação:**
   ```sh
   node index.js
   ```

5. **Acesse as rotas:**
   - A API estará disponível em `http://localhost:3000` (ou porta definida no `.env`).
   - Exemplos de endpoints:
     - `GET /produtos` – Lista todos os produtos
     - `POST /produtos/cadastrar` – Cadastra um novo produto
     - `PATCH /produtos/atualizar/:id` – Atualiza um produto
     - `GET /produtos/listar/:id` – Lista produto por ID
     - `DELETE /produtos/deletar` – Remove todos os produtos
     - `DELETE /produtos/deletar/:id` – Remove produto por ID

## Observações
- O "banco de dados" é um array em memória, apenas para fins didáticos.
- O projeto está preparado para evoluir, com separação de camadas (model, controller, routes) e modularização.

---

Para mais detalhes sobre as convenções e padrões, consulte o arquivo [`docs/convencoes.md`](./docs/convencoes.md).