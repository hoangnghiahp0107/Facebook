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
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(MatKhau)) {
            res.status(400).send("Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái thường, 1 chữ cái hoa và 1 ký tự đặc biệt.");
            return;
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

        AnhDaiDien = AnhDaiDien || "noimg.png";
        MaVaiTro = MaVaiTro || 2;
        Daxoa = Daxoa || 0;
        NgayDangKy = NgayDangKy || new Date();

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

const loginAdminHT = async (req, res) => {
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
            if (checkTK.MaVaiTro !== 3) {
                res.status(403).send("Không có quyền truy cập");
                return;
            }

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

const loginAdminQL = async (req, res) => {
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
            if (checkTK.MaVaiTro !== 1) {
                res.status(403).send("Không có quyền truy cập");
                return;
            }

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
        let { SDT, Email, MatKhau, NgaySinh, GioiTinh, HoTen, Daxoa } = req.body;
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }
        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        const currentUserID = decodedToken.data.MaNguoiDung;

        if (Number(MaNguoiDung) !== currentUserID) {
            return res.status(403).send("Không có quyền truy cập thông tin người dùng này");
        }

        await model.NguoiDung.update(
            {SDT, Email, MatKhau, NgaySinh, GioiTinh, HoTen, Daxoa},
            {
                where:{
                    MaNguoiDung
                }
            }
        );
        res.status(200).send("Cập nhật thành công!");
    } catch (error) {
        
    }
}

const updateUserIF = async(req, res) =>{
    try {
        let { MaNguoiDung } = req.params;
        let { SDT, Email, NgaySinh, GioiTinh, HoTen } = req.body;
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }
        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        const currentUserID = decodedToken.data.MaNguoiDung;

        if (Number(MaNguoiDung) !== currentUserID) {
            return res.status(403).send("Không có quyền truy cập thông tin người dùng này");
        }

        await model.NguoiDung.update(
            {SDT, Email, NgaySinh,GioiTinh,HoTen},
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
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        if (decodedToken.data.MaVaiTro !== 1) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

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
        if (Number(MaNguoiDung) !== currentUserID && (decodedToken.data.MaVaiTro !== 1 && decodedToken.data.MaVaiTro !== 3)) {
            return res.status(403).send("Không có quyền truy cập thông tin người dùng này");
        }
            
        const data = await model.NguoiDung.findOne({
            where: {
                MaNguoiDung: MaNguoiDung
            },
            attributes: { exclude: ['MatKhau']} 
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

const countUser = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        if (decodedToken.data.MaVaiTro !== 3) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

        const count = await model.NguoiDung.count();

        res.send({ totalUsers: count });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Lỗi xác thực token");
    }
}

const countUserWeek = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 3) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        const endOfWeek = new Date();
        endOfWeek.setHours(23, 59, 59, 999);
        endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay())); 

        const count = await model.NguoiDung.count({
            where: {
                NgayDangKy: {
                    [Op.between]: [startOfWeek, endOfWeek]
                }
            }
        });

        res.send({ usersCreatedThisWeek: count });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Lỗi xác thực token");
    }
}

const countUserMonth = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 3) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

        // Tính toán khoảng thời gian của tháng hiện tại
        const startOfMonth = new Date();
        startOfMonth.setHours(0, 0, 0, 0);
        startOfMonth.setDate(1); // Bắt đầu từ ngày đầu tiên của tháng

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0); // Đặt ngày thành ngày cuối cùng của tháng
        endOfMonth.setHours(23, 59, 59, 999);

        const count = await model.NguoiDung.count({
            where: {
                NgayDangKy: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        res.send({ usersCreatedThisMonth: count });
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

const getNewUser = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 3) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

        const users = await model.NguoiDung.findAll({
            attributes: ['HoTen','AnhDaiDien', 'NgayDangKy'],
            order: [['NgayDangKy', 'DESC']],
            limit: 4
        });

        res.send(users);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Lỗi xác thực token");
    }
}

const growWeek = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 3) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() - 1 + 6) % 7); // Đặt ngày bắt đầu của tuần là thứ 2
        const endOfWeek = new Date();
        endOfWeek.setHours(23, 59, 59, 999);
        endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay())); 

        // Thêm logic để xác định thời điểm bắt đầu và kết thúc của tuần trước
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        const endOfLastWeek = new Date(endOfWeek);
        endOfLastWeek.setDate(endOfLastWeek.getDate() - 7);

        let countThisWeek = await model.NguoiDung.count({
            where: {
                NgayDangKy: {
                    [Op.between]: [startOfWeek, endOfWeek]
                }
            }
        });

        let countLastWeek = await model.NguoiDung.count({
            where: {
                NgayDangKy: {
                    [Op.between]: [startOfLastWeek, endOfLastWeek]
                }
            }
        });

        if (countThisWeek === 0 || countLastWeek === 0) {
            const growthPercentage = (countThisWeek - countLastWeek) * 100;
            let growthMessage = growthPercentage.toFixed(0) + "%";
            if (growthPercentage > 0) {
                growthMessage = "+ " + growthMessage; 
            } else if (growthPercentage < 0) {
                growthMessage = growthMessage.replace("-", "- ");
            }

            return res.send({ 
                usersCreatedLastWeek: countLastWeek,
                usersCreatedThisWeek: countThisWeek,
                growthPercentage: growthMessage
            });
        }

        const growthPercentage = ((countThisWeek - countLastWeek) / countLastWeek) * 100;

        let growthMessage = growthPercentage.toFixed(0) + "%";
        if (growthPercentage > 0) {
            growthMessage = "+ " + growthMessage; 
        } else if (growthPercentage < 0) {
            growthMessage = growthMessage.replace("-", "- ");
        }

        res.send({ 
            usersCreatedLastWeek: countLastWeek,
            usersCreatedThisWeek: countThisWeek,
            growthPercentageWeek: growthMessage
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Lỗi xác thực token");
    }
}

const growMonth = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 3) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        let countThisMonth = await model.NguoiDung.count({
            where: {
                NgayDangKy: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        let countLastMonth = await model.NguoiDung.count({
            where: {
                NgayDangKy: {
                    [Op.between]: [startOfLastMonth, endOfLastMonth]
                }
            }
        });

        if (countThisMonth === 0 || countLastMonth === 0) {
            const growthPercentage = (countThisMonth - countLastMonth) * 100;
            let growthMessage = growthPercentage.toFixed(0) + "%";
            if (growthPercentage > 0) {
                growthMessage = "+ " + growthMessage; 
            } else if (growthPercentage < 0) {
                growthMessage = growthMessage.replace("-", "- ");
            }

            return res.send({ 
                usersCreatedLastMonth: countLastMonth,
                usersCreatedThisMonth: countThisMonth,
                growthPercentage: growthMessage
            });
        }

        const growthPercentage = ((countThisMonth - countLastMonth) / countLastMonth) * 100;

        let growthMessage = growthPercentage.toFixed(0) + "%";
        if (growthPercentage > 0) {
            growthMessage = "+ " + growthMessage; 
        } else if (growthPercentage < 0) {
            growthMessage = growthMessage.replace("-", "- ");
        }

        res.send({ 
            usersCreatedLastMonth: countLastMonth,
            usersCreatedThisMonth: countThisMonth,
            growthPercentageMonth: growthMessage
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Lỗi xác thực token");
    }
}

const getUser = async(req, res) =>{
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 1) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }
        const data = await model.NguoiDung.findAll({
            where:{
                MaVaiTro: 2
            },
            include:["MaVaiTro_VaiTro"]
        });
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
}

const getUserAll = async(req, res) =>{
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 3) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }
        const data = await model.NguoiDung.findAll({
            include:["MaVaiTro_VaiTro"]
        });
        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
}

const getSearchUser = async (req, res) => {
    const { searchParam } = req.params;
    const data = await model.NguoiDung.findAll({
        where: {
            MaVaiTro: 2,
            [Op.or]: [
                {
                    Email: {
                        [Op.like]: `%${searchParam}%`
                    }
                },
                {
                    Sdt: {
                        [Op.like]: `%${searchParam}%`
                    }
                },
                {
                    HoTen:{
                        [Op.like]: `%${searchParam}%`
                    }
                }
            ]
        },
        include:["MaVaiTro_VaiTro"],
    });
    res.status(200).send(data);
}

export {signUp, login, updateUserIF, deleteUser, getUserID, logout, countUser, countUserWeek, countUserMonth, getNewUser, growWeek, growMonth, getUser, getUserAll, getSearchUser, loginAdminHT, loginAdminQL}