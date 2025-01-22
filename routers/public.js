import express from "express";
const router = express.Router();
import controller from "../controllers/public/public.controller.js";
import { schema } from "../validations/schema/public.schema.js";
import { type, validate, execute } from "../config/header_routers.js";
import { publicLimit } from "../middlewares/security/limit.js";

router.get(
    "/home",
    publicLimit,
    validate(schema.paginationWithQuery, type.query),
    execute(controller.home)
);

router.get(
    "/:id",
    publicLimit,
    validate(schema.params, type.params),
    execute(controller.getQuestionDetail)
);
export default router;
