import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    declare role_id: CreationOptional<number>;
    declare name: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static async create_default() {
        await Role.findCreateFind({
            where: {
                role_id: 0,
                name: "member"
            }
        })
        await Role.findCreateFind({
            where: {
                role_id: 1,
                name: "admin"
            }
        })
    }
}

Role.init({
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    sequelize,
    tableName: 'role',
    freezeTableName: true
})