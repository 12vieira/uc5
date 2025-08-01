import PerfilModel from "../models/perfil.model.js";

class PerfilController {
    static async cadastrar(requisicao, resposta) {
        try {
            const { user_id, bio, site_pessoal, data_nascimento } = requisicao.body;
            if (!user_id) {
                return resposta.status(400).json({ mensagem: "O ID do usuário é obrigatório." });
            }
            const perfil = await PerfilModel.create({ user_id, bio, site_pessoal, data_nascimento });
            resposta.status(201).json(perfil);
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao criar perfil.", erro: error.message });
        }
    }

    static async listarTodos(requisicao, resposta) {
        try {
            const perfis = await PerfilModel.findAll();
            if (perfis.length === 0) {
                return resposta.status(404).json({ mensagem: "Nenhum perfil encontrado." });
            }
            resposta.status(200).json(perfis);
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao listar perfis.", erro: error.message });
        }
    }

    static async listarPorId(requisicao, resposta) {
        try {   
            const id = requisicao.params.id;
            if (!id) {
                return resposta.status(400).json({ mensagem: "ID do perfil é obrigatório." });
            }
            const perfil = await PerfilModel.findByPk(id);
            if (!perfil) {
                return resposta.status(404).json({ mensagem: "Perfil não encontrado." });
            }
            resposta.status(200).json(perfil);
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao listar perfil.", erro: error.message });
        } 
    }          

    static async atualizar(requisicao, resposta) {
        try {
            const id = requisicao.params.id;
            if (!id) {
                return resposta.status(400).json({ mensagem: "ID do perfil é obrigatório." });
            }
            const { novaBio, novoSite_pessoal, novaData_nascimento } = requisicao.body;
            const perfil = await PerfilModel.update({ 
                bio: novaBio, 
                site_pessoal: novoSite_pessoal, 
                data_nascimento: novaData_nascimento },
                { where: { id } }
            );
            resposta.status(200).json({ mensagem: "Perfil atualizado com sucesso!" });
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao atualizar perfil.", erro: error.message });
        }
    }

    static async deletarPorId(requisicao, resposta) {
        try {
            const id = requisicao.params.id;
            if (!id) {
                return resposta.status(400).json({ mensagem: "ID do perfil é obrigatório." });
            }
            const perfil = await PerfilModel.destroy({ where: { id } });
            if (perfil === 0) {
                return resposta.status(404).json({ mensagem: "Perfil não encontrado." });
            }
            resposta.status(200).json({ mensagem: "Perfil excluído com sucesso!" });
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao excluir perfil.", erro: error.message });
        }
    } 
    static async deletar(requisicao, resposta) {
        try {
            await PerfilModel.destroy({ where: {}, truncate: true });
            resposta.status(200).json({ mensagem: "Todos os perfis foram excluídos com sucesso!" });
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao excluir perfis.", erro: error.message });
        }
    }
    static async total(requisicao, resposta){
        try {
            const total = await PerfilModel.count();
            resposta.status(200).json({total})
        } catch (error) {
            resposta.status(500).json({ mensagem: "Erro ao totalizar perfis.", erro: error.message });
        }
    }
}

export default PerfilController