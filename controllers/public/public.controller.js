import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import {
    Answer,
    Question,
    QuestionTag,
    Tag,
    User,
    Vote,
} from "../../models/index.js";
import { Op } from "sequelize";
import { sendHttpResponse } from "../../utils/HttpResponse.js";
dotenv.config({ path: `../.env` });

export default {
    home: async (req, res) => {
        let { size, page, q } = req.query;
        let questions = await Question.findAll({
            raw: true,
            nest: true,
            limit: +size,
            offset: (+page - 1) * +size,
            attributes: { exclude: ["user_id", "last_edited_by"] },
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${q}%` } },
                    { detail: { [Op.like]: `%${q}%` } },
                    { "$Answers.body$": { [Op.like]: `%${q}%` } },
                ],
            },
            include: [
                {
                    model: User,
                    required: true,
                    as: "creator",
                    attributes: ["_id", "user_name", "email", "avatar"],
                },
                {
                    model: Answer,
                    required: false,
                    attributes: [],
                },
            ],
            subQuery: false,
            order: [
                ["votes", "DESC"],
                ["votes", "DESC"],
                ["createdAt", "DESC"],
            ],
            group: ["id"],
        });

        questions = questions.map((item) => {
            delete item.id;
            item.creator.avatar = item.creator.avatar
                ? process.env.LINK + "/public/images/" + item.creator.avatar
                : "";
            return item;
        });

        sendHttpResponse(res, StatusCodes.OK, { result: questions });
    },
    getQuestionDetail: async (req, res) => {
        let id = req.params.id;
        const question = await Question.findAll({
            raw: true,
            nest: true,
            attributes: { exclude: ["user_id", "last_edited_by"] },
            where: { _id: id },
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
                    model: User,
                    required: true,
                    as: "creator",
                    attributes: ["_id", "user_name", "email", "avatar"],
                },
                {
                    model: Answer,
                    required: false,
                    include: [
                        {
                            model: User,
                            as: "answer_creator",
                            attributes: ["_id", "user_name", "avatar"],
                        },
                    ],
                },
                {
                    model: Vote,
                    required: false,
                    include: [
                        {
                            model: User,
                            attributes: ["_id", "user_name", "email", "avatar"],
                        },
                    ],
                },
            ],
        });

        const reducedQuestions = question.reduce((acc, curr) => {
            const existingQuestion = acc.find((item) => item._id === curr._id);
            let answer = null;
            let vote = null;
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
            if (curr.Votes._id) {
                vote = {
                    _id: curr.Votes._id,
                    type: curr.Votes.type,
                    createdAt: curr.Votes.createdAt,
                    user_name: curr.Votes.User.user_name,
                    user_id: curr.Votes.User._id,
                };
            }
            if (existingQuestion) {
                if (curr.QuestionTags.Tag._id) {
                    const tagExists = existingQuestion.tags.some(
                        (tag) => tag._id == curr.QuestionTags.Tag._id
                    );
                    if (!tagExists) {
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
                if (vote) {
                    const voteExists = existingQuestion.votesData.some(
                        (ans) => ans._id == vote._id
                    );
                    if (!voteExists) {
                        existingQuestion.votesData.push(vote);
                    }
                }
            } else {
                delete curr.QuestionTags.Tag.id;
                const tags = curr.QuestionTags.Tag._id
                    ? [curr.QuestionTags.Tag]
                    : [];
                const answers = answer ? [answer] : [];
                let votesData = curr.Votes.id ? [vote] : [];
                curr.creator.avatar = curr.creator.avatar
                    ? process.env.LINK + "/public/images/" + curr.creator.avatar
                    : "";
                acc.push({
                    _id: curr._id,
                    title: curr.title,
                    detail: curr.detail,
                    views: curr.views,
                    votes: curr.votes,
                    creator: curr.creator,
                    createdAt: curr.createdAt,
                    updatedAt: curr.updatedAt,
                    answers,
                    tags,
                    votesData,
                });
            }

            return acc;
        }, []);
        let newViews = reducedQuestions[0].views + 1;

        await Question.update(
            { views: newViews },
            {
                where: {
                    _id: reducedQuestions[0]._id,
                },
            }
        );
        sendHttpResponse(res, StatusCodes.OK, { question: reducedQuestions });
    },
};
