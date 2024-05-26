import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
import { Op } from "sequelize"; 
import jwt from "jsonwebtoken";


const model = initModels(sequelize);

const getPostPublic = async(req, res) => {
    try {
        const { NguoiDungID } = req.params;
        const data = await model.BaiViet.findAll({
            where: {
                CheDoRiengTuID: 1,
                NguoiDungID: NguoiDungID
            }
        });
        res.send(data);
    } catch(error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
}

const getPostFriend = async (req, res) => {
    try {
        const TruyXuatID = req.params.NguoiDungID; 
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }
        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        const currentUserID = decodedToken.data.MaNguoiDung;
        const isFriend = await model.BanBe.findOne({
            where: {
                [Op.or]: [
                    {
                        MaNguoiDung1: currentUserID,
                        MaNguoiDung2: TruyXuatID,
                        TrangThai: 'DaKetBan'
                    },
                    {
                        MaNguoiDung1: TruyXuatID,
                        MaNguoiDung2: currentUserID,
                        TrangThai: 'DaKetBan'
                    }
                ]
            }
        });

        if (!isFriend) {
            return res.status(403).send("Bạn không có quyền xem bài viết này");
        }

        const data = await model.BaiViet.findAll({
            where: {
                CheDoRiengTuID: {
                    [Op.in]: [1, 2]
                },
                NguoiDungID: TruyXuatID
            },
        });

        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
};

const getPostPrivate = async(req, res) =>{
    try {
        const data = await model.BaiViet.findAll({
            where:{
                CheDoRiengTuID: 3
            }
        })
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
}

const getPostForMe = async(req, res) =>{
    try {
        const { NguoiDungID } = req.params;
        const data = await model.BaiViet.findAll({
            where:{
                NguoiDungID: NguoiDungID
            },
        });
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
}

const getPostAll = async(req,res) =>{
    try {
        const data = await model.BaiViet.findAll();
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
}

export { getPostPublic, getPostFriend, getPostPrivate, getPostForMe, getPostAll };
