import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false
  }
);

async function sincronizar() {
    try {
    await sequelize.authenticate();
    console.log("Conexão realizada com sucesso!");
    await sequelize.sync({ force: false, alter: false });
    console.log("Tabela produto criada com sucesso");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
}

sincronizar();

export default sequelize;


// import dotenv from 'dotenv';
// import pg from 'pg';
// const { Pool } = pg;
// dotenv.config();

// const client = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
// })

// export default client;