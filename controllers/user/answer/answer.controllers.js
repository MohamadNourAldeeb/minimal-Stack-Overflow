import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { StatusCodes } from "http-status-codes";
import CustomError from "../../../utils/custom_error.js";
import { sendHttpResponse } from "../../../utils/HttpResponse.js";
import { Question, Answer, User } from "../../../models/index.js";
import { generateUuid } from "../../../utils/gen_uuid.js";
import { Op } from "sequelize";

export default {
    create: async (req, res) => {
        const body = req.body;
        let question = await Question.findOne({
            raw: true,
            attributes: ["id"],
            where: {
                _id: body.question_id,
            },
        });
        if (!question) throw new CustomError("the question id is incorrect");

        if (
            await Answer.findOne({
                raw: true,
                attributes: ["id"],
                where: {
                    question_id: question.id,
                    body: body.body,
                    user_id: req.user.id,
                },
            })
        )
            throw new CustomError(
                "the already answered on this question with same data"
            );

        await Answer.create({
            _id: generateUuid(),
            body: body.body,
            question_id: question.id,
            user_id: req.user.id,
        });

        sendHttpResponse(res, StatusCodes.OK);
    },
    update: async (req, res) => {
        const body = req.body;
        let answer = await Answer.findOne({
            raw: true,
            attributes: ["id"],
            where: { _id: req.params.id, user_id: req.user.id },
        });
        if (!answer) throw new CustomError("the answer id is incorrect");

        await Answer.update(
            {
                body: body.body,
            },
            { where: { id: answer.id } }
        );

        sendHttpResponse(res, StatusCodes.OK);
    },
    delete: async (req, res) => {
        let answer = await Answer.findOne({
            raw: true,
            attributes: ["id"],
            where: { _id: req.params.id, user_id: req.user.id },
        });
        if (!answer) throw new CustomError("the answer id is incorrect");

        await Answer.destroy({
            where: { id: answer.id },
        });

        sendHttpResponse(res, StatusCodes.OK);
    },
    getAll: async (req, res) => {
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
        let answers = await Answer.findAll({
            raw: true,
            attributes: { exclude: ["user_id", "question_id"] },
            nest: true,
            limit: +size,
            offset: (+page - 1) * +size,
            where: whereClause,
            include: [
                {
                    model: Question,
                    required: true,
                    attributes: { exclude: ["user_id", "id"] },
                    include: [
                        {
                            model: User,
                            required: true,
                            as: "creator",
                            attributes: ["_id", "user_name"],
                        },
                    ],
                },
                {
                    model: User,
                    required: false,
                    as: "answer_last_editor",
                    attributes: ["_id", "user_name", "email", "avatar"],
                },
            ],
        });

        answers = answers.map((item) => {
            return {
                _id: item._id,
                body: item.body,
                votes: item.votes,
                last_edited_user_data: item.answer_last_editor._id
                    ? item.answer_last_editor
                    : null,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                question_id: item.Question._id,
                question_title: item.Question.title,
                question_detail: item.Question.detail,
                question_views: item.Question.views,
                question_votes: item.Question.votes,
                question_user_id: item.Question.creator._id,
                question_user_name: item.Question.creator.user_name,
                question_createdAt: item.Question.createdAt,
                question_updatedAt: item.Question.updatedAt,
            };
        });
        sendHttpResponse(res, StatusCodes.OK, { answers });
    },
};
