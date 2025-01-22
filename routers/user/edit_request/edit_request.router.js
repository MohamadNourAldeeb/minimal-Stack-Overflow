import express from "express";
const router = express.Router();
import { schema } from "../../../validations/schema/user/edit_request/edit_request.schema.js";
import { type, validate, execute } from "../../../config/header_routers.js";
import { cache } from "../../../middlewares/cache.js";
import controller from "../../../controllers/user/edit_request/edit_request.controller.js";
import { authentication } from "../../../middlewares/auth.js";
import { publicLimit } from "../../../middlewares/security/limit.js";

router.post(
    "/",
    authentication,
    publicLimit,
    validate(schema.body.createRequest, type.body),
    execute(controller.create)
);

router.put(
    "/:id",
    authentication,
    publicLimit,
    validate(schema.body.editRequestState, type.body),
    validate(schema.params, type.params),
    execute(controller.editRequestState)
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
    "/from-me",
    authentication,
    publicLimit,
    validate(schema.pagination, type.query),
    execute(controller.getRequestsFromMe)
);
router.get(
    "/for-me",
    authentication,
    publicLimit,
    validate(schema.pagination, type.query),
    execute(controller.getRequestsForMe)
);
export default router;
