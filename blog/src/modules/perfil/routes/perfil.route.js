import express from "express";
import PerfilController from "../controllers/perfil.controller.js";
const router = express.Router();

//Total de usuarios
router.get("/usuarios/total", PerfilController.totalUsuarios);

// Listar todos os usuarios
router.get("/usuarios", PerfilController.listarTodos);

// Listar usuario por id
router.get("/usuarios/:id", PerfilController.listarPorId);

// Cadastrar um usuario
router.post("/usuarios/cadastrar", PerfilController.cadastrar);

// Atualizar um usuario
router.patch("/usuarios/atualizar/:id", PerfilController.atualizar);

// Deletar usuario por id
router.delete("/usuarios/deletar/:id", PerfilController.deletarPorId);

// Deletar todos os usuarios
router.delete("/usuarios/deletar", PerfilController.deletar);


export default router;
