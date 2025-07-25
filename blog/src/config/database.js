import dotenv from "dotenv";
import { Sequelize } from "sequelize";

// Importing dotenv to manage environment variables
dotenv.config();
// Setting up the Sequelize instance with database configuration
// Ensure that the environment variables are set in a .env file
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false
    }
)
// Defining the Produto model with its attributes and options
async function sincronizar() {
    try {
        await sequelize.authenticate();
        console.log("Conexão realizada com sucesso!");
        await sequelize.sync({ force: false, alter: false });
        console.log("Tabela produto criada com sucesso");
    } catch (error) {
        console.error("Unable to connect to the database:", error.message);
    }
} sincronizar();

export default sequelize;