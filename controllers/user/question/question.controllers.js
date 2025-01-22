import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { StatusCodes } from "http-status-codes";
import CustomError from "../../../utils/custom_error.js";
import { sendHttpResponse } from "../../../utils/HttpResponse.js";
import {
    QuestionTag,
    Question,
    Tag,
    Answer,
    User,
} from "../../../models/index.js";
import { sequelize } from "../../../utils/connect.js";
import { generateUuid } from "../../../utils/gen_uuid.js";
import { Op } from "sequelize";

export default {
    create: async (req, res) => {
        const body = req.body;
        let tagsIds = [];
        if (
            await Question.findOne({
                raw: true,
                attributes: ["id"],
                where: {
                    title: body.title,
                    detail: body.detail,
                    user_id: req.user.id,
                },
            })
        )
            throw new CustomError("the question already found");
        await Promise.all(
            body.tags.map(async (tag) => {
                let getTag = await Tag.findOne({
                    raw: true,
                    attributes: ["id"],
                    where: { name: tag },
                });
                if (!getTag)
                    getTag = await Tag.create({
                        _id: generateUuid(),
                        name: tag,
                    });
                tagsIds.push(getTag.id);
            })
        );

        await sequelize.transaction(async (transaction) => {
            let question = await Question.create(
                {
                    _id: generateUuid(),
                    title: body.title,
                    detail: body.detail,
                    user_id: req.user.id,
                },
                { transaction }
            );

            if (tagsIds.length != 0) {
                await Promise.all(
                    tagsIds.map(async (id) => {
                        await QuestionTag.create(
                            {
                                question_id: question.id,
                                tag_id: id,
                            },
                            { transaction }
                        );
                    })
                );
            }
        });

        sendHttpResponse(res, StatusCodes.OK);
    },
    update: async (req, res) => {
        const body = req.body;
        let question = await Question.findOne({
            raw: true,
            attributes: ["id"],
            where: { _id: req.params.id, user_id: req.user.id },
        });
        if (!question) throw new CustomError("the question id is incorrect");

        await Question.update(
            {
                title: body.title,
                detail: body.detail,
            },
            { where: { id: question.id } }
        );

        sendHttpResponse(res, StatusCodes.OK);
    },
    delete: async (req, res) => {
        let question = await Question.findOne({
            raw: true,
            attributes: ["id"],
            where: { _id: req.params.id, user_id: req.user.id },
        });
        if (!question) throw new CustomError("the question id is incorrect");

        await Question.destroy({
            where: { id: question.id },
        });

        sendHttpResponse(res, StatusCodes.OK);
    },
    getAll: async (req, res) => {
        let { size, page, q } = req.query;

        let whereClause = { user_id: req.user.id };
        if (q) {
            whereClause = {
                [Op.or]: [
                    { title: { [Op.like]: `%${q}%` } },
                    { detail: { [Op.like]: `%${q}%` } },
                    { _id: { [Op.eq]: q } },
                ],
                user_id: req.user.id,
            };
        }

        let questions = await Question.findAll({
            raw: true,
            attributes: { exclude: ["user_id"] },
            nest: true,
            limit: +size,
            offset: (+page - 1) * +size,
            where: whereClause,
            include: [
                {
                    model: QuestionTag,
                    required: false,
                    attributes: [],
                    include: [
                        {
                            model: Tag,
                            required: true,
                        },
                    ],
                },
                {
                    model: Answer,
                    required: false,
                    attributes: { exclude: ["id", "user_id", "question_id"] },
                    include: [
                        {
                            model: User,
                            as: "answer_creator",
                            attributes: ["_id", "user_name", "avatar"],
                        },
                    ],
                },
                {
                    model: User,
                    required: false,
                    as: "last_editor",
                    attributes: ["_id", "user_name", "email", "avatar"],
                },
            ],
        });
        const reducedQuestions = questions.reduce((acc, curr) => {
            const existingQuestion = acc.find((item) => item._id === curr._id);
            let answer = null;
            if (curr.Answers._id) {
                answer = {
                    _id: curr.Answers._id,
                    body: curr.Answers.body,
                    votes: curr.Answers.votes,
                    createdAt: curr.Answers.createdAt,
                    updatedAt: curr.Answers.updatedAt,
                    user_name: curr.Answers.answer_creator.user_name,
                    user_id: curr.Answers.answer_creator._id,
                    user_avatar: curr.Answers.answer_creator.avatar
                        ? process.env.LINK +
                          "/public/images/" +
                          curr.Answers.answer_creator.avatar
                        : "",
                };
            }
            if (existingQuestion) {
                if (curr.QuestionTags.Tag._id) {
                    const tagExists = existingQuestion.tags.some(
                        (tag) => tag._id == curr.QuestionTags.Tag._id
                    );
                    if (!tagExists) {
                        // delete curr.QuestionTags.Tag.id;
                        existingQuestion.tags.push(curr.QuestionTags.Tag);
                    }
                }
                if (answer) {
                    const answerExists = existingQuestion.answers.some(
                        (ans) => ans._id == answer._id
                    );
                    if (!answerExists) {
                        existingQuestion.answers.push(answer);
                    }
                }
            } else {
                delete curr.QuestionTags.Tag.id;
                const tags = curr.QuestionTags.Tag._id
                    ? [curr.QuestionTags.Tag]
                    : [];
                const answers = answer ? [answer] : [];
                curr.last_editor.avatar = curr.last_editor.avatar
                    ? process.env.LINK +
                      "/public/images/" +
                      curr.last_editor.avatar
                    : "";
                acc.push({
                    _id: curr._id,
                    title: curr.title,
                    detail: curr.detail,
                    views: curr.views,
                    votes: curr.votes,
                    lastEditedUserData: curr.last_editor._id
                        ? curr.last_editor
                        : null,
                    createdAt: curr.createdAt,
                    updatedAt: curr.updatedAt,
                    tags,
                    answers,
                });
            }

            return acc;
        }, []);

        sendHttpResponse(res, StatusCodes.OK, { questions: reducedQuestions });
    },
};
