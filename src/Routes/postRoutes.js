import express from "express";
import { accessPostStatus, denyPostStatus, getPostAll, getPostForMe, getPostFriend, getPostPrivate, getPostPublic, getPostsNew } from "../Controllers/postControllers.js";
import { checkToken } from "../Config/jwtConfig.js";

const postRoutes = express.Router();
postRoutes.get("/get-posts-public/:NguoiDungID", getPostPublic);
postRoutes.get('/get-posts-friend/:NguoiDungID', checkToken, getPostFriend); 
postRoutes.get("/get-posts-private/:NguoiDungID", getPostPrivate);
postRoutes.get("/get-posts-for-me/:NguoiDungID", getPostForMe);
postRoutes.get("/get-posts-all", checkToken,getPostAll);
postRoutes.put("/update-post-access/:MaBV", checkToken, accessPostStatus);
postRoutes.put("/update-post-deny/:MaBV", checkToken, denyPostStatus);
postRoutes.get("/get-posts-new", checkToken, getPostsNew)

export default postRoutes
