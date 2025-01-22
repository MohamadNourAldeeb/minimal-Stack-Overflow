import Joi from "joi";
import { getErrorMessages, message } from "../../../utils/getMessageError.js";
import detectedBad from "../../../utils/modifyText/detectBad.js";
import { enumTypeError } from "../../../utils/enums.js";
export const schema = {
    body: Joi.object({
        message: Joi.string()
            .trim()
            .required()
            .messages(getErrorMessages("message")),
        file: Joi.string().trim().required().messages(getErrorMessages("file")),
        line: Joi.number().required().messages(getErrorMessages("line")),
    }),
    params: Joi.object({
        id: Joi.string().messages(getErrorMessages("id")),
    }),
    pagination: Joi.object({
        size: Joi.number()
            .required()
            .integer()
            .min(1)
            .max(1e3)
            .messages(getErrorMessages("size")),
        page: Joi.number()
            .integer()
            .required()
            .min(1)
            .max(1e5)
            .messages(getErrorMessages("page")),
        type: Joi.string()
            .trim()
            .valid(...Object.values(enumTypeError))

            .messages(getErrorMessages("type")),
    }),
    query: Joi.object({}),

    empty: Joi.object({}),
};
