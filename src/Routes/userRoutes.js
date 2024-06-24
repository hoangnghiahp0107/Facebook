import express from 'express';
import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
import bcrypt from "bcrypt";
import {signUp, login, updateUserIF, deleteUser, getUserID, logout, countUser, countUserWeek, countUserMonth, getNewUser, growWeek,  growMonth, getUser, getUserAll} from "../Controllers/userController.js"
import { checkToken } from '../Config/jwtConfig.js';
import multer from "multer";

const model = initModels(sequelize);

const userRoutes = express.Router();

userRoutes.post("/sign-up", signUp);
userRoutes.post("/login", login);
userRoutes.get("/get-users", checkToken, getUser);
userRoutes.put('/update-user-if/:MaNguoiDung', checkToken, updateUserIF);
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
userRoutes.get("/get-users-all", checkToken, getUserAll);

const storage = multer.diskStorage({
    destination: process.cwd() + "/public/img",
    filename: (req, file, callback) => {
        let date = new Date();
        let newName = date.getTime();
        callback(null, newName + "_" + file.originalname);
    }
});

const upload = multer({ storage });

userRoutes.post('/create-user', upload.single('AnhDaiDien'), async (req, res) => {
    try {
        let { SDT, Email, MatKhau, NgaySinh, GioiTinh, HoTen, MaVaiTro, Daxoa, NgayDangKy, AnhDaiDien } = req.body;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(MatKhau)) {
            return res.status(400).send("Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái thường, 1 chữ cái hoa và 1 ký tự đặc biệt.");
        }

        let whereCondition = {};
        if (SDT) {
            whereCondition.SDT = SDT;
        }
        if (Email) {
            whereCondition.Email = Email;
        }

        let checkTK = await model.NguoiDung.findOne({
            where: whereCondition,
        });

        if (checkTK) {
            res.status(200).send("Email hoặc số điện thoại đã tồn tại!");
            return;
        }
        
        if (!SDT && !Email) {
            res.status(400).send("Vui lòng cung cấp ít nhất một trong hai thông tin: Email hoặc Số điện thoại");
            return;
        }

        Email = Email || "0";
        SDT = SDT || "0";
        MaVaiTro = MaVaiTro || 2;
        Daxoa = Daxoa || 0;
        NgayDangKy = NgayDangKy || new Date();

        AnhDaiDien = req.file ? req.file.filename : "noimg.png";

        let newData = {
            SDT,
            Email,
            MatKhau: bcrypt.hashSync(MatKhau, 10),
            NgaySinh,
            GioiTinh,
            HoTen,
            AnhDaiDien,
            MaVaiTro,
            NgayDangKy
        };
        await model.NguoiDung.create(newData);
        res.status(200).send("Đăng ký tài khoản thành công!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Đã có lỗi trong quá trình xử lý");
    }
});

export default userRoutes;