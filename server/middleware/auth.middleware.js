// import  ApiError  from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
// import User from "../models/User.js";
import ApiError from "../utils/apiErorr.js";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {

    // 1. Extract Bearer token from Authorization header (case-insensitive)
    const authHeader =
        req.header("Authorization") ||
        req.header("authorization") ||
        req.headers?.authorization;

    let token = null;

    if (authHeader) {
        if (authHeader.startsWith("Bearer ") || authHeader.startsWith("bearer ")) {
            token = authHeader.substring(7).trim();
        } else {
            token = authHeader.trim();
        }
    }

    // 2. Fallback to cookies if header is absent
    if (!token) {
        token = req.cookies?.accessToken || req.cookies?.token;
    }

    if (!token) {
        throw new ApiError(401, "Access token required");
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User
            .findById(decoded?._id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");
        }

        throw new ApiError(401, "Invalid access token");
    }

});