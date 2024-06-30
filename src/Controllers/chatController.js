import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
import { Op } from "sequelize"; 
const model = initModels(sequelize);

const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const data = await model.TinNhan.findAll({
            where: {
                [Op.or]: [
                    {
                        NguoiGui: senderId,
                        NguoiNhan: receiverId
                    },
                    {
                        NguoiGui: receiverId,
                        NguoiNhan: senderId
                    }
                ]
            },
            order: [
                ['ThoiGian', 'ASC']
            ]
        });

        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu tin nhắn");
    }
};

const getReceiver = async (req, res) => {
    try {
        const { senderId } = req.params;

        // Lấy danh sách tin nhắn đã gửi và đã nhận
        const sentMessages = await model.TinNhan.findAll({
            where: {
                NguoiGui: senderId,
            },
            attributes: ['NguoiNhan'],
            include: [{
                model: model.NguoiDung,
                as: 'NguoiNhan_NguoiDung', // Thông tin của người nhận
                attributes: ['HoTen', 'AnhDaiDien']
            }],
            order: [['ThoiGian', 'ASC']]
        });

        const receivedMessages = await model.TinNhan.findAll({
            where: {
                NguoiNhan: senderId,
            },
            attributes: ['NguoiGui'],
            include: [{
                model: model.NguoiDung,
                as: 'NguoiGui_NguoiDung', // Thông tin của người gửi
                attributes: ['HoTen', 'AnhDaiDien']
            }],
            order: [['ThoiGian', 'ASC']]
        });

        // Sử dụng đối tượng để theo dõi người dùng đã xuất hiện
        const uniqueUsers = {};

        // Tạo mảng kết quả
        const combinedData = [];

        // Thêm tin nhắn đã gửi vào kết quả
        sentMessages.forEach(item => {
            const userId = item.NguoiNhan;
            if (!uniqueUsers[userId]) {
                uniqueUsers[userId] = true;
                combinedData.push({
                    NguoiNhan: userId,
                    HoTen: item.NguoiNhan_NguoiDung.HoTen,
                    AnhDaiDien: item.NguoiNhan_NguoiDung.AnhDaiDien,
                    LoaiNguoi: 'NguoiNhan' // Đây là người nhận tin nhắn đã gửi
                });
            }
        });

        // Thêm tin nhắn đã nhận vào kết quả
        receivedMessages.forEach(item => {
            const userId = item.NguoiGui;
            if (!uniqueUsers[userId]) {
                uniqueUsers[userId] = true;
                combinedData.push({
                    NguoiNhan: userId,
                    HoTen: item.NguoiGui_NguoiDung.HoTen,
                    AnhDaiDien: item.NguoiGui_NguoiDung.AnhDaiDien,
                    LoaiNguoi: 'NguoiGui' // Đây là người gửi tin nhắn đã nhận
                });
            }
        });

        res.json(combinedData);

    } catch (error) {
        console.log(error);
        res.status(500).send("Không thể lấy thông tin người gửi");
    }
}   

const sendMessage = async (req, res) => {
    try {
        const {NguoiGui,NguoiNhan}=req.params;
        let {NoiDung} = req.body;

        let newData = {
          NguoiGui,
          NguoiNhan,
          NoiDung,
        };
        
        await model.TinNhan.create(newData);
        res.status(200).send("Gửi tin Thành công!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Gửi tin nhắn thất bại");
    }
};

export { getMessages,getReceiver, sendMessage };