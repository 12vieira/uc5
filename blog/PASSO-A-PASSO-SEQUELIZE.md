# Migrando o Projeto para Sequelize (Passo a Passo)

## 1. Instalar o Sequelize e suas dependências

Para começar, instale o Sequelize, o driver do PostgreSQL (pg) e a CLI do Sequelize. No terminal do projeto, execute:

```bash
npm install sequelize pg sequelize-cli --save
# (Opcional: instale a CLI como dependência de desenvolvimento)
npm install sequelize-cli --save-dev
```

- **sequelize**: O ORM Sequelize em si, que permitirá definir modelos e fazer consultas.
- **pg**: O driver do PostgreSQL para o Sequelize se conectar ao banco.
- **sequelize-cli**: Ferramenta de linha de comando para gerar arquivos de configuração, migrations e seeders, e executar comandos de banco (migrations/seeders). Instalada globalmente ou via npx. Aqui usamos via npx por conveniência.

## 2. Inicializar a estrutura do Sequelize

Em seguida, inicialize a estrutura padrão do Sequelize CLI dentro do projeto. Rode o comando:

```bash
npx sequelize-cli init
```

Esse comando cria a configuração inicial do Sequelize no projeto, incluindo as pastas `config`, `models`, `migrations` e `seeders`. A pasta `config` terá o arquivo de configuração de conexão com o banco de dados, `models` conterá os modelos (representações das tabelas), `migrations` conterá os scripts de criação/aleração de tabelas, e `seeders` conterá scripts para popular dados iniciais.

**Dica**: Caso você prefira usar Yarn, o equivalente é `yarn sequelize-cli init`. Aqui usaremos npx com npm para executar a CLI sem instalá-la globalmente.

## 3. Configurar a conexão com o banco de dados

Após o comando anterior, abra o arquivo de configuração criado em `config/config.json`. Nele você deve colocar as credenciais do seu banco de dados (usuário, senha, nome do DB, host, porta, etc). Por padrão, o arquivo JSON virá com um exemplo (geralmente configurado para MySQL). Vamos ajustá-lo para o PostgreSQL e usar nossas variáveis de ambiente definidas no `.env`.

### Passo 3.1: Renomear config.json para config.js

Renomeie o arquivo `config.json` para `config.js`, permitindo escrever código nele. Em seguida, edite seu conteúdo para algo assim:

```js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    dialect:  'postgres'
  },
  test: { /* ... (configurações de teste, se necessário) ... */ },
  production: { /* ... (configurações de produção) ... */ }
};
```

Esse ajuste utiliza dotenv para carregar as variáveis de ambiente e então configura cada ambiente (development, test, production) com os valores. Assim, estamos aproveitando os valores do seu arquivo `.env` em vez de colocar senhas/usuários em texto plano.

- Certifique-se de que as variáveis `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST` e `DB_PORT` estão definidas no `.env` (no seu caso, já estão, conforme fornecido).
- Definimos `dialect: 'postgres'` para indicar que usamos PostgreSQL (o Sequelize por padrão coloca mysql no config de exemplo, então é importante mudar).
- Inclua também a porta se necessário (no exemplo acima usamos `process.env.DB_PORT`).

### Passo 3.2: Configurar .sequelizerc

Como renomeamos para `config.js`, precisamos garantir que a CLI do Sequelize saiba disso. Crie um arquivo `.sequelizerc` na raiz do projeto com o seguinte conteúdo:

```js
const path = require('path');
module.exports = {
  'config': path.resolve('config', 'config.js')
};
```

Isso instrui o Sequelize CLI a usar o arquivo `config.js` em vez de procurar um `config.json` padrão. Sem esse arquivo, a CLI poderia não encontrar as configurações (já que alteramos o nome para `.js`).

### Passo 3.3: Criar o banco de dados (Opcional)

Se o banco de dados em si (database) ainda não estiver criado no servidor PostgreSQL, você pode criá-lo agora. Use a interface do Postgres (por exemplo, `createdb db_ecommerce`) ou execute o comando do Sequelize CLI:

```bash
npx sequelize-cli db:create
```

Esse comando, se as credenciais tiverem permissão, criará o banco de dados especificado nas configs (no ambiente atual). Certifique-se de executar este passo apenas se o banco `db_ecommerce` ainda não existir.

Agora a conexão está configurada. Podemos prosseguir para definir nosso modelo e as migrations.

## 4. Criar o modelo e a migration para Produto

Vamos gerar o modelo Produto usando o Sequelize CLI, o que também criará automaticamente uma migration correspondente para a tabela:

```bash
npx sequelize-cli model:generate --name Produto --attributes nome:string,preco:float,descricao:text
```

**Explicação**: Estamos criando um modelo chamado "Produto" com os campos: nome (texto), preco (número decimal) e descricao (texto). O CLI irá:

- Criar o arquivo `models/produto.js` contendo a definição do modelo Produto.
- Criar um arquivo de migration em `migrations/` com nome do tipo `XXXXXXXXXXXXXX-create-produto.js`, que contém as instruções para criar a tabela no banco.

Abra o arquivo de migration gerado (em `migrations/*create-produto.js`) e verifique seu conteúdo. Ele deve estar criando uma tabela (por padrão, o CLI costuma pluralizar o nome do modelo; se o seu veio como Produtos ou similar, podemos ajustá-lo para manter o nome no singular `produto`). Por exemplo, você pode editar para:

```js
// No up:
await queryInterface.createTable('produto', { 
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  preco: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
});

// No down:
await queryInterface.dropTable('produto');
```

No código acima, definimos a tabela 'produto' com colunas nome, preco, descricao e também as colunas padrão createdAt e updatedAt (que o Sequelize adiciona por padrão se não desativarmos timestamps). Note que as colunas de nome, preço e descrição estão como NOT NULL (pelo uso de `allowNull: false`), já que no código original esses campos eram obrigatórios para cadastrar um produto.

**Observação**: Se você não quiser utilizar as colunas de timestamp createdAt/updatedAt, pode removê-las da migration e no modelo definir `timestamps: false`. No entanto, neste passo a passo manteremos essas colunas, pois são o padrão do Sequelize.

Agora abra o arquivo `models/produto.js` gerado. Ele conterá algo assim (sintaxe de classe do Sequelize):

```js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    static associate(models) {
      // associações, se houver (não aplicável no momento)
    }
  };
  Produto.init({
    nome: DataTypes.STRING,
    preco: DataTypes.FLOAT,
    descricao: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Produto',
    tableName: 'produto',    // garante que o Sequelize use a tabela 'produto'
    timestamps: true         // por padrão é true, incluímos para clareza
  });
  return Produto;
};
```

Certifique-se de ajustar `tableName: 'produto'` para corresponder ao nome da tabela que criamos na migration (se o CLI gerou outro nome por padrão). Definindo `tableName` e mantendo `timestamps: true` (ou removendo essa opção para usar o padrão) garantimos que o modelo corresponda exatamente à tabela criada pelo migration.

Pronto, agora temos o modelo Sequelize do produto e a migration para criar sua tabela.

## 5. Executar as migrations (criação das tabelas no BD)

Com a migration criada, podemos aplicá-la ao banco de dados. Execute no terminal:

```bash
npx sequelize-cli db:migrate
```

Esse comando irá procurar todas as migrations pendentes na pasta `migrations` e executá-las em sequência. No nosso caso, ele executará a migration de criação da tabela de produtos. Ao rodar, você deverá ver uma mensagem de sucesso no console e, no banco de dados, a tabela produto será criada com as colunas especificadas.

Internamente, o Sequelize CLI também cria (se já não existir) uma tabela chamada `SequelizeMeta` no banco. Essa tabela de controle guarda o registro de quais migrations já foram executadas, permitindo rodar o comando múltiplas vezes sem recriar tabelas já existentes.

Após o `db:migrate`, confirme (via alguma ferramenta de DB ou psql) que a tabela produto existe. Inicialmente ela estará vazia.

## 6. Criar seeders com dados de exemplo

Seeders são úteis para inserir dados iniciais ou de teste no banco. Vamos criar um seeder para popular a tabela de produtos com alguns itens de exemplo. Rode o comando:

```bash
npx sequelize-cli seed:generate --name demo-produtos
```

Esse comando vai gerar um arquivo em `seeders/` (com nome semelhante a `XXXXXXXXXXXXXX-demo-produtos.js`). Abra o arquivo gerado e adicione o código para inserir alguns produtos. Por exemplo:

```js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('produto', [
      {
        nome: 'Produto A',
        preco: 100.0,
        descricao: 'Primeiro produto de exemplo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Produto B',
        preco: 200.0,
        descricao: 'Segundo produto de exemplo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('produto', null, {}); 
    // Remove todos os registros da tabela 'produto'
  }
};
```

No código acima, usamos `queryInterface.bulkInsert` para inserir dois registros na tabela produto. Preenchemos os campos `createdAt` e `updatedAt` com a data atual (`new Date()`), pois essas colunas são NOT NULL. Ajuste os valores conforme desejar (por exemplo, preços ou descrições diferentes).

A função `down` utiliza `bulkDelete` para remover os dados inseridos (nesse caso, estamos removendo todos da tabela produto – você poderia refinar usando condições, mas como é apenas demo, `null` remove todos os registros).

Salve o arquivo de seeder após adicionar os produtos de exemplo.

## 7. Executar os seeders (popular o banco de dados)

Para rodar os seeders e inserir os dados de exemplo no banco, execute:

```bash
npx sequelize-cli db:seed:all
```

Esse comando executará todos os seeders pendentes (no caso, nosso demo-produtos) e inserirá os dados especificados. Você deverá ver no console algo indicando que o seeder foi executado com sucesso, e poderá verificar no banco de dados que agora os registros de exemplo estão na tabela produto.

(Caso precise desfazer a inserção por algum motivo, há comandos `db:seed:undo` e `db:seed:undo:all` para remover seeds, porém em muitos cenários de desenvolvimento isso não é necessário. Como mencionado na documentação, o histórico de seeds não fica registrado como o de migrations.)

Até este ponto, já configuramos o Sequelize, criamos a tabela via migration e inserimos dados iniciais via seeder. Agora vamos atualizar o código da aplicação para usar o Sequelize em vez das queries manuais.

## 8. Atualizar o código da aplicação para usar o Sequelize

Agora, substituiremos a lógica existente de acesso ao banco (que usava pg diretamente) pelas chamadas do Sequelize. Isso envolve principalmente modificar o model e o controller de Produto, e remover o uso do client do pg.

### 8.1. Remover o antigo client de banco

O arquivo `src/config/database.js` que exporta o Pool do pg não será mais necessário, já que o Sequelize gerencia a conexão para nós (através do arquivo `models/index.js` gerado pela CLI, que lê as configs e instancia o Sequelize). Você pode removê-lo ou deixá-lo de lado.

Da mesma forma, o antigo ProdutoModel com métodos usando SQL puro será substituído pelo modelo Sequelize.

### 8.2. Importar o modelo Sequelize

No controller (`produto.controller.js`), importe o modelo definido pelo Sequelize. Por exemplo, dependendo de como o `models/index.js` exporta, você pode fazer:

```js
import db from "../models/index.cjs";   // importando o índice de modelos (ajuste o path conforme sua estrutura)
const { Produto } = db;
```

(No caso de estar usando ES Modules, pode ser necessário ajustar a forma de import. O template gerado pelo CLI usa CommonJS. Uma abordagem simples: usar `const { Produto } = require('../models');` em vez de import, ou converter o modelo para exportar via ESM. Para manter as coisas claras aqui, vamos supor uso de require/commonJS no contexto do Sequelize.)

### 8.3. Transformar métodos do controller em assíncronos

As operações com o banco via Sequelize retornam Promises, então devemos usar `await` ou `.then()`. Vamos refatorar os métodos do ProdutoController para `async/await`:

#### Cadastrar produto

Em vez de `ProdutoModel.cadastrar(...)` com SQL, usamos `Produto.create`.

```js
static async cadastrar(req, res) {
  try {
    const { nome, preco, descricao } = req.body;
    if (!nome || !preco || !descricao) {
      return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }
    await Produto.create({ nome, preco, descricao });  // insere no banco
    return res.status(201).json({ mensagem: "Produto criado com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor. Por favor, tente mais tarde!",
      erro: error.message
    });
  }
}
```

**Explicação**: `Produto.create({...})` persiste um novo registro usando os dados fornecidos. O `await` garante que aguardamos a inserção completar. Em caso de sucesso, enviamos código 201. Em caso de erro, cai no `catch`.

#### Listar todos os produtos

Utilizamos `Produto.findAll()` para buscar todos os registros.

```js
static async listarTodos(req, res) {
  try {
    const produtos = await Produto.findAll();  // obtém todos os produtos
    if (produtos.length === 0) {
      return res.status(200).json({ mensagem: "Banco de dados vazio!" });
    }
    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor. Por favor, tente mais tarde!",
      erro: error.message
    });
  }
}
```

Aqui `Produto.findAll()` retorna um array de objetos (instâncias do modelo Produto). Se estiver vazio, retornamos a mensagem apropriada; caso contrário, retornamos o array em JSON.

#### Listar produto por ID

Podemos usar `Produto.findByPk(id)` para buscar pela chave primária (ID) ou `Produto.findOne({ where: { id } })`.

```js
static async listarPorId(req, res) {
  try {
    const id = parseInt(req.params.id);
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado!" });
    }
    return res.status(200).json(produto);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor. Por favor, tente mais tarde!",
      erro: error.message
    });
  }
}
```

Se nenhum produto com o ID dado for encontrado, retornamos 404.

#### Atualizar produto

Podemos usar o método de atualização do Sequelize. Uma forma é usar `Produto.update(...)` passando os novos campos e uma cláusula where para achar o registro, ou buscar o registro e então chamar `.save()`. Usaremos a primeira abordagem:

```js
static async atualizar(req, res) {
  try {
    const { novoNome, novoPreco, novaDescricao } = req.body;
    const id = parseInt(req.params.id);
    const [linhasAfetadas] = await Produto.update(
      { nome: novoNome, preco: novoPreco, descricao: novaDescricao },
      { where: { id } }
    );
    if (linhasAfetadas === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado!" });
    }
    return res.status(200).json({ mensagem: "Produto atualizado com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor. Por favor, tente mais tarde!",
      erro: error.message
    });
  }
}
```

**Explicação**: `Produto.update(dados, { where: { id } })` retorna um array em que o primeiro elemento é o número de linhas afetadas. Se for 0, nenhum produto com aquele ID foi encontrado, então retornamos 404. Caso contrário, consideramos sucesso (200). Opcionalmente, poderíamos retornar os dados atualizados, mas no seu código original apenas uma mensagem é retornada.

#### Deletar produto por ID

Podemos usar `Produto.destroy({ where: { id } })` para deletar diretamente, mas como você deseja retornar o objeto deletado na resposta, precisamos buscar o produto antes de deletar. Faremos:

```js
static async deletarPorId(req, res) {
  try {
    const id = parseInt(req.params.id);
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado!" });
    }
    await produto.destroy();  // remove o registro do banco
    return res.status(200).json({
      mensagem: "Produto excluído com sucesso!",
      produtoExcluido: produto
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor. Por favor, tente mais tarde!",
      erro: error.message
    });
  }
}
```

Aqui, primeiro buscamos a instância. Se não existe, 404. Se existe, chamamos `produto.destroy()` para removê-la. Retornamos uma mensagem de sucesso e incluímos o objeto do produto excluído (o Sequelize ainda o terá em memória após o destroy, representando os dados que foram removidos).

#### Deletar todos os produtos

Podemos utilizar `Produto.destroy` com uma condição vazia ou a opção `truncate`. A forma mais direta:

```js
static async deletarTodos(req, res) {
  try {
    await Produto.destroy({ where: {}, truncate: true });
    return res.status(200).json({ mensagem: "Todos os produtos foram deletados!" });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor. Por favor, tente mais tarde!",
      erro: error.message
    });
  }
}
```

O parâmetro `{ truncate: true }` indica para apagar todos os registros da tabela de forma otimizada (truncate). Após executar, retornamos uma confirmação.

Com as mudanças acima, nosso ProdutoController passa a usar somente o Sequelize para interagir com o banco. Não há mais consultas SQL manuais; tudo é feito via métodos do modelo Produto. Isso traz vantagens como evitar SQL injection automaticamente e tornar o código mais conciso.

### 8.4. Ajustar as rotas (se necessário)

No arquivo de rotas (`produto.route.js`), possivelmente não é preciso mudar nada, já que ainda estamos exportando os mesmos métodos do controller. Apenas verifique se está importando o controller atualizado corretamente. Por exemplo:

```js
import express from "express";
import ProdutoController from "../controllers/produto.controller.js";
const router = express.Router();

router.get("/produtos", ProdutoController.listarTodos);
router.get("/produtos/:id", ProdutoController.listarPorId);
router.post("/produto/cadastrar", ProdutoController.cadastrar);
router.patch("/produto/atualizar/:id", ProdutoController.atualizar);
router.delete("/produto/deletar/:id", ProdutoController.deletarPorId);
router.delete("/produtos", ProdutoController.deletarTodos);

export default router;
```

Essa estrutura permanece igual; apenas certificamo-nos de que o controller está funcionando com Sequelize conforme implementamos.

### 8.5. Remover código não mais usado

Você pode agora remover o arquivo `produto.model.js` antigo (que fazia as queries manuais) e o módulo de configuração do banco com pg (se não houver outras partes do projeto usando). Toda a lógica de banco está encapsulada no Sequelize.

## 9. Testar a aplicação e resultado final

Agora, faça um teste completo para garantir que tudo funciona:

1. Inicie a aplicação (por exemplo, com `npm start` ou `node index.js`, dependendo do seu setup).
2. Use a ferramenta de sua preferência para chamar os endpoints (pode ser o arquivo `api-test.http` que você mencionou, ou Postman, Insomnia, etc).
3. Verifique os seguintes cenários:
   - `GET` em `/produtos` deve retornar a lista de produtos (inicialmente, os dois produtos de exemplo inseridos pelo seeder). Se o banco estava vazio antes, agora não estará mais vazio devido aos seeders.
   - `GET` em `/produtos/1` (ou outro ID existente) deve retornar o produto específico.
   - `POST` em `/produto/cadastrar` com um JSON contendo nome, preco, descricao deve criar um novo produto. Verifique se o retorno é o esperado (mensagem de sucesso) e se o produto aparece ao listar em seguida.
   - `PATCH` em `/produto/atualizar/:id` atualiza o produto correspondente. Teste alterando, por exemplo, nome ou preço, e depois dê um GET para ver se alterou no banco.
   - `DELETE` em `/produto/deletar/:id` remove aquele produto. Após deletar, um GET por ID deve retornar 404, e o DELETE retorna os dados do item excluído na resposta.
   - `DELETE` em `/produtos` remove todos. Após chamar, um GET geral deve indicar banco vazio.

Todos os endpoints devem estar operacionais como antes, mas agora usando Sequelize internamente. O comportamento para o cliente da API permanece o mesmo.

## Conclusão

Você migrou com sucesso o projeto para usar o Sequelize. 🙌 Temos agora:

- **Models definidos** (Produto) em vez de consultas SQL manuais.
- **Migrations** para versionar alterações de esquema do banco (no futuro, se precisar alterar a tabela produto ou criar outras tabelas, basta gerar novas migrations).
- **Seeders** para popular dados iniciais ou de desenvolvimento.
- O código do controller ficou mais enxuto e mantemos as validações e respostas de erro como antes.

Sempre que precisar modificar a estrutura do banco, crie uma nova migration (por ex., adicionar colunas, criar novas tabelas) ao invés de alterar diretamente o modelo sem migration – assim seu esquema permanece sincronizado com o código e controlado por versionamento.

Para adicionar novos seeders de dados, use `seed:generate` e `db:seed:all` de forma semelhante.

Com essa organização, o projeto fica bem estruturado e profissional, facilitando manutenção e evolução. Boa codificação com Sequelize! 🚀

---

## Alternative: Criação Manual de Models

### Se você não quiser usar o comando model:generate

Sim, você pode criar os arquivos diretamente em `models/` sem usar o comando `model:generate` do Sequelize CLI, sem problema nenhum. O comando `model:generate` é apenas um atalho conveniente que cria:

- Um arquivo de modelo (`models/Produto.js`)
- Um arquivo de migration correspondente (`migrations/XXXX-create-produto.js`)

Se você não quiser usar esse comando, pode:

#### ✅ Criar manualmente o model Sequelize em models/produto.js

Exemplo:

```js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Produto extends Model {
    static associate(models) {
      // Defina associações aqui se precisar
    }
  }

  Produto.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Produto',
    tableName: 'produto',
    timestamps: true, // se quiser createdAt e updatedAt
  });

  return Produto;
};
```

E registrar esse model no `models/index.js` (o gerado pelo `sequelize-cli init`) assim:

```js
const Produto = require('./produto')(sequelize);
db.Produto = Produto;
```

#### ✅ Criar a migration manualmente (se quiser usar migration ainda)

Você ainda pode rodar:

```bash
npx sequelize-cli migration:generate --name create-produto
```

E depois editar o conteúdo gerado em `migrations/` com a estrutura da tabela:

```js
await queryInterface.createTable('produto', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  preco: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
});
```

#### ✅ Conclusão

Você não é obrigado a usar `sequelize-cli model:generate`. O que importa:

- Criar o model com `Model.init(...)` no `models/`
- Criar a migration com `queryInterface.createTable(...)` no `migrations/`

Usar ou não a CLI é apenas uma questão de conveniência. Muita gente prefere fazer isso manualmente para ter mais controle e nomear as coisas à sua maneira.

---

## Fontes Utilizadas

- Documentação oficial do Sequelize (v6) – Migrations e Seeds
- Tutorial "Tutorial de Migrations com Node.js e Sequelize" – LuizTools/iMasters (configuração do .env e .sequelizerc)
- Documentação do Sequelize CLI (estrutura inicial do projeto)
- Exemplos práticos de uso do Sequelize em controllers (consulta e criação de registros)
