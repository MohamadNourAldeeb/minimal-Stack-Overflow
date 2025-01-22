import express from "express";
const router = express.Router();
import { StatusCodes } from "http-status-codes";
import AuthRoute from "./auth/auth.router.js";
import userRoute from "./user/index.js";
import publicRoute from "./public.js";
import errorsRouters from "./error/errors.router.js";
import { logMaliciousUser } from "../utils/helper.js";

router.use("/auth", AuthRoute);
router.use("/user", userRoute);
router.use("/errors", errorsRouters);
router.use("", publicRoute);

router.use("*", (req, res) => {
    let moreData = {
        visitedPath: req.originalUrl,
        method: req.method,
        bodySize: JSON.stringify(req.body).length,
        querySize: JSON.stringify(req.query).length,
        Body: req.body,
        Query: req.query,
        Params: req.params,
        path: req.path,
    };
    logMaliciousUser(req, "wrong path", moreData);

    res.status(StatusCodes.NOT_FOUND).send({
        success: false,
        msg: "Error 404: Not found API",
        error_number: null,
    });
});

export default router;
