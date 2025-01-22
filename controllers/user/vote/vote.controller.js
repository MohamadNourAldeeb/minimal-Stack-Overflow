import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { StatusCodes } from "http-status-codes";
import CustomError from "../../../utils/custom_error.js";
import { sendHttpResponse } from "../../../utils/HttpResponse.js";
import {
    Question,
    Answer,
    User,
    EditRequest,
    Vote,
} from "../../../models/index.js";
import { sequelize } from "../../../utils/connect.js";
import { generateUuid } from "../../../utils/gen_uuid.js";
import { Op } from "sequelize";
import { enumStateOfVoting } from "../../../utils/enums.js";

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

        let question = await Question.findOne({
            raw: true,
            attributes: ["id", "votes"],
            where: {
                _id: body.question_id,
            },
        });
        if (body.question_id && !question)
            throw new CustomError("the question id is incorrect");

        let answer = await Answer.findOne({
            raw: true,
            attributes: ["id", "votes"],
            where: {
                _id: body.answer_id,
            },
        });
        if (body.answer_id && !answer)
            throw new CustomError("the answer id is incorrect");

        if (
            question &&
            (await Vote.findOne({
                raw: true,
                attributes: ["id"],
                where: { user_id: req.user.id, question_id: question.id },
            }))
        )
            throw new CustomError("you already voted on this question");
        if (
            answer &&
            (await Vote.findOne({
                raw: true,
                attributes: ["id"],
                where: { user_id: req.user.id, answer_id: answer.id },
            }))
        )
            throw new CustomError("you already voted on this answer");

        await sequelize.transaction(async (transaction) => {
            await Vote.create(
                {
                    _id: generateUuid(),
                    type: body.type,
                    question_id: question ? question.id : null,
                    answer_id: answer ? answer.id : null,
                    user_id: req.user.id,
                },
                { transaction }
            );

            let newVote = null;
            if (question) {
                if (body.type == enumStateOfVoting.upVote)
                    newVote = question.votes + 1;
                else newVote = question.votes - 1;

                await Question.update(
                    { votes: newVote },
                    { where: { id: question.id }, transaction }
                );
            } else {
                if (body.type == enumStateOfVoting.upVote)
                    newVote = answer.votes + 1;
                else newVote = answer.votes - 1;
                await Answer.update(
                    { votes: newVote },
                    { where: { id: answer.id }, transaction }
                );
            }
        });

        sendHttpResponse(res, StatusCodes.OK);
    },
    delete: async (req, res) => {
        let vote = await Vote.findOne({
            raw: true,
            attributes: ["id"],
            where: { _id: req.params.id, user_id: req.user.id },
        });
        if (!vote) throw new CustomError("the vote id is incorrect");

        await Vote.destroy({
            where: { id: vote.id },
        });

        sendHttpResponse(res, StatusCodes.OK);
    },
};
