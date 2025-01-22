import express from "express";
const router = express.Router();
import control from "../../controllers/error/errors.controller.js";
import { schema } from "../../validations/schema/error/errors.schema.js";
import {
    type,
    validate,
    execute,
    authentication,
} from "../../config/header_routers.js";
// import { GlobalAccessTest } from "../../middlewares/global_access.js";

router.post(
    "",
    authentication,
    // GlobalAccessTest,
    validate(schema.body, type.body),
    validate(schema.empty, type.query),
    execute(control.addNewError)
);

export default router;
