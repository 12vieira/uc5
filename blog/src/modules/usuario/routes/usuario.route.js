import express from "express";
import UsuarioController from "../controllers/usuario.controller.js";

const router = express.Router();

//Total de usuarios
router.get("/usuarios/total", UsuarioController.total);

// Listar todos os usuarios
router.get("/usuarios", UsuarioController.listarTodos);

// Listar usuario por id
router.get("/usuarios/:id", UsuarioController.listarPorId);

// Cadastrar um usuario
router.post("/usuarios/cadastrar", UsuarioController.cadastrar);

// Atualizar um usuario
router.patch("/usuarios/atualizar/:id", UsuarioController.atualizar);

// Deletar usuario por id
router.delete("/usuarios/deletar/:id", UsuarioController.deletarPorId);

// Deletar todos os usuarios
router.delete("/usuarios/deletar", UsuarioController.deletarTodos);



export default router;