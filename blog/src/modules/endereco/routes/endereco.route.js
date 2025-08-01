import express from "express";
import EnderecoController from "../controllers/endereco.controller.js";
const router = express.Router();

//Total de endereco
router.get("/endereco/total", EnderecoController.total);

// Listar todos os enderecos
router.get("/endereco", EnderecoController.listarTodos);

// Listar endereco por id
router.get("/endereco/:id", EnderecoController.listarPorId);

// Cadastrar um endereco
router.post("/endereco/cadastrar", EnderecoController.cadastrar);

// Atualizar um endereco
router.patch("/endereco/atualizar/:id", EnderecoController.atualizar);

// Deletar endereco por id
router.delete("/endereco/deletar/:id", EnderecoController.deletarPorId);

// Deletar todos os enderecos
router.delete("/endereco/deletar", EnderecoController.deletar);


export default router;
