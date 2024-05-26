import express from "express";
import { getPostAll, getPostForMe, getPostFriend, getPostPrivate, getPostPublic } from "../Controllers/postControllers.js";
import { checkToken } from "../Config/jwtConfig.js";

const postRoutes = express.Router();
postRoutes.get("/get-posts-public/:NguoiDungID", getPostPublic);
postRoutes.get('/get-posts-friend/:NguoiDungID', checkToken, getPostFriend);
postRoutes.get("/get-posts-private/:NguoiDungID", getPostPrivate);
postRoutes.get("/get-posts-for-me/:NguoiDungID", getPostForMe);
postRoutes.get("/get-posts-all",getPostAll);

export default postRoutes
