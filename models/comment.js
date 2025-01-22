import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
class Comment extends Model {}

Comment.init(
    {
        _id: { type: DataTypes.UUID, allowNull: false, unique: true },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        question_id: { type: DataTypes.INTEGER, allowNull: false },
        answer_id: { type: DataTypes.INTEGER, allowNull: false },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
    },

    {
        sequelize,
        tableName: "comments",
        timestamps: true,
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

export default Comment;
