import { Model, type InferAttributes, type InferCreationAttributes, DataTypes, type ForeignKey, Sequelize, type CreationOptional, type HasOneGetAssociationMixin, type BelongsToGetAssociationMixin, type NonAttribute, type BelongsToManyGetAssociationsMixin, type HasManyGetAssociationsMixinOptions, type HasManyGetAssociationsMixin, type HasManyCountAssociationsMixin, type BelongsToManyAddAssociationMixin, type BelongsToManyRemoveAssociationMixin, type BelongsToManyHasAssociationMixin } from 'sequelize';
import { sequelize } from "../db.js";
import { Role } from "./role.model.js";
import type { Image } from './image.model.js';
import type { Tag } from './tag.model.js';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare name: string | null | undefined;
    declare role_id: ForeignKey<Role["role_id"]>;
    declare balance: CreationOptional<number>;
    declare avatar: string | null | undefined;
    declare username: string;
    declare banner: string | null | undefined;
    declare description: string | null | undefined;
    declare email: string;
    declare password: string | null | undefined
    declare hashtag: string;
    declare fullname: string

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare role: NonAttribute<Role>

    declare getRole: BelongsToGetAssociationMixin<Role>
    declare getImages: HasManyGetAssociationsMixin<Image>
    declare countFollowers: HasManyCountAssociationsMixin
    declare addFollowing: BelongsToManyAddAssociationMixin<User, User['id']>
    declare removeFollowing: BelongsToManyRemoveAssociationMixin<User, User['id']>
    declare hasFollowing: BelongsToManyHasAssociationMixin<User, User['id']>
    static async create_default() { }
}

User.init({
    id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING
    },
    balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    banner: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hashtag: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    tableName: 'user',
    freezeTableName: true
})