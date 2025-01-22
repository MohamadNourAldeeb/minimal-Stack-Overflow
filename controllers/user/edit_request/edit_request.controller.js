import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { StatusCodes } from "http-status-codes";
import CustomError from "../../../utils/custom_error.js";
import { sendHttpResponse } from "../../../utils/HttpResponse.js";
import { Question, Answer, User, EditRequest } from "../../../models/index.js";
import { sequelize } from "../../../utils/connect.js";
import { generateUuid } from "../../../utils/gen_uuid.js";
import { Op } from "sequelize";
import { enumStateOfEditRequest } from "../../../utils/enums.js";

export default {
    create: async (req, res) => {
        const body = req.body;

        if (
            (!body.question_id && !body.answer_id) ||
            (body.question_id && body.answer_id)
        )
            throw new CustomError(
                "you should send just one type Answer or Question editing request"
            );

        let question = null;
        if (body.question_id) {
            question = await Question.findOne({
                raw: true,
                attributes: ["id"],
                where: {
                    _id: body.question_id,
                    user_id: { [Op.not]: req.user.id },
                },
            });
            if (!question)
                throw new CustomError("the question id is incorrect");
        }

        let answer = null;
        if (body.answer_id) {
            answer = await Answer.findOne({
                raw: true,
                attributes: ["id"],
                where: {
                    _id: body.answer_id,
                    user_id: { [Op.not]: req.user.id },
                },
            });

            if (!answer) throw new CustomError("the answer id is incorrect");
        }

        await EditRequest.create({
            _id: generateUuid(),
            body: body.body,
            question_id: question ? question.id : null,
            answer_id: answer ? answer.id : null,
            user_id: req.user.id,
        });

        sendHttpResponse(res, StatusCodes.OK);
    },
    delete: async (req, res) => {
        let request = await EditRequest.findOne({
            raw: true,
            attributes: ["id"],
            where: { _id: req.params.id, user_id: req.user.id },
        });
        if (!request) throw new CustomError("the request id is incorrect");

        await EditRequest.destroy({
            where: { id: request.id },
        });

        sendHttpResponse(res, StatusCodes.OK);
    },
    getRequestsFromMe: async (req, res) => {
        let { size, page, q } = req.query;

        let whereClause = { user_id: req.user.id };
        if (q) {
            whereClause = {
                [Op.or]: [
                    { body: { [Op.like]: `%${q}%` } },
                    { _id: { [Op.eq]: q } },
                ],
                user_id: req.user.id,
            };
        }
        let requests = await EditRequest.findAll({
            raw: true,
            nest: true,
            limit: +size,
            offset: (+page - 1) * +size,
            where: whereClause,
            attributes: {
                exclude: ["id", "user_id", "question_id", "answer_id"],
            },
            include: [
                {
                    model: Question,
                    required: false,
                    attributes: {
                        exclude: ["id", "user_id", "last_edited_by"],
                    },
                },
                {
                    model: Answer,
                    required: false,
                    attributes: {
                        exclude: ["id", "user_id", "last_edited_by"],
                    },
                },
            ],
        });

        requests = requests.map((request) => {
            let editType = "Question";
            let question = null;
            let answer = null;
            if (request.Answer._id) {
                answer = request.Answer;
                editType = "Answer";
            }
            if (request.Question._id) question = request.Question;
            delete request.Answer;
            delete request.Question;
            request.question = question;
            request.answer = answer;
            request.editType = editType;

            return request;
        });

        sendHttpResponse(res, StatusCodes.OK, { requests });
    },
    getRequestsForMe: async (req, res) => {
        let { size, page, q } = req.query;

        let whereClause = { user_id: { [Op.not]: req.user.id } };
        if (q) {
            whereClause = {
                [Op.or]: [
                    { body: { [Op.like]: `%${q}%` } },
                    { _id: { [Op.eq]: q } },
                ],
                user_id: { [Op.not]: req.user.id },
            };
        }
        let requests = await EditRequest.findAll({
            raw: true,
            nest: true,
            limit: +size,
            offset: (+page - 1) * +size,
            where: whereClause,
            attributes: {
                exclude: ["id", "user_id", "question_id", "answer_id"],
            },
            include: [
                {
                    model: Question,
                    required: false,
                    attributes: {
                        exclude: ["id", "user_id", "last_edited_by"],
                    },
                    where: { user_id: req.user.id },
                },
                {
                    model: Answer,
                    required: false,
                    attributes: {
                        exclude: ["id", "user_id", "last_edited_by"],
                    },
                    where: { user_id: req.user.id },
                },
                {
                    model: User,
                    required: true,
                    as: "creator",
                    attributes: ["_id", "user_name", "email", "avatar"],
                },
            ],
        });

        requests = requests.map((request) => {
            let editType = "Question";
            let question = null;
            let answer = null;
            if (request.Answer._id) {
                answer = request.Answer;
                editType = "Answer";
            }
            if (request.Question._id) question = request.Question;
            delete request.Answer;
            delete request.Question;
            request.question = question;
            request.answer = answer;
            request.editType = editType;

            return request;
        });

        sendHttpResponse(res, StatusCodes.OK, { requests });
    },
    editRequestState: async (req, res) => {
        const body = req.body;
        let request = await EditRequest.findOne({
            raw: true,
            nest: true,
            attributes: ["id", "body", "user_id"],
            where: { _id: req.params.id },
            include: [
                {
                    model: Question,
                    required: false,
                    attributes: ["user_id", "id", "detail"],
                    where: { user_id: req.user.id },
                },
                {
                    model: Answer,
                    required: false,
                    attributes: ["user_id", "id", "body"],
                    where: { user_id: req.user.id },
                },
            ],
        });

        if (!request.Question.user_id && !request.Answer.user_id)
            throw new CustomError("the request id is incorrect");

        let editType = request.Question.user_id ? "Question" : "Answer";

        await sequelize.transaction(async (transaction) => {
            let edited_body = null;
            if (body.status == enumStateOfEditRequest.approved) {
                if (editType == "Question") {
                    edited_body = request.Question.detail;
                    await Question.update(
                        {
                            detail: request.body,
                            last_edited_by: request.user_id,
                        },
                        { where: { id: request.Question.id }, transaction }
                    );
                } else {
                    edited_body = request.Answer.body;
                    await Answer.update(
                        { body: request.body, last_edited_by: request.user_id },
                        { where: { id: request.Answer.id }, transaction }
                    );
                }
            }
            await EditRequest.update(
                { status: body.status, edited_body },
                { where: { id: request.id }, transaction }
            );
        });

        sendHttpResponse(res, StatusCodes.OK);
    },
};
