
import express from "express"
import dotenv from "dotenv"
import routeProduto  from "./src/modules/produto/routes/produto.route.js"

import sequelize from "./src/config/database.js"

dotenv.config()

const app = express()
const port = process.env.PORTA

app.use(express.json())
app.use('/api',routeProduto)
// app.use('/api', routeCliente)


app.listen(port, async () => {
    try {
        await sequelize.sync({ force: true, alter: true });
        console.log("Banco de dados sincronizado com sucesso!");
    } catch (error) {
        console.error("Erro ao sincronizar o banco de dados:", error);
        return;
    }
    console.log(`Servidor rodando na porta ${port}`)
})


// import express from "express"
// import dotenv from "dotenv"
// import routeProduto  from "./src/modules/produto/routes/produto.route.js"
// import "../mvc/src/config/tabela.js"
// dotenv.config()

// const app = express()
// const port = process.env.PORTA

// app.use(express.json())
// app.use(routeProduto)

// app.listen(port, () => {
//     console.log(`Servidor rodando na porta ${port}`)
// })
