import express from 'express';
import {signUp, login, updateUser, deleteUser} from "../Controllers/userController.js"

const userRoutes = express.Router();

userRoutes.post("/sign-up", signUp);
userRoutes.post("/login", login);
userRoutes.put('/update-user/:MaNguoiDung', updateUser)
userRoutes.put("/delete-user/:MaNguoiDung", deleteUser)

export default userRoutes;