import express from "express";
import { getMessages, getReceiver, sendMessage } from "../Controllers/chatController.js";
import { checkToken } from "../Config/jwtConfig.js";

const chatRoutes = express.Router();

chatRoutes.get("/get-messages/:senderId/:receiverId", checkToken, getMessages);

chatRoutes.get("/get-receiver/:senderId",checkToken, getReceiver);

chatRoutes.post("/post-messages/:NguoiGui/:NguoiNhan",checkToken, sendMessage)

export default chatRoutes;
