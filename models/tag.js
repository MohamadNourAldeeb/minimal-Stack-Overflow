import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
class Tag extends Model {}

Tag.init(
    {
        _id: { type: DataTypes.UUID, allowNull: false, unique: true },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },

    {
        sequelize,
        tableName: "tags",
        timestamps: true,
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ["_id"],
                name: "_id_index",
                using: "BTREE",
            },
        ],
    }
);

export default Tag;
