
import express from "express"
import dotenv from "dotenv"
import routeProduto  from "./src/modules/produto/routes/produto.route.js"
import "../mvc/src/config/tabela.js"
dotenv.config()

const app = express()
const port = process.env.PORTA

app.use(express.json())
app.use(routeProduto)

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})
