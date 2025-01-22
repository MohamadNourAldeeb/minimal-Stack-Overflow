import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { Op } from "sequelize";
import moment from "moment";
import ApiError from "../../models/api_error.model.js";
import { enumTypeError } from "../../utils/enums.js";
import { sendHttpResponse } from "../../utils/HttpResponse.js";

export default {
    addNewError: async (req, res) => {
        await ApiError.create({
            ...req.body,
            code: 400,
            type: enumTypeError.frontend,
            user_id: req.user.id,
        });

        // ! Send Response For Client
        sendHttpResponse(res, StatusCodes.OK);
    },
};
