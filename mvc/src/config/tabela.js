import dotenv from 'dotenv';
dotenv.config();
import client from './database.js'

class CriarTabela {
    static async produto(){
        const consulta = `create table if not exists produto(
            id serial primary key,
            nome varchar(100) not null,
            preco numeric(6,2) not null,
            descricao text
        )`;
        try {
            await client.query(consulta)
            console.log("Tabela criada!")
        } catch (error) {
            console.error("Erro ao criar tabela:", error.message);
        }
        
    }
}
CriarTabela.produto();

export default CriarTabela