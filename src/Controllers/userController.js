import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
import bcrypt from "bcrypt";
import {taoToken} from "../Config/jwtConfig.js";
import { Sequelize } from 'sequelize';

const Op = Sequelize.Op;
const model = initModels(sequelize);

const signUp = async (req, res) => {
    try {
        let { SDT, Email, MatKhau, NgaySinh, GioiTinh, HoTen, MaVaiTro, AnhDaiDien } = req.body;
        
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
            res.send("Email hoặc số điện thoại đã tồn tại");
            return;
        }
        
        if (!SDT && !Email) {
            res.status(400).send("Vui lòng cung cấp ít nhất một trong hai thông tin: Email hoặc Số điện thoại");
            return;
        }

        Email = Email || "Dữ liệu không tồn tại";
        SDT = SDT || "Dữ liệu không tồn tại";

        AnhDaiDien = AnhDaiDien || "abc.jpg";
        MaVaiTro = MaVaiTro || 2;
            
        let newData = {
            SDT,
            Email,
            MatKhau: bcrypt.hashSync(MatKhau, 10),
            NgaySinh,
            GioiTinh,
            HoTen,
            AnhDaiDien,
            MaVaiTro
        };
        
        await model.NguoiDung.create(newData);
        res.send("Đăng ký tài khoản thành công");
    } catch (error) {
        console.log(error);
        res.status(500).send("Đã có lỗi trong quá trình xử lý");
    }
};

const login = async (req, res) => {
    try {
        let { Email, SDT, MatKhau } = req.body;

        if (!Email && !SDT) {
            res.status(400).send("Vui lòng cung cấp email hoặc số điện thoại");
            return;
        }

        let checkTK = await model.NguoiDung.findOne({
            where: {
                [Op.or]: [
                    Email ? { Email } : {}, 
                    SDT ? { SDT } : {}
                ]
            },
        });

        if (checkTK) {
            let checkPass = bcrypt.compareSync(MatKhau, checkTK.MatKhau);
            if (checkPass) {
                let token = taoToken(checkTK);
                res.status(200).send(token);
            } else {
                res.status(400).send("Mật khẩu không đúng");
            }
        } else {
            res.status(400).send("Tài khoản không đúng");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Đã có lỗi trong quá trình xử lý");
    }
};


export {signUp, login}