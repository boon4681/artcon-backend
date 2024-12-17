import { DataTypes, Model, type BelongsToGetAssociationMixin, type BelongsToManyAddAssociationMixin, type CreationOptional, type ForeignKey, type HasManyAddAssociationsMixin, type InferAttributes, type InferCreationAttributes, type NonAttribute } from "sequelize";
import { sequelize } from "../db.js";
import type { User } from "./user.model.js";
import type { Tag } from "./tag.model.js";

export class Image extends Model<InferAttributes<Image>, InferCreationAttributes<Image>> {
    declare id: CreationOptional<string>;
    declare owner_id: ForeignKey<User['id']>;
    declare title: string | null | undefined;
    declare description: string;
    declare buyable: boolean;
    declare age_range: number;
    declare price: number | null | undefined;
    declare size: number;
    declare ai_gen: boolean;
    declare rating: number;
    declare likes: number;
    declare images: string[];
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare owner: NonAttribute<User>

    declare getOwner: BelongsToGetAssociationMixin<User>
    declare addTag: BelongsToManyAddAssociationMixin<Tag, string>
}

Image.init({
    id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('images') as any;
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value: string[]) {
            this.setDataValue('images', JSON.stringify(value) as any);
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    buyable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    age_range: {
        type: DataTypes.INTEGER
    },
    price: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    size: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    ai_gen: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    tableName: 'image',
    freezeTableName: true
})