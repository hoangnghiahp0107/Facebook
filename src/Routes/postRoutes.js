import express from "express";
import { getPost } from "../Controllers/postControllers.js";

const postRoutes = express.Router();

postRoutes.get("/get-posts", getPost);

export default postRoutes
