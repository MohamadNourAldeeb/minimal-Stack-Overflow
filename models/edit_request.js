import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
import { enumStateOfEditRequest } from "../utils/enums.js";
class EditRequest extends Model {}

EditRequest.init(
    {
        _id: { type: DataTypes.UUID, allowNull: false, unique: true },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        edited_body: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM,
            values: Object.values(enumStateOfEditRequest),
            defaultValue: enumStateOfEditRequest.pending,
            allowNull: false,
        },
        question_id: { type: DataTypes.INTEGER, allowNull: true },
        answer_id: { type: DataTypes.INTEGER, allowNull: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
    },

    {
        sequelize,
        tableName: "editRequests",
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

export default EditRequest;
