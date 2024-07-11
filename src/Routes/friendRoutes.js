import express from "express";
import { getFriend , getFriendRequest,getYourRequest,beFriend, getNonFriends,createRelationship,unfriend} from "../Controllers/friendController.js";
import { checkToken } from "../Config/jwtConfig.js";

const friendRoutes = express.Router();

friendRoutes.get("/get-friends", checkToken, getFriend);
friendRoutes.get("/get-requests",checkToken,getFriendRequest);
friendRoutes.get("/get-yourrequests",checkToken,getYourRequest);
friendRoutes.put("/be-friend",checkToken,beFriend);
friendRoutes.get("/get-nonfriends",checkToken,getNonFriends);
friendRoutes.post("/post-relationship",checkToken,createRelationship);
friendRoutes.delete("/unfriend", checkToken, unfriend); 

export default friendRoutes;
