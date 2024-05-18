import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
const model = initModels(sequelize);

const getPost = async(req, res) =>{
    try{
        const data = await model.BaiViet.findAll();
        res.send(data);
    }catch(error){
        console.log(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
}

export {getPost}