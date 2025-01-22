import Joi from 'joi';
import { getErrorMessages, message } from '../../../utils/getMessageError.js';
import { getRegular } from '../../../utils/regularExpression.js';
import detectedBad from '../../../utils/modifyText/detectBad.js';
export const schema = {
  body: {
    init: Joi.object({
      app_version: Joi.string()
        .trim()
        .min(5)
        .max(100)
        .required()
        .messages(getErrorMessages('app_version'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),

      country: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('country'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      countryCode: Joi.string()
        .trim()
        .min(2)
        .max(4)
        .required()
        .messages(getErrorMessages('countryCode'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      region: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('region'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      regionName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('regionName'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),

      city: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('city'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      device_type: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('device_type'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      zip: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('zip'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),

      lat: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('lat'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      lon: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('lon'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      timezone: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('timezone'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      isp: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('isp'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      org: Joi.string()
        .trim()
        .max(100)
        .allow('')
        .required()
        .messages(getErrorMessages('org'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      as: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('as'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
      query: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages(getErrorMessages('query'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
    }),
    createRate: Joi.object({
      rate: Joi.number()
        .integer()
        .required()
        .min(1)
        .max(5)
        .messages(getErrorMessages('rate')),
      feedback: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required()
        .messages(getErrorMessages('feedback'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
    }),
    changeLang: Joi.object({
      language: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .messages(getErrorMessages('language'))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === 'error') return helpers.message(message);
          else return checkResult;
        }),
    }),
  },
  params: Joi.object({
    id: Joi.string().messages(getErrorMessages('id')),
  }),
  query: Joi.object({}),

  empty: Joi.object({}),
};
