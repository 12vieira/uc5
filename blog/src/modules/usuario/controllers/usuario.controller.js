import bcrypt from "bcryptjs";
import UsuarioModel from '../models/usuario.model.js';

class UsuarioController {
    static async cadastrar(requisicao, resposta){
        try {
            const {nome, email, senha, foto_perfil} = requisicao.body;
            if (!nome || !email || !senha) {
                return resposta.status(400).json({mensagem: "Todos os campos são obrigatórios."});
            }
            const salt = bcrypt.genSaltSync(10);
            const senhaHash = bcrypt.hashSync(senha, salt);
            await UsuarioModel.create(
                {
                    nome, email, senha: senhaHash, foto_perfil
                },
            );
            resposta.status(201).json({mensagem: "Usuário cadastrado com sucesso!"});
        } catch (error) {
            resposta.status(500).json({mensagem: "Erro ao cadastrar usuário.", erro: error.message});
        }
    }
    static async listarTodos(requisicao, resposta){
        try {
            const usuarios = await UsuarioModel.findAll(
                {
                    attributes: {
                        exclude: ['senha']
                    }
                }
            );
            if (usuarios.length === 0) {
                return resposta.status(404).json({mensagem: "Nenhum usuário encontrado."});
            }   
            resposta.status(200).json(usuarios);
        } catch (error) {
            resposta.status(500).json({mensagem: "Erro ao listar usuários.", erro: error.message});
        }
    }
    static async listarPorId(requisicao, resposta){
        try {
            const id = requisicao.params.id;
            if (!id) {
                return resposta.status(400).json({mensagem: "ID do usuário é obrigatório."});
            }
            const user = await UsuarioModel.findByPk(id,
                {
                    attributes: {
                        exclude: ['senha']
                    }
                }
            );
            if (!user) {
                return resposta.status(404).json({mensagem: "Usuário não encontrado."});
            }
            resposta.status(200).json(user);
        } catch (error) {
            resposta.status(500).json({mensagem: "Erro ao listar usuários.", erro: error.message});
        }
    }
    static async atualizar(requisicao, resposta){
        try {
            const id = requisicao.params.id;
            if (!id) {
                return resposta.status(400).json({mensagem: "ID do usuário é obrigatório."});
            }
            const {novoNome, novoEmail, novaSenha, novaFoto_perfil} = requisicao.body;
            const salt = bcrypt.genSaltSync(10);
            const senhaHash = bcrypt.hashSync(novaSenha, salt);
            if (!novoNome || !novoEmail || !novaSenha) {
                return resposta.status(400).json({mensagem: "Todos os campos são obrigatórios."});
            }
            const user = await UsuarioModel.update({
                nome: novoNome,
                email: novoEmail,
                senha: senhaHash,
                foto_perfil: novaFoto_perfil
            }, {where: {id}},
            // {
            //     attributes: {
            //         exclude: ['senha']
            //     }
            // }
            );
            resposta.status(201).json({mensagem:"Usuário atualizado com sucesso!"})
            } catch (error) {
            resposta.status(500).json({mensagem: "Erro ao listar usuários.", erro: error.message});
        }
    }
    static async deletarPorId(requisicao, resposta){
        try {
            const id = requisicao.params.id;
            if (!id) {
                return resposta.status(400).json({mensagem: "ID do usuário é obrigatório."});
            }
            await UsuarioModel.destroy({where: {id}});
            resposta.status(201).json({mensagem: "Usuário excluído com sucesso!"})
        } catch (error) {
            resposta.status(500).json({mensagem: "Erro ao listar usuários.", erro: error.message});
        }
    }
    static async deletarTodos(requisicao, resposta){
        try {
            await UsuarioModel.destroy({truncate: true});
            resposta.status(200).json({ mensagem: "Todos os usuários foram deletados!" });
        } catch (error) {
            resposta.status(500).json({mensagem: "Erro interno do servidor. Por favor tente mais tarde!", erro: error.message});
        }
    }
    static async total(requisicao, resposta){
        try {
            const total = await UsuarioModel.count();
            resposta.status(200).json({total});    
        } catch (error) {
            resposta.status(500).json({
                mensagem: "Erro interno do servidor. Por favor tente mais tarde!",
                erro: error.message,
            });
        }
    }

}

export default UsuarioController;