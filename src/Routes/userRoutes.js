import express from 'express';
import {signUp, login, updateUser, deleteUser, getUserID, logout, countUser, countUserWeek, countUserMonth, getNewUser, growWeek, growMonth} from "../Controllers/userController.js"
import { checkToken } from '../Config/jwtConfig.js';

const userRoutes = express.Router();

userRoutes.post("/sign-up", signUp);
userRoutes.post("/login", login);
userRoutes.put('/update-user/:MaNguoiDung', updateUser);
userRoutes.put("/delete-user/:MaNguoiDung", deleteUser);
userRoutes.get("/get-user-id/:MaNguoiDung", checkToken, getUserID);
userRoutes.get("/count-users", checkToken, countUser);
userRoutes.get("/count-users-week", checkToken, countUserWeek);
userRoutes.get("/count-users-month", checkToken, countUserMonth);
userRoutes.get("/count-users-month", checkToken, countUserMonth);
userRoutes.get("/grow-week", checkToken, growWeek)
userRoutes.get("/grow-month", checkToken, growMonth)
userRoutes.get("/get-new-users", checkToken, getNewUser)
userRoutes.post("/logout", logout);

export default userRoutes;