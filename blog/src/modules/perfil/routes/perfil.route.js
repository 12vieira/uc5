import express from "express";
import PerfilController from "../controllers/perfil.controller.js";
const router = express.Router();

//Total de perfil
router.get("/perfil/total", PerfilController.total);

// Listar todos os perfis
router.get("/perfil", PerfilController.listarTodos);

// Listar perfil por id
router.get("/perfil/:id", PerfilController.listarPorId);

// Cadastrar um perfil
router.post("/perfil/cadastrar", PerfilController.cadastrar);

// Atualizar um perfil  
router.patch("/perfil/atualizar/:id", PerfilController.atualizar);

// Deletar perfil por id
router.delete("/perfil/deletar/:id", PerfilController.deletarPorId);

// Deletar todos os perfis
router.delete("/perfil/deletar", PerfilController.deletar);


export default router;
