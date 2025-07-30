import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const UsuarioModel = sequelize.define(
    "Usuario",
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true, 
        },
        nome:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len:{
                    args: [2,100],
                    msg: "O nome deve ter entre 2 e 100 caracteres."
                },
                notEmpty: {
                    msg: "O nome não pode estar vazio."
                },
            },
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "O email deve ser um endereço de email válido."
                },
                notEmpty: {
                    msg: "O email não pode estar vazio."
                },
            },
        },
        senha:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: {
                    args: 8,
                    msg: "A senha deve ter mínimo de 8 caracteres."
                },
                notEmpty: {
                    msg: "A senha não pode estar vazia."
                },
            },
        },
        foto_perfil:{
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: {
                    msg: "A foto de perfil deve ser uma URL válida."
                },
            },
        },
        criado_em: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        atualizado_em: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        tableName: "usuario",
        createdAt: "criado_em",
        updatedAt: "atualizado_em"
    }
)

export default UsuarioModel;