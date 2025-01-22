import express from "express";
const router = express.Router();
import { schema } from "../../../validations/schema/user/profile/profile.schema.js";
import { type, validate, execute } from "../../../config/header_routers.js";
import controller from "../../../controllers/user/profile/profile.controller.js";
import { authentication } from "../../../middlewares/auth.js";
import { publicLimit } from "../../../middlewares/security/limit.js";
import { uploadImage } from "../../../middlewares/upload_image.js";

router.post(
    "/avatar",
    authentication,
    publicLimit,
    uploadImage("avatar", "single"),
    execute(controller.addAvatar)
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
