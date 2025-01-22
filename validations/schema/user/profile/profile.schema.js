import Joi from "joi";
import {
    getErrorMessages,
    message,
} from "../../../../utils/getMessageError.js";
import detectedBad from "../../../../utils/modifyText/detectBad.js";
export const schema = {
    body: {},
    params: Joi.object({
        id: Joi.string().min(5).max(30).messages(getErrorMessages("id")),
    }),
    query: Joi.object({}),
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
        q: Joi.string().min(2).max(255).messages(getErrorMessages("q")),
    }),
    empty: Joi.object({}),
};
