import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
import jwt from "jsonwebtoken";
const model = initModels(sequelize);

const getNotifications = async (req, res) => {
    try {
        const token = req.headers.token

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token,'HOANGNGHIA');
        const NguoiNhan = decodedToken.data.MaNguoiDung;

        const data = await model.ThongBao.findAll({
            where: {
                NguoiNhan: NguoiNhan
            },
            order: [
                ['ThoiGian', 'ASC']
            ]
        });
        res.send(data);
    } catch (error) {
    
        res.status(404).send("Lỗi khi lấy dữ liệu Thôn báo ");
    }
};

export{getNotifications};
