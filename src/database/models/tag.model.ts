import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
    declare name: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static async create_default() {
        await Tag.findCreateFind({
            where: {
                name: "anime"
            }
        })
    }
}

Tag.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    sequelize,
    tableName: 'tag',
    freezeTableName: true
})