import express from "express";
import { accessPostStatus, deletePost, denyPostStatus, getPostAll, getPostForMe, getPostFriend, getPostPrivate, getPostPublic, getPostsNew, seePost } from "../Controllers/postControllers.js";
import { checkToken } from "../Config/jwtConfig.js";
import sequelize from "../Models/index.js";
import multer from "multer";
import initModels from "../Models/init-models.js";
import jwt from "jsonwebtoken";

const model = initModels(sequelize);

const postRoutes = express.Router();
postRoutes.get("/get-posts-public/:NguoiDungID", getPostPublic);
postRoutes.get('/get-posts-friend/:NguoiDungID', checkToken, getPostFriend); 
postRoutes.get("/get-posts-private/:NguoiDungID", getPostPrivate);
postRoutes.get("/get-posts-for-me/:NguoiDungID", getPostForMe);
postRoutes.get("/get-posts-all", checkToken,getPostAll);
postRoutes.put("/update-post-access/:MaBV", checkToken, accessPostStatus);
postRoutes.put("/update-post-deny/:MaBV", checkToken, denyPostStatus);
postRoutes.get("/get-posts-new", checkToken, getPostsNew);
postRoutes.get("/see-posts/:NguoiDungID", checkToken, seePost);
postRoutes.delete("/delete-posts/:MaBV", checkToken, deletePost);

const storage = multer.diskStorage({
    destination: process.cwd() + "/public/img",
    filename: (req, file, callback) => {
        let date = new Date();
        let newName = date.getTime();
        callback(null, newName + "_" + file.originalname);
    }
});

const upload = multer({ storage });

postRoutes.post('/create-posts', upload.single('HinhAnh'), checkToken, async(req, res) =>{
    try {
        
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        const NguoiDungID = decodedToken.data.MaNguoiDung;
        
        let { NoiDung, CheDoRiengTuID, HinhAnh } = req.body;
        HinhAnh = req.file ? req.file.filename : "";
        let newData = {
            NguoiDungID,
            NoiDung,
            HinhAnh,
            CheDoRiengTuID
        }
        await model.BaiViet.create(newData);
        res.status(200).send("Thêm bài viết thành công");
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
});

postRoutes.put('/update-posts/:MaBV', upload.single('HinhAnh'), checkToken, async(req, res) => {
    try {
        const MaBV = req.params.MaBV;
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }
        
        const { NoiDung, CheDoRiengTuID } = req.body;
        const HinhAnh = req.file ? req.file.filename : null; // Set HinhAnh to null if not provided

        const updateData = {
            ...(NoiDung && { NoiDung }),
            ...(CheDoRiengTuID && { CheDoRiengTuID }),
            HinhAnh 
        };

        await model.BaiViet.update(updateData,{
            where:{
                MaBV: MaBV
            }
        });

        res.status(200).send("Cập nhật bài viết thành công!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Đã có lỗi trong quá trình xử lý");
    }
})

export default postRoutes
