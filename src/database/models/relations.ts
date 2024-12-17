import { sequelize } from "$model";
import { Image } from "./image.model.js";
import { Role } from "./role.model.js";
import { Tag } from "./tag.model.js";
import { User } from "./user.model.js";

Role.hasMany(User, { foreignKey: "role_id" })

User.belongsTo(Role, { foreignKey: "role_id" })

User.hasMany(Image, { foreignKey: "owner_id" })

Image.belongsTo(User, { foreignKey: "owner_id", as: 'owner' })

const Tag_Image = sequelize.define('Tag_Image', {}, { timestamps: false });
Image.belongsToMany(Tag, { through: Tag_Image });
Tag.belongsToMany(Image, { through: Tag_Image });

const Liked_Image = sequelize.define('Liked_Image', {}, { timestamps: false });
Image.belongsToMany(User, { as: 'liked', through: Liked_Image })
User.belongsToMany(Image, { as: 'liking', through: Liked_Image })

const Following = sequelize.define('Following', {}, { timestamps: false });
User.belongsToMany(User, { as: 'followers', through: Following, foreignKey: 'source' })
User.belongsToMany(User, { as: 'following', through: Following, foreignKey: 'target' });