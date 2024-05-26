import express from 'express';
import {signUp, login} from "../Controllers/userController.js"

const userRoutes = express.Router();

userRoutes.post("/sign-up", signUp);
userRoutes.post("/login", login);

export default userRoutes;