import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
import { bcrypt } from "../utils/bcrypt.js";
import { enumStateOfEmail } from "../utils/enums.js";

class User extends Model {}

User.init(
    {
        _id: { type: DataTypes.UUID, allowNull: false, unique: true },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue("user_name", value.trim());
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            set(value) {
                this.setDataValue("email", value.trim());
            },
        },
        email_state: {
            type: DataTypes.ENUM,
            values: Object.values(enumStateOfEmail),
            defaultValue: enumStateOfEmail.un_verified,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        is_authenticated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        about_me: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        github_link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },

    {
        sequelize,
        tableName: "users",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["_id"],
                name: "_id_index",
                using: "BTREE",
            },
        ],
        //! Triggers
        hooks: {
            beforeUpdate: (user) => {
                if (user.password) {
                    user.password = bcrypt(user.password);
                }
            },
            beforeCreate: (user) => {
                if (user.password) user.password = bcrypt(user.password);
            },
        },
    }
);

export default User;
