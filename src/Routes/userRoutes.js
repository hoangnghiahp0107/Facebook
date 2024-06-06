import express from 'express';
import {signUp, login, updateUser, deleteUser, getUserID, logout} from "../Controllers/userController.js"
import { checkToken } from '../Config/jwtConfig.js';

const userRoutes = express.Router();

userRoutes.post("/sign-up", signUp);
userRoutes.post("/login", login);
userRoutes.put('/update-user/:MaNguoiDung', updateUser)
userRoutes.put("/delete-user/:MaNguoiDung", deleteUser)
userRoutes.get("/get-user-id/:MaNguoiDung", checkToken, getUserID)
userRoutes.post("/logout", logout);

export default userRoutes;