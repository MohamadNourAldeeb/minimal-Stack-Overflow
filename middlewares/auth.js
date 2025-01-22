import dotenv from "dotenv";

dotenv.config({ path: `../.env` });
import { StatusCodes } from "http-status-codes";

import { verifyToken } from "../utils/jwt.js";
import CustomError from "../utils/custom_error.js";
import { STATUS_CODES } from "http";
import { getFromRedisCache } from "../utils/redis_cache.js";
import UserRefreshTokens from "../models/user_refresh_tokens.model.js";

export const authentication = async (req, res, next) => {
    try {
        let rawToken = req.headers.authorization || req.headers.Authorization;

        if (!rawToken)
            throw new CustomError(
                "Token not exists, please set token and try again 😊",
                401
            );
        if (rawToken.startsWith("Bearer "))
            rawToken = rawToken.replace("Bearer ", "").trim();

        let decoded = verifyToken(rawToken, process.env.TOKEN_SECRET_KEY);

        if (!decoded) throw new CustomError("🤨 bad token", 403);
        const isLogOut = await UserRefreshTokens.findOne({
            raw: true,
            attributes: ["id"],
            where: { user_id: decoded.id, device: decoded.device },
        });
        if (!isLogOut) throw new CustomError("🤨You have logged out", 401);

        const validToken = await getFromRedisCache(`${isLogOut.id}`);

        if (rawToken != validToken)
            throw new Error(
                "Your token is old or forbidden please login agin ",
                401
            );

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            data: {
                message: err.message,
                error_number: null,
            },
        });
    }
};
