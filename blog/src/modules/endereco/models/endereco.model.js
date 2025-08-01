import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const EnderecoModel = sequelize.define(
    "Endereco",
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id:{
            type: DataTypes.UUID,
            allowNull: false,
            foreignKey: true,
            references: {
                model: 'usuario',
                key: 'id'
            },
        },
        rua:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max:{
                    args: 150,
                    msg: "A rua não pode ter mais de 150 caracteres."
                }
            }
        },
        numero:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max:{
                    args: 10,
                    msg: "O número não pode ter mais de 10 caracteres."
                }
            }
        },
        bairro:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max:{
                    args: 100,
                    msg: "O bairro não pode ter mais de 100 caracteres."
                }
            }
        },
        cidade:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max:{
                    args: 100,
                    msg: "A cidade não pode ter mais de 100 caracteres."
                }
            }
        },
        estado:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max:{
                    args: 2,
                    msg: "O estado não pode ter mais de 2 caracteres. Deve ser informado em formato de sigla."
                }
            }
        },
        cep:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: {
                    args: 8,
                    msg: "O CEP não pode ter mais de 8 caracteres."
                },
                isNumeric: {
                    msg: "O CEP deve conter apenas números."
                }
            }
        },
    }
)
export default EnderecoModel;