import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { StatusCodes } from "http-status-codes";
import CustomError from "../../../utils/custom_error.js";
import { sendHttpResponse } from "../../../utils/HttpResponse.js";
import { User, Vote } from "../../../models/index.js";
import { convertToWebp } from "../../../utils/compressImage.js";

export default {
    addAvatar: async (req, res) => {
        if (!req.file) {
            throw new CustomError("Please send file");
        }
        const body = req.body;

        let webp = await convertToWebp(req.file.path);
        await User.update({ avatar: webp[0] }, { where: { id: req.user.id } });

        sendHttpResponse(res, StatusCodes.OK);
    },
    delete: async (req, res) => {
        sendHttpResponse(res, StatusCodes.OK);
    },
};
