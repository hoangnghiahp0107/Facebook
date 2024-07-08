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

const getPostAll = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 1) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

        const data = await model.BaiViet.findAll({
            attributes: ['MaBV', 'NguoiDungID', 'HinhAnh', 'NoiDung', 'ThoiGian', 'TrangThaiKiemDuyet'],
            include: [
                {
                    model: model.NguoiDung,
                    attributes: ['Email', 'SDT'],
                    as: 'NguoiDung'
                },
                {
                    model: model.CheDoRiengTu,
                    attributes: ['TenCheDo'],
                    as: 'CheDoRiengTu'
                }
            ]
        });

        // Định nghĩa mapping giá trị ENUM sang trạng thái tương ứng
        const trangThaiMapping = {
            ChoKiemDuyet: "Chờ duyệt",
            DaKiemDuyet: "Đã duyệt",
            BiTuChoi: "Bị từ chối"
        };

        const responseData = data.map(post => ({
            MaBV: post.MaBV,
            NguoiDung: post.NguoiDung.Email || post.NguoiDung.SDT,
            HinhAnh: post.HinhAnh,
            NoiDung: post.NoiDung,
            ThoiGian: post.ThoiGian,
            CheDoRiengTu: post.CheDoRiengTu.TenCheDo,
            TrangThaiKiemDuyet: trangThaiMapping[post.TrangThaiKiemDuyet] // Sử dụng mapping để lấy trạng thái
        }));

        res.send(responseData);
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
};

const accessPostStatus = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 1) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

        const { MaBV } = req.params;

        const post = await model.BaiViet.findOne({ where: { MaBV } });

        if (!post) {
            return res.status(404).send("Không tìm thấy bài viết để cập nhật");
        }

        if (post.TrangThaiKiemDuyet !== 'ChoKiemDuyet') {
            return res.status(400).send("Bài viết đã được kiểm duyệt hoặc trạng thái không hợp lệ");
        }

        const updatedPost = await model.BaiViet.update(
            { TrangThaiKiemDuyet: 'DaKiemDuyet' },
            { where: { MaBV } }
        );

        if (!updatedPost) {
            return res.status(500).send("Lỗi khi cập nhật trạng thái bài viết");
        }

        const newKiemDuyet = {
            BaiVietID: post.MaBV,
            NguoiDuyet: decodedToken.data.MaNguoiDung, 
            TrangThaiKiemDuyet: 'DaKiemDuyet'
        };

        const createdKiemDuyet = await model.KiemDuyet.create(newKiemDuyet);

        if (createdKiemDuyet) {
            res.status(200).send("Cập nhật trạng thái và thêm vào bảng kiểm duyệt thành công");
        } else {
            res.status(500).send("Lỗi khi thêm vào bảng kiểm duyệt");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi cập nhật trạng thái bài viết hoặc thêm vào bảng kiểm duyệt");
    }
};

const denyPostStatus = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 1) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

        const { MaBV } = req.params;

        const post = await model.BaiViet.findOne({ where: { MaBV } });

        if (!post) {
            return res.status(404).send("Không tìm thấy bài viết để cập nhật");
        }

        if (post.TrangThaiKiemDuyet !== 'ChoKiemDuyet') {
            return res.status(400).send("Bài viết đã được kiểm duyệt hoặc trạng thái không hợp lệ");
        }

        const updatedPost = await model.BaiViet.update(
            { TrangThaiKiemDuyet: 'BiTuChoi' },
            { where: { MaBV } }
        );

        if (!updatedPost) {
            return res.status(500).send("Lỗi khi cập nhật trạng thái bài viết");
        }

        const newKiemDuyet = {
            BaiVietID: post.MaBV,
            NguoiDuyet: decodedToken.data.MaNguoiDung, 
            TrangThaiKiemDuyet: 'BiTuChoi'
        };

        const createdKiemDuyet = await model.KiemDuyet.create(newKiemDuyet);

        if (createdKiemDuyet) {
            res.status(200).send("Cập nhật trạng thái và thêm vào bảng kiểm duyệt thất bại");
        } else {
            res.status(500).send("Lỗi khi thêm vào bảng kiểm duyệt");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi cập nhật trạng thái bài viết hoặc thêm vào bảng kiểm duyệt");
    }
};

const getPostsNew = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');

        if (decodedToken.data.MaVaiTro !== 3) {
            return res.status(403).send("Không có quyền truy cập chức năng này");
        }

        const kiemduyets = await model.KiemDuyet.findAll({
            order: [['ThoiGianKiemDuyet', 'DESC']],
            limit: 4,
            include:["NguoiDuyet_NguoiDung"]});

        res.send(kiemduyets);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Lỗi xác thực token");
    }
}

const seePost = async(req, res) =>{
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
            }
        });

        if (!isFriend) {
            return res.status(403).send("Bạn không có quyền xem bài viết này");
        }

        const data = await model.BaiViet.findAll({
            where: {
                CheDoRiengTuID: {
                    [Op.in]: [1, 2, 3]
                },
                TrangThaiKiemDuyet: "DaKiemDuyet"
            },
            include:"NguoiDung"
        });

        res.status(200).send(data);

    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
} 

const deletePost= async(req,res) =>{
    try {
        let {MaBV} = req.params;
        await model.KiemDuyet.destroy({
            where:{
                BaiVietID: MaBV
            }
        })
        await model.BaiViet.destroy({
            where:{
                MaBV: MaBV
            }
        });

        res.status(200).send("Xóa bài viết thành công!");
    } catch(error) {
        console.log(error);
        res.status(500).send("Đã có lỗi trong quá trình xử lý!")
    }
};

export { getPostPublic, getPostFriend, getPostPrivate, getPostForMe, getPostAll, accessPostStatus, denyPostStatus, getPostsNew, seePost, deletePost};
