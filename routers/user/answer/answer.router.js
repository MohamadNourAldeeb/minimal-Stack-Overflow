import express from "express";
const router = express.Router();
import { schema } from "../../../validations/schema/user/answer/answer.schema.js";
import { type, validate, execute } from "../../../config/header_routers.js";
import controller from "../../../controllers/user/answer/answer.controllers.js";
import { authentication } from "../../../middlewares/auth.js";
import { publicLimit } from "../../../middlewares/security/limit.js";

router.post(
    "/",
    authentication,
    publicLimit,
    validate(schema.body.createAnswer, type.body),
    execute(controller.create)
);

router.put(
    "/:id",
    authentication,
    publicLimit,
    validate(schema.body.updateAnswer, type.body),
    validate(schema.params, type.params),
    execute(controller.update)
);

router.delete(
    "/:id",
    authentication,
    publicLimit,
    validate(schema.params, type.params),
    validate(schema.empty, type.query),
    execute(controller.delete)
);

router.get(
    "/",
    authentication,
    publicLimit,
    validate(schema.pagination, type.query),
    execute(controller.getAll)
);
export default router;
