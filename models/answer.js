import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";

class Answer extends Model {}

Answer.init(
    {
        _id: { type: DataTypes.UUID, allowNull: false, unique: true },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        votes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        question_id: { type: DataTypes.INTEGER, allowNull: false },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        last_edited_by: { type: DataTypes.INTEGER, allowNull: true },
    },

    {
        sequelize,
        tableName: "answers",
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

export default Answer;
