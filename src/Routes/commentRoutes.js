import express from "express";
import {
    createNewPostComment,
    deleteComment,
    editComment,
    getAllCommentsForPost
} from "../Controllers/commentController.js";
import { checkToken } from "../Config/jwtConfig.js";

const commentRoutes = express.Router();

commentRoutes.post("/create-comment", checkToken, createNewPostComment);
commentRoutes.delete("/delete-comment", checkToken, deleteComment);
commentRoutes.put("/edit-comment", checkToken, editComment);
commentRoutes.get("/comments/:BaiVietID", getAllCommentsForPost);

export default commentRoutes;
