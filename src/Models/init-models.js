import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _BaiViet from  "./BaiViet.js";
import _BanBe from  "./BanBe.js";
import _BinhLuan from  "./BinhLuan.js";
import _CamXuc from  "./CamXuc.js";
import _CheDoRiengTu from  "./CheDoRiengTu.js";
import _ChiaSe from  "./ChiaSe.js";
import _KiemDuyet from  "./KiemDuyet.js";
import _NguoiDung from  "./NguoiDung.js";
import _Story from  "./Story.js";
import _ThongBao from  "./ThongBao.js";
import _TinNhan from  "./TinNhan.js";
import _VaiTro from  "./VaiTro.js";

export default function initModels(sequelize) {
  const BaiViet = _BaiViet.init(sequelize, DataTypes);
  const BanBe = _BanBe.init(sequelize, DataTypes);
  const BinhLuan = _BinhLuan.init(sequelize, DataTypes);
  const CamXuc = _CamXuc.init(sequelize, DataTypes);
  const CheDoRiengTu = _CheDoRiengTu.init(sequelize, DataTypes);
  const ChiaSe = _ChiaSe.init(sequelize, DataTypes);
  const KiemDuyet = _KiemDuyet.init(sequelize, DataTypes);
  const NguoiDung = _NguoiDung.init(sequelize, DataTypes);
  const Story = _Story.init(sequelize, DataTypes);
  const ThongBao = _ThongBao.init(sequelize, DataTypes);
  const TinNhan = _TinNhan.init(sequelize, DataTypes);
  const VaiTro = _VaiTro.init(sequelize, DataTypes);

  NguoiDung.belongsToMany(NguoiDung, { as: 'MaNguoiDung2_NguoiDungs', through: BanBe, foreignKey: "MaNguoiDung1", otherKey: "MaNguoiDung2" });
  NguoiDung.belongsToMany(NguoiDung, { as: 'MaNguoiDung1_NguoiDungs', through: BanBe, foreignKey: "MaNguoiDung2", otherKey: "MaNguoiDung1" });
  BinhLuan.belongsTo(BaiViet, { as: "BaiViet", foreignKey: "BaiVietID"});
  BaiViet.hasMany(BinhLuan, { as: "BinhLuans", foreignKey: "BaiVietID"});
  CamXuc.belongsTo(BaiViet, { as: "BaiViet", foreignKey: "BaiVietID"});
  BaiViet.hasMany(CamXuc, { as: "CamXucs", foreignKey: "BaiVietID"});
  ChiaSe.belongsTo(BaiViet, { as: "BaiViet", foreignKey: "BaiVietID"});
  BaiViet.hasMany(ChiaSe, { as: "ChiaSes", foreignKey: "BaiVietID"});
  KiemDuyet.belongsTo(BaiViet, { as: "BaiViet", foreignKey: "BaiVietID"});
  BaiViet.hasMany(KiemDuyet, { as: "KiemDuyets", foreignKey: "BaiVietID"});
  CamXuc.belongsTo(BinhLuan, { as: "BinhLuan", foreignKey: "BinhLuanID"});
  BinhLuan.hasMany(CamXuc, { as: "CamXucs", foreignKey: "BinhLuanID"});
  BaiViet.belongsTo(CheDoRiengTu, { as: "CheDoRiengTu", foreignKey: "CheDoRiengTuID"});
  CheDoRiengTu.hasMany(BaiViet, { as: "BaiViets", foreignKey: "CheDoRiengTuID"});
  BanBe.belongsTo(CheDoRiengTu, { as: "CheDoRiengTu", foreignKey: "CheDoRiengTuID"});
  CheDoRiengTu.hasMany(BanBe, { as: "BanBes", foreignKey: "CheDoRiengTuID"});
  ChiaSe.belongsTo(CheDoRiengTu, { as: "CheDoRiengTu", foreignKey: "CheDoRiengTuID"});
  CheDoRiengTu.hasMany(ChiaSe, { as: "ChiaSes", foreignKey: "CheDoRiengTuID"});
  Story.belongsTo(CheDoRiengTu, { as: "CheDoRiengTu", foreignKey: "CheDoRiengTuID"});
  CheDoRiengTu.hasMany(Story, { as: "Stories", foreignKey: "CheDoRiengTuID"});
  BaiViet.belongsTo(NguoiDung, { as: "NguoiDung", foreignKey: "NguoiDungID"});
  NguoiDung.hasMany(BaiViet, { as: "BaiViets", foreignKey: "NguoiDungID"});
  BanBe.belongsTo(NguoiDung, { as: "MaNguoiDung1_NguoiDung", foreignKey: "MaNguoiDung1"});
  NguoiDung.hasMany(BanBe, { as: "BanBes", foreignKey: "MaNguoiDung1"});
  BanBe.belongsTo(NguoiDung, { as: "MaNguoiDung2_NguoiDung", foreignKey: "MaNguoiDung2"});
  NguoiDung.hasMany(BanBe, { as: "MaNguoiDung2_BanBes", foreignKey: "MaNguoiDung2"});
  BinhLuan.belongsTo(NguoiDung, { as: "NguoiDung", foreignKey: "NguoiDungID"});
  NguoiDung.hasMany(BinhLuan, { as: "BinhLuans", foreignKey: "NguoiDungID"});
  CamXuc.belongsTo(NguoiDung, { as: "NguoiDung", foreignKey: "NguoiDungID"});
  NguoiDung.hasMany(CamXuc, { as: "CamXucs", foreignKey: "NguoiDungID"});
  ChiaSe.belongsTo(NguoiDung, { as: "NguoiDung", foreignKey: "NguoiDungID"});
  NguoiDung.hasMany(ChiaSe, { as: "ChiaSes", foreignKey: "NguoiDungID"});
  KiemDuyet.belongsTo(NguoiDung, { as: "NguoiDuyet_NguoiDung", foreignKey: "NguoiDuyet"});
  NguoiDung.hasMany(KiemDuyet, { as: "KiemDuyets", foreignKey: "NguoiDuyet"});
  Story.belongsTo(NguoiDung, { as: "NguoiDung", foreignKey: "NguoiDungID"});
  NguoiDung.hasMany(Story, { as: "Stories", foreignKey: "NguoiDungID"});
  ThongBao.belongsTo(NguoiDung, { as: "NguoiNhan_NguoiDung", foreignKey: "NguoiNhan"});
  NguoiDung.hasMany(ThongBao, { as: "ThongBaos", foreignKey: "NguoiNhan"});
  TinNhan.belongsTo(NguoiDung, { as: "NguoiGui_NguoiDung", foreignKey: "NguoiGui"});
  NguoiDung.hasMany(TinNhan, { as: "TinNhans", foreignKey: "NguoiGui"});
  TinNhan.belongsTo(NguoiDung, { as: "NguoiNhan_NguoiDung", foreignKey: "NguoiNhan"});
  NguoiDung.hasMany(TinNhan, { as: "NguoiNhan_TinNhans", foreignKey: "NguoiNhan"});
  NguoiDung.belongsTo(VaiTro, { as: "MaVaiTro_VaiTro", foreignKey: "MaVaiTro"});
  VaiTro.hasMany(NguoiDung, { as: "NguoiDungs", foreignKey: "MaVaiTro"});

  return {
    BaiViet,
    BanBe,
    BinhLuan,
    CamXuc,
    CheDoRiengTu,
    ChiaSe,
    KiemDuyet,
    NguoiDung,
    Story,
    ThongBao,
    TinNhan,
    VaiTro,
  };
}
