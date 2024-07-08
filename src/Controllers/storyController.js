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
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        const requestingUserID = decodedToken.data.MaNguoiDung;

        // Lấy danh sách bạn bè của người dùng hiện tại
        const friends = await model.BanBe.findAll({
            where: {
                [Op.or]: [
                    { MaNguoiDung1: requestingUserID, TrangThai: 'DaKetBan' },
                    { MaNguoiDung2: requestingUserID, TrangThai: 'DaKetBan' }
                ]
            }
        });

        // Lấy ID bạn bè
        const friendIDs = friends.map(friend => {
            return friend.MaNguoiDung1 === requestingUserID ? friend.MaNguoiDung2 : friend.MaNguoiDung1;
        });

        // Tính toán thời gian 24 giờ trước
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Lọc ra Story của bạn bè trong 24 giờ gần nhất, không lấy Story của người dùng hiện tại
        const data = await model.Story.findAll({
            where: {
                NguoiDungID: {
                    [Op.in]: friendIDs
                },
                CheDoRiengTuID: {
                    [Op.in]: [1, 2]
                },
                ThoiGian: {
                    [Op.gte]: twentyFourHoursAgo
                }
            },
            include:"NguoiDung"
        });

        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
};



export { seeStory, getStoryFriend }