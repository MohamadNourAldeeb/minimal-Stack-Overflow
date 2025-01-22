import express from "express";
let router = express.Router();

import QuestionRouters from "./question/question.router.js";
import AnswerRouters from "./answer/answer.router.js";
import EditRequestRouters from "./edit_request/edit_request.router.js";
import VoteRouters from "./vote/vote.router.js";
import ProfileRouters from "./profile/profile.router.js";

router.use("/question", QuestionRouters);
router.use("/answer", AnswerRouters);
router.use("/edit-request", EditRequestRouters);
router.use("/vote", VoteRouters);
router.use("/profile", ProfileRouters);

export default router;
