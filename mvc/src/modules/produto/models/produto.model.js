import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';


const ProdutoModel = sequelize.define(
  'Produto',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 100],
          msg: 'O nome do produto deve ter entre 3 e 100 caracteres.',
        },
        notEmpty: {
          msg: 'O nome do produto não pode estar vazio.',
        },
        is: {
          args: /^[a-zA-ZÀ-ÿ0-9\s]+$/i, // Regex para permitir letras, números e espaços
          msg: 'O nome do produto deve conter apenas letras, números e espaços.',
        },
      }
      // allowNull defaults to true
    },
    preco: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'O preço deve ser um número (xx.xx) válido.',
        },
        min: {
          args: 0.01,
          msg: 'O preço deve ser maior que zero.',
        },
        isNumeric: {
          msg: 'O preço deve conter apenas números.',
        },
      },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'A descrição do produto deve ter no máximo 500 caracteres.',
        },
        is: {
          args: /^[a-zA-ZÀ-ÿ0-9\s.,!?'"()\-]+$/i, // Regex para permitir letras, números e pontuação básica
          msg: 'A descrição do produto deve conter apenas letras, números e pontuação básica.',
        },
      },
    },
  },
  {
    // Other model options go here
    tableName: 'produto',
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  
  },
);
export default ProdutoModel;

// `sequelize.define` also returns the model
// console.log(Produto === sequelize.models.Produto); // true


// import client from "../../../config/database.js"

// class ProdutoModel {
//   static async cadastrar(nome, preco, descricao) {
//     const dados = [nome, preco, descricao];
//     const consulta = `insert into produto(nome, preco, descricao)
//     values ($1, $2, $3) returning *;`
//     const resultado = await client.query(consulta, dados);
//     return resultado.rows;
//   }
//   static async listarTodos() {
//     const consulta = `select * from produto`
//     const resultado = await client.query(consulta);
//     return resultado.rows;
//   }
//   static async listarPorId(id) {
//     const dados = [id];
//     const consulta = `select * from produto where id = $1`
//     const resultado = await client.query(consulta, dados);
//     return resultado.rows;
//   }
//   static async atualizar(id, novoNome, novoPreco, novaDescricao) {
//     const dados = [id, novoNome, novoPreco, novaDescricao];
//     const consulta = `update produto set nome = coalesce($2, nome), preco = coalesce($3, preco), descricao = coalesce($4, descricao)
//     where id = $1 returning *`
//     const resultado = await client.query(consulta,dados);
//     return resultado.rows;
//   }
//   static async deletarPorId(id) {
//     const dados = [id];
//     const consulta = `delete from produto where id = $1`
//     await client.query(consulta, dados);
//   }
//   static async deletarTodos() {
//     const consulta = `delete from produto`;
//     await client.query(consulta)
//   }
//   static async totalProdutos() {
//     const consulta = `select count(id) as total from produto`;
//     const resultado = await client.query(consulta);
//     return resultado.rows
    
//   }
// }

// export default ProdutoModel;