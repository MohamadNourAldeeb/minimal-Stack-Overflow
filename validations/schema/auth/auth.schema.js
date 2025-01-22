import Joi from "joi";

import detectedBad from "../../../utils/modifyText/detectBad.js";
import { getErrorMessages, message } from "../../../utils/getMessageError.js";
import { getRegular } from "../../../utils/regularExpression.js";
import { enumTypeOtp } from "../../../utils/enums.js";
// import { enumDeviceType, enumTypeOtp } from "../../../utils/enums.js";
export const schema = {
    logIn: Joi.object({
        email: Joi.string()
            .trim()
            .min(5)
            .max(50)
            .required()
            .regex(getRegular("email"))
            .messages(getErrorMessages("email"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
        password: Joi.string()
            .min(8)
            .max(50)
            .pattern(getRegular("password"))
            .messages(getErrorMessages("password")),

        device: Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required()
            .messages(getErrorMessages("device")),
    }),
    refreshToken: Joi.object({
        refresh_token: Joi.string()
            .trim()
            .min(30)
            .required()
            .messages(getErrorMessages("refresh_token"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
    }),
    ChangePass: Joi.object({
        old_password: Joi.string()
            .min(8)
            .max(50)
            .pattern(getRegular("password"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            })
            .messages(getErrorMessages("old_password")),

        new_password: Joi.string()
            .min(8)
            .max(50)
            .pattern(getRegular("password"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            })
            .messages(getErrorMessages("new_password")),
    }),
    SendCode: Joi.object({
        email: Joi.string()
            .trim()
            .min(3)
            .max(50)
            .required()
            .regex(getRegular("email"))
            .messages(getErrorMessages("email"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),

        type: Joi.string()
            .trim()
            .required()
            .valid(...Object.values(enumTypeOtp))
            .messages(getErrorMessages("type"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
    }),
    verification: Joi.object({
        otp_type: Joi.string()
            .trim()
            .valid(...Object.values(enumTypeOtp))
            .required()
            .messages(getErrorMessages("otp_type")),

        device: Joi.string()
            .trim()
            .min(2)
            .required()
            .messages(getErrorMessages("device"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
        email: Joi.string()
            .trim()
            .min(3)
            .max(50)
            .required()
            .regex(getRegular("email"))
            .messages(getErrorMessages("email"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
        otp: Joi.string()
            .trim()
            .length(4)
            .required()
            .messages(getErrorMessages("otp"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
        new_password: Joi.string()
            .trim()
            .min(8)
            .max(100)
            .allow(null)
            .pattern(getRegular("password"))
            .messages(getErrorMessages("new_password")),
    }),

    register: Joi.object({
        device: Joi.string()
            .trim()
            .min(2)
            .required()
            .messages(getErrorMessages("device")),
        user_name: Joi.string()
            .trim()
            .min(1)
            .max(100)
            .required()
            .messages(getErrorMessages("user_name"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
        email: Joi.string()
            .trim()
            .min(3)
            .max(50)
            .required()
            .regex(getRegular("email"))
            .messages(getErrorMessages("email"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
        title: Joi.string()
            .trim()
            .min(3)
            .max(100)
            .allow(null)
            .messages(getErrorMessages("title"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
        about_me: Joi.string()
            .trim()
            .min(5)
            .max(150)
            .allow(null)
            .messages(getErrorMessages("about_me"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
        github_link: Joi.string()
            .trim()
            .min(5)
            .max(80)
            .allow(null)
            .pattern(getRegular("github_link"))
            .messages(getErrorMessages("github_link"))
            .custom((value, helpers) => {
                let checkResult = detectedBad(value);
                if (checkResult === "error") return helpers.message(message);
                else return checkResult;
            }),
        password: Joi.string()
            .trim()
            .min(8)
            .max(100)
            .required()
            .pattern(getRegular("password"))
            .messages(getErrorMessages("password")),
    }),
};
