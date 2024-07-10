import multer from "multer";
import express from "express";
import { checkToken } from "../Config/jwtConfig.js";
import initModels from "../Models/init-models.js";
import jwt from "jsonwebtoken";
import sequelize from "../Models/index.js";
import { getStoryForMy, getStoryFriend, seeStory } from "../Controllers/storyController.js";

const model = initModels(sequelize);

const storyRoutes = express.Router();

storyRoutes.get("/see-story/:NguoiDungID", checkToken, seeStory);
storyRoutes.get("/get-story-friend/:NguoiDungID", checkToken, getStoryFriend);
storyRoutes.get("/get-story-for-me/:NguoiDungID", checkToken, getStoryForMy);

const storage = multer.diskStorage({
    destination: process.cwd() + "/public/img",
    filename: (req, file, callback) => {
        let date = new Date();
        let newName = date.getTime();
        callback(null, newName + "_" + file.originalname);
    }
});

const upload = multer({ storage });
storyRoutes.post('/create-story', upload.single('HinhAnh'), checkToken, async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        const NguoiDungID = decodedToken.data.MaNguoiDung;

        // Kiểm tra story gần nhất của người dùng
        const lastStory = await model.Story.findOne({
            where: { NguoiDungID },
            order: [['ThoiGian', 'DESC']]
        });

        if (lastStory) {
            const currentTime = new Date();
            const lastStoryTime = new Date(lastStory.ThoiGian);
            const timeDifference = currentTime - lastStoryTime;
            const hoursDifference = timeDifference / (1000 * 60 * 60);

            if (hoursDifference < 24) {
                return res.status(400).send("Bạn chỉ có thể thêm 1 story trong vòng 24 giờ");
            }
        }

        let { CheDoRiengTuID, HinhAnh } = req.body;
        HinhAnh = req.file ? req.file.filename : "";
        let newData = {
            NguoiDungID,
            HinhAnh,
            CheDoRiengTuID,
            ThoiGian: new Date()  // Thêm trường ThoiGian với thời gian hiện tại
        }
        await model.Story.create(newData);
        res.status(200).send("Thêm story thành công");
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
});

export default storyRoutes