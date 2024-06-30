import express from "express";
import { getNotifications} from "../Controllers/notificationsController.js";
import { checkToken } from "../Config/jwtConfig.js";

const notificationsRoutes = express.Router();

notificationsRoutes.get("/get-notifications",checkToken,getNotifications);

export default notificationsRoutes;