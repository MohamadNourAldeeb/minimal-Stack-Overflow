import Joi from "joi";
import {
    getErrorMessages,
    message,
} from "../../../../utils/getMessageError.js";
import detectedBad from "../../../../utils/modifyText/detectBad.js";
import { enumStateOfVoting } from "../../../../utils/enums.js";
export const schema = {
    body: {
        createVote: Joi.object({
            type: Joi.string()
                .trim()
                .valid(...Object.values(enumStateOfVoting))
                .required()
                .messages(getErrorMessages("type")),
            question_id: Joi.string()
                .min(5)
                .max(30)
                .required()
                .allow(null)
                .messages(getErrorMessages("question_id")),
            answer_id: Joi.string()
                .min(5)
                .max(30)
                .required()
                .allow(null)
                .messages(getErrorMessages("answer_id")),
        }),
    },
    params: Joi.object({
        id: Joi.string().messages(getErrorMessages("id")),
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
