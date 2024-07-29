import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
import {  Op } from "sequelize"; 
import jwt from "jsonwebtoken";

const model = initModels(sequelize);

const createNewPostComment = async (req,res) =>{
try{
    const token = req.headers.token;
    if (!token) {
        return res.status(401).send("Người dùng không được xác thực");
    }
    const decodedToken = jwt.verify(token, 'HOANGNGHIA');
    const NguoiDungID = decodedToken.data.MaNguoiDung;
    

    const {BaiVietID,NoiDung} = req.body;
    let newComment ={
        BaiVietID,
        NguoiDungID,
        NoiDung
    };

    await model.BinhLuan.create(newComment);
    res.status(200).send("Gửi Binh Luan Thành công!");
}
catch(error){
    res.status(500).json({ error: error.toString() });
}
};
const deleteComment = async (req, res) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }


        const { BinhLuanID } = req.body;

        const comment = await model.BinhLuan.findOne({ where: { MaBL: BinhLuanID } });

        if (!comment) {
            return res.status(404).json({ error: "Bình luận không tồn tại hoặc bạn không có quyền xóa bình luận này" });
        }

        await comment.destroy();
        res.status(200).send("Xóa Bình Luận Thành công!");
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const editComment = async (req, res) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }
    
        const { BinhLuanID, NoiDung } = req.body;

        const comment = await model.BinhLuan.findOne({ where: { MaBL: BinhLuanID } });

        if (!comment) {
            return res.status(404).json({ error: "Bình luận không tồn tại hoặc bạn không có quyền chỉnh sửa bình luận này" });
        }

        comment.NoiDung = NoiDung;
        await comment.save();
        res.status(200).send("Chỉnh sửa Bình Luận Thành công!");
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllCommentsForPost = async (req, res) => {
    try {
        const { BaiVietID } = req.params;

        const comments = await model.BinhLuan.findAll({
            where: { BaiVietID },
            include: [
                {
                    model: model.NguoiDung,
                    as: 'NguoiDung',
                    attributes: ['HoTen', 'AnhDaiDien'],
                    required: false
                }
            ]
        });

        if (!comments || comments.length === 0) {
            return res.status(404).json({ error: "Không có bình luận nào cho bài viết này" });
        }

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};


export { createNewPostComment, deleteComment, editComment, getAllCommentsForPost };