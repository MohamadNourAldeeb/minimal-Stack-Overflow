import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
class QuestionTag extends Model {}

QuestionTag.init(
    {
        question_id: { type: DataTypes.INTEGER, allowNull: false },
        tag_id: { type: DataTypes.INTEGER, allowNull: false },
    },

    {
        sequelize,
        tableName: "question_tags",
        timestamps: true,
        updatedAt: false,
    }
);

export default QuestionTag;
