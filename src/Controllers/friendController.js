import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
import { Op } from "sequelize"; 
import jwt from "jsonwebtoken";

const model = initModels(sequelize);

//lấy danh sách bạn bè của bạn
const getFriend = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        const userID = decodedToken.data.MaNguoiDung;

        const friends = await model.BanBe.findAll({
            where: {
                [Op.or]: [
                    { MaNguoiDung1: userID, TrangThai: 'DaKetBan' },
                    { MaNguoiDung2: userID, TrangThai: 'DaKetBan' }
                ]
            },
            include: [
                {
                    model: model.NguoiDung,
                    as: 'MaNguoiDung1_NguoiDung',
                    attributes: [ 'HoTen', 'AnhDaiDien'],
                    required: false
                },
                {
                    model: model.NguoiDung,
                    as: 'MaNguoiDung2_NguoiDung',
                    attributes: [ 'HoTen', 'AnhDaiDien'],
                    required: false
                }
            ]
        });

        const friendDetails = [];
        const seenFriendIDs = new Set();

        friends.forEach(friend => {
            if (friend.MaNguoiDung1 === userID) {
                if (!seenFriendIDs.has(friend.MaNguoiDung2)) {
                    friendDetails.push({
                        BanBeId: friend.MaNguoiDung2,
                        TrangThai: friend.TrangThai,
                        CheDoRiengTuID: friend.CheDoRiengTuID,
                        HoTen: friend.MaNguoiDung2_NguoiDung.HoTen,
                        AnhDaiDien: friend.MaNguoiDung2_NguoiDung.AnhDaiDien
                    });
                    seenFriendIDs.add(friend.MaNguoiDung2);
                }
            } else {
                if (!seenFriendIDs.has(friend.MaNguoiDung1)) {
                    friendDetails.push({
                        BanBeId: friend.MaNguoiDung1,
                        TrangThai: friend.TrangThai,
                        CheDoRiengTuID: friend.CheDoRiengTuID,
                        HoTen: friend.MaNguoiDung1_NguoiDung.HoTen,
                        AnhDaiDien: friend.MaNguoiDung1_NguoiDung.AnhDaiDien
                    });
                    seenFriendIDs.add(friend.MaNguoiDung1);
                }
            }
        });

        res.send(friendDetails);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            res.status(401).send("Token không hợp lệ");
        } else if (error.name === 'TokenExpiredError') {
            res.status(401).send("Token đã hết hạn");
        } else {
            res.status(500).send("Lỗi khi lấy thông tin bạn bè");
        }
    }
};

// Lấy các yêu cầu kết bạn được gửi tới bạn
const getFriendRequest = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        const userID = decodedToken.data.MaNguoiDung;

        const friends = await model.BanBe.findAll({
            where: {
                [Op.or]: [
                    { MaNguoiDung1: userID, TrangThai: 'ChoXacNhan' },
                    { MaNguoiDung2: userID, TrangThai: 'ChoXacNhan' }
                ]
            },
            include: [
                {
                    model: model.NguoiDung,
                    as: 'MaNguoiDung1_NguoiDung',
                    attributes: ['HoTen', 'AnhDaiDien'],
                    required: false
                },
                {
                    model: model.NguoiDung,
                    as: 'MaNguoiDung2_NguoiDung',
                    attributes: ['HoTen', 'AnhDaiDien'],
                    required: false
                }
            ]
        });

        const friendDetails = [];
        const seenFriendIDs = new Set();

        friends.forEach(friend => {
            if (friend.MaNguoiDung2 === userID) {
                if (!seenFriendIDs.has(friend.MaNguoiDung1)) {
                    friendDetails.push({
                        YeuCauCuaId: friend.MaNguoiDung1,
                        TrangThai: friend.TrangThai,
                        CheDoRiengTuID: friend.CheDoRiengTuID,
                        HoTen: friend.MaNguoiDung1_NguoiDung?.HoTen,
                        AnhDaiDien: friend.MaNguoiDung1_NguoiDung?.AnhDaiDien
                    });
                    seenFriendIDs.add(friend.MaNguoiDung1);
                }
            }
        });

        res.send(friendDetails);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            res.status(401).send("Token không hợp lệ");
        } else if (error.name === 'TokenExpiredError') {
            res.status(401).send("Token đã hết hạn");
        } else {
            res.status(500).send("Lỗi khi lấy thông tin bạn bè");
        }
   
    }}

// lấy các yêu cầu kết bạn được bạn gửi đi
const getYourRequest = async (req, res) => {
        try {
            const token = req.headers.token;
    
            if (!token) {
                return res.status(401).send("Người dùng không được xác thực");
            }
    
            const decodedToken = jwt.verify(token, 'HOANGNGHIA');
            const userID = decodedToken.data.MaNguoiDung;
    
            const friends = await model.BanBe.findAll({
                where: {
                    MaNguoiDung1: userID,
                    TrangThai: 'ChoXacNhan'
                },
                include: [
                    {
                        model: model.NguoiDung,
                        as: 'MaNguoiDung2_NguoiDung',
                        attributes: ['HoTen', 'AnhDaiDien'],
                        required: false
                    }
                ]
            });
    
            const friendDetails = [];
            const seenFriendIDs = new Set();
    
            friends.forEach(friend => {
                if (!seenFriendIDs.has(friend.MaNguoiDung2)) {
                    friendDetails.push({
                        YeuCauGuiToiId: friend.MaNguoiDung2,
                        TrangThai: friend.TrangThai,
                        CheDoRiengTuID: friend.CheDoRiengTuID,
                        HoTen: friend.MaNguoiDung2_NguoiDung?.HoTen,
                        AnhDaiDien: friend.MaNguoiDung2_NguoiDung?.AnhDaiDien
                    });
                    seenFriendIDs.add(friend.MaNguoiDung2);
                }
            });
    
            res.send(friendDetails);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                res.status(401).send("Token không hợp lệ");
            } else if (error.name === 'TokenExpiredError') {
                res.status(401).send("Token đã hết hạn");
            } else {
                res.status(500).send("Lỗi khi lấy thông tin bạn bè");
            }
        }
    };

// Trở thành bạn bè 
const beFriend = async (req, res) => {
        try {
            const token = req.headers.token;
    
            if (!token) {
                return res.status(401).send("Người dùng không được xác thực");
            }
    
            const decodedToken = jwt.verify(token, 'HOANGNGHIA');
            const userID = decodedToken.data.MaNguoiDung;
            const { targetID: targetID } = req.body; // Thông tin đối tượng kết bạn
    
            // Kiêm tra đã kết bạn chưa
            const existingFriendship = await model.BanBe.findOne({
                where: {
                    [Op.or]: [
                        { MaNguoiDung1: userID, MaNguoiDung2: targetID, TrangThai: 'DaKetBan' },
                        { MaNguoiDung1: targetID, MaNguoiDung2: userID, TrangThai: 'DaKetBan' }
                    ]
                }
            });
    
            if (existingFriendship) {
                return res.status(400).send("Hai người dùng đã kết bạn với nhau");
            }
    
            // Kiểm tra yêu cầu 
            const friendRequest = await model.BanBe.findOne({
                where: {
                    [Op.or]: [
                        { MaNguoiDung1: userID, MaNguoiDung2: targetID, TrangThai: 'ChoXacNhan' },
                        { MaNguoiDung1: targetID, MaNguoiDung2: userID, TrangThai: 'ChoXacNhan' }
                    ]
                }
            });
    
            if (!friendRequest) {
                return res.status(404).send("Yêu cầu kết bạn không tồn tại");
            }
    
            //Update trạng thái thành DaKetBan
            friendRequest.TrangThai = 'DaKetBan';
            await friendRequest.save();
    
            res.send("Đã cập nhật trạng thái bạn bè thành công");
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                res.status(401).send("Token không hợp lệ");
            } else if (error.name === 'TokenExpiredError') {
                res.status(401).send("Token đã hết hạn");
            } else {
                res.status(500).send("Lỗi khi cập nhật trạng thái bạn bè");
            }
        }
    };

// lấy tất cả người không phải bạn bè của UserID
const getNonFriends = async (req, res) => {
        try {
            const token = req.headers.token;
    
            if (!token) {
                return res.status(401).send("Người dùng không được xác thực");
            }
    
            const decodedToken = jwt.verify(token, 'HOANGNGHIA');
            const userID = decodedToken.data.MaNguoiDung;
    
            // Subquery to find all friend IDs
            const friendIDs = await model.BanBe.findAll({
                attributes: ['MaNguoiDung1', 'MaNguoiDung2'],
                where: {
                    [Op.or]: [
                        { MaNguoiDung1: userID },
                        { MaNguoiDung2: userID }
                    ]
                }
            });
    
            // Flatten the friendIDs array and remove duplicates
            const flatFriendIDs = [...new Set(friendIDs.reduce((acc, friend) => {
                if (friend.MaNguoiDung1 === userID) {
                    acc.push(friend.MaNguoiDung2);
                } else {
                    acc.push(friend.MaNguoiDung1);
                }
                return acc;
            }, [userID]))]; // Include the userID to exclude the user themselves
    
            // Query to find non-friends
            const nonFriends = await model.NguoiDung.findAll({
                where: {
                    MaNguoiDung: {
                        [Op.notIn]: flatFriendIDs
                    }
                },
                limit: 20
            });
    
            res.send(nonFriends);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                res.status(401).send("Token không hợp lệ");
            } else if (error.name === 'TokenExpiredError') {
                res.status(401).send("Token đã hết hạn");
            } else {
                res.status(500).send("Lỗi khi lấy thông tin người dùng không phải bạn bè");
            }
        }
    };

// tạo quan hệ ở Ban bè
const createRelationship = async (req, res) => {
        try {
            const token = req.headers.token;
    
            if (!token) {
                return res.status(401).send("Người dùng không được xác thực");
            }
    
            const decodedToken = jwt.verify(token, 'HOANGNGHIA');
            const userID = decodedToken.data.MaNguoiDung;
            const { targetID : targetID } = req.body;
    
            // Kiểm tra xem userID và targetID đã có tồn tại trong bảng BanBe hay không
            const existingRelationship = await model.BanBe.findOne({
                where: {
                    [Op.or]: [
                        { MaNguoiDung1: userID, MaNguoiDung2: targetID },
                        { MaNguoiDung1: targetID, MaNguoiDung2: userID }
                    ]
                }
            });
    
            if (existingRelationship) {
                return res.status(400).send("Mối quan hệ đã tồn tại");
            }
    
            // Tạo mối quan hệ mới
            await model.BanBe.create({
                MaNguoiDung1: userID,
                MaNguoiDung2: targetID,
                TrangThai: 'ChoXacNhan' // Hoặc trạng thái ban đầu mà bạn muốn
            });
    
            res.send("Yêu cầu kết bạn đã được tạo");
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                res.status(401).send("Token không hợp lệ");
            } else if (error.name === 'TokenExpiredError') {
                res.status(401).send("Token đã hết hạn");
            } else {
                res.status(500).send(error);
            }
        }
    };

//hủy hết bạn
const unfriend = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).send("Người dùng không được xác thực");
        }

        const decodedToken = jwt.verify(token, 'HOANGNGHIA');
        const userID = decodedToken.data.MaNguoiDung;
        const { targetID: targetID } = req.body; // Thông tin đối tượng bỏ kết bạn

        // Tìm kiếm và xóa mối quan hệ bạn bè
        const friendship = await model.BanBe.findOne({
            where: {
                [Op.or]: [
                    { MaNguoiDung1: userID, MaNguoiDung2: targetID, TrangThai: 'DaKetBan' },
                    { MaNguoiDung1: targetID, MaNguoiDung2: userID, TrangThai: 'DaKetBan' }
                ]
            }
        });

        if (!friendship) {
            return res.status(404).send("Không tìm thấy mối quan hệ bạn bè để hủy");
        }

        // Xóa mối quan hệ bạn bè khỏi cơ sở dữ liệu
        await friendship.destroy();

        res.send("Đã hủy mối quan hệ bạn bè thành công");
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            res.status(401).send("Token không hợp lệ");
        } else if (error.name === 'TokenExpiredError') {
            res.status(401).send("Token đã hết hạn");
        } else {
            res.status(500).send("Lỗi khi hủy mối quan hệ bạn bè");
        }
    }
};

    
export { getFriend, getFriendRequest, getYourRequest, beFriend,getNonFriends,createRelationship, unfriend };
