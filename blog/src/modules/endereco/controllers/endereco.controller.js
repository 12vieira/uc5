import axios from "axios";
import EnderecoModel from "../models/endereco.model";
import UsuarioModel from "../../usuario/models/usuario.model.js";

class EnderecoController {
    static async cadastrar(requisicao, resposta) {
        try {
            const { user_id, numero, cep } = requisicao.body;
            if (!user_id) {
                return resposta.status(400).json({ mensagem: "O ID do usuário é obrigatório." });
            }
            const usuario = await UsuarioModel.findByPk(user_id);
            if (!usuario) {
                return resposta.status(404).json({ mensagem: "Usuário não encontrado." });
            }
            const cepe = await axios.get(`https://viacep.com.br/ws/${cep}/json/`); 
            
            const rua = cepe.data.logradouro;
            const bairro = cepe.data.bairro;
            const cidade = cepe.data.localidade;
            const estado = cepe.data.uf;

            const endereco = await EnderecoModel.create({ user_id, rua, numero, bairro, cidade, estado, cep });
            resposta.status(201).json(endereco);
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao criar endereço.", erro: error.message });
        }
    }

    static async listarTodos(requisicao, resposta) {
        try {
            const enderecos = await EnderecoModel.findAll();
            if (enderecos.length === 0) {
                return resposta.status(404).json({ mensagem: "Nenhum endereço encontrado." });
            }
            resposta.status(200).json(enderecos);
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao listar endereços.", erro: error.message });
        }
    }

    static async listarPorId(requisicao, resposta) {
        try {   
            const id = requisicao.params.id;
            if (!id) {
                return resposta.status(400).json({ mensagem: "ID do endereço é obrigatório." });
            }
            const endereco = await EnderecoModel.findByPk(id);
            if (!endereco) {
                return resposta.status(404).json({ mensagem: "Endereço não encontrado." });
            }
            resposta.status(200).json(endereco);
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao listar endereço.", erro: error.message });
        } 
    }          

    static async atualizar(requisicao, resposta) {
        try {
            const id = requisicao.params.id;
            if (!id) {
                return resposta.status(400).json({ mensagem: "ID do endereço é obrigatório." });
            }
            const { novaRua, novoNumero, novoBairro, novaCidade, novoEstado } = requisicao.body;
            const endereco = await EnderecoModel.update({ 
                rua: novaRua,
                numero: novoNumero,
                bairro: novoBairro,
                cidade: novaCidade,
                estado: novoEstado
            }, {
                where: { id }
            });
            resposta.status(200).json({ mensagem: "Endereço atualizado com sucesso!" });
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao atualizar endereço.", erro: error.message });
        }
    }
}