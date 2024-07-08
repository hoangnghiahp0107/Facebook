import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
import { Op } from "sequelize"; 
import jwt from "jsonwebtoken";


const model = initModels(sequelize);

const seeStory = async(req, res) =>{
    try {
        const TruyXuatID = req.params.NguoiDungID; 
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }
        
        const isFriend = await model.BanBe.findAll({
            where: {
               MaNguoiDung1: TruyXuatID,
               TrangThai: "DaKetBan"
            },
        });

        if (!isFriend) {
            return res.status(403).send("Bạn không có quyền xem bài viết này");
        }

        const data = await model.Story.findAll({
            where: {
                CheDoRiengTuID: {
                    [Op.in]: [1, 2]
                }
            },
            include:"NguoiDung"
        });

        res.status(200).send(data);

    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
} 

const getStoryFriend = async (req, res) => {
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

        const data = await model.Story.findAll({
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

export { seeStory, getStoryFriend }