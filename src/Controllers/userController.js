import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
import bcrypt from "bcrypt";
import {taoToken} from "../Config/jwtConfig.js";
import { Sequelize } from 'sequelize';
import jwt from "jsonwebtoken";

const Op = Sequelize.Op;
const model = initModels(sequelize);

const signUp = async (req, res) => {
    try {
        let { SDT, Email, MatKhau, NgaySinh, GioiTinh, HoTen, MaVaiTro, AnhDaiDien, Daxoa, NgayDangKy } = req.body;
        
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

        AnhDaiDien = AnhDaiDien || "noimg.png";
        MaVaiTro = MaVaiTro || 2;
        Daxoa = Daxoa || 0;
        NgayDangKy = NgayDangKy || new Date();
        console.log(NgayDangKy)

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
        res.send("Đăng ký tài khoản thành công!");
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

const updateUser = async(req, res) =>{
    try {
        let { MaNguoiDung } = req.params;
        let { SDT, Email, MatKhau, NgaySinh, GioiTinh, HoTen, AnhDaiDien } = req.body;
        const hashedPassword = bcrypt.hashSync(MatKhau, 10);
        await model.NguoiDung.update(
            {SDT, Email, MatKhau:hashedPassword, NgaySinh,GioiTinh,HoTen,AnhDaiDien},
            {
                where:{
                    MaNguoiDung
                }
            }
        );
        res.status(200).send("Cập nhật thành công!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Đã có lỗi trong quá trình xử lý!");
    }
} 

const deleteUser = async (req, res) => {
    try {
        let { MaNguoiDung } = req.params;
        await model.NguoiDung.update(
            { Daxoa: 1 },
            {
                where: {
                    MaNguoiDung
                }
            }
        );
        res.status(200).send("Xóa người dùng thành công!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Đã có lỗi trong quá trình xử lý!");
    }
};

const getUserID = async (req, res) => {
    try {
        const { MaNguoiDung } = req.params;
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }
        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        const currentUserID = decodedToken.data.MaNguoiDung;

        if (Number(MaNguoiDung) !== currentUserID) {
            return res.status(403).send("Không có quyền truy cập thông tin người dùng này");
        }

        const data = await model.NguoiDung.findOne({
            where: {
                MaNguoiDung: MaNguoiDung
            }
        });

        if (!data) {
            return res.status(404).send("Không tìm thấy người dùng");
        }

        res.send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Lỗi xác thực token");
    }
}

const logout = async (req, res) => {
    try {
      const token = req.headers.authorization || req.body.token;
  
      if (!token) {
        return res.status(401).send("Token không hợp lệ");
      }
  
      blacklistedTokens.push(token);
  
      res.status(200).send("Đã đăng xuất thành công");
    } catch (error) {
      res.status(500).send("Đã có lỗi trong quá trình xử lý");
    }
  };

export {signUp, login, updateUser, deleteUser, getUserID, logout}