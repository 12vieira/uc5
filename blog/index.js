import express from "express";
import dotenv from "dotenv";
import routeUsuario from "../blog/src/modules/usuario/routes/usuario.route.js"
import routePerfil from "../blog/src/modules/perfil/routes/perfil.route.js"
import "../blog/src/config/database.js"

dotenv.config()

const app = express()
const port = process.env.PORTA

app.use(express.json())
app.use(routeUsuario)
app.use(routePerfil)


app.listen(port, () => {
    try {
        console.log(`Servidor rodando na porta ${port}`)
    } catch (error) {
        console.log("Erro ao subir server:",error.message)
    }
})