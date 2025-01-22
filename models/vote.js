import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
import { enumStateOfVoting } from "../utils/enums.js";
class Vote extends Model {}

Vote.init(
    {
        _id: { type: DataTypes.UUID, allowNull: false, unique: true },
        type: {
            type: DataTypes.ENUM,
            values: Object.values(enumStateOfVoting),
            allowNull: false,
        },
        question_id: { type: DataTypes.INTEGER, allowNull: true },
        answer_id: { type: DataTypes.INTEGER, allowNull: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
    },

    {
        sequelize,
        tableName: "votes",
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

export default Vote;
