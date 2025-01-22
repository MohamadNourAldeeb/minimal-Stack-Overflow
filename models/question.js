import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
class Question extends Model {}

Question.init(
    {
        _id: { type: DataTypes.UUID, allowNull: false, unique: true },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        detail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        votes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        last_edited_by: { type: DataTypes.INTEGER, allowNull: true },
    },

    {
        sequelize,
        tableName: "questions",
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

export default Question;
