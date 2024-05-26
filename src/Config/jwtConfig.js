import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
    try {
        let { token } = req.headers;
        if (!token) {
            return res.status(403).send(`Không có quyền truy cập`);
        }
        if (verifyToken(token)) {
            next();
        } else {
            throw new Error('Token không hợp lệ');
        }
    } catch (error) {
        res.status(403).send(`Không có quyền truy cập: ${error.message}`);
    }
};


const taoToken = (user) => {
    const { MaNguoiDung, Email, SDT, HoTen, MaVaiTro } = user;
    const data = { MaNguoiDung, Email, SDT, HoTen, MaVaiTro };
    return jwt.sign({ data }, "HOANGNGHIA", { expiresIn: "7d" });
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, "HOANGNGHIA");
        const { data } = decoded;
        return data;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export { checkToken, taoToken, verifyToken };
