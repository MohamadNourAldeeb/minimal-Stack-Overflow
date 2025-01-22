import express from "express";
const router = express.Router();
import { schema } from "../../../validations/schema/user/vote/vote.schema.js";
import { type, validate, execute } from "../../../config/header_routers.js";
import controller from "../../../controllers/user/vote/vote.controller.js";
import { authentication } from "../../../middlewares/auth.js";
import { publicLimit } from "../../../middlewares/security/limit.js";

router.post(
    "/",
    authentication,
    publicLimit,
    validate(schema.body.createVote, type.body),
    execute(controller.create)
);

router.delete(
    "/:id",
    authentication,
    publicLimit,
    validate(schema.params, type.params),
    validate(schema.empty, type.query),
    execute(controller.delete)
);

export default router;
