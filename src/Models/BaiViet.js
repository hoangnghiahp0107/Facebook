import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class BaiViet extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaBV: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NguoiDungID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'NguoiDung',
        key: 'MaNguoiDung'
      }
    },
    HinhAnh: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    NoiDung: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ThoiGian: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    CheDoRiengTuID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'CheDoRiengTu',
        key: 'MaCheDo'
      }
    },
    TrangThaiKiemDuyet: {
      type: DataTypes.ENUM('ChoKiemDuyet','DaKiemDuyet','BiTuChoi'),
      allowNull: false,
      defaultValue: "ChoKiemDuyet"
    }
  }, {
    sequelize,
    tableName: 'BaiViet',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaBV" },
        ]
      },
      {
        name: "NguoiDungID",
        using: "BTREE",
        fields: [
          { name: "NguoiDungID" },
        ]
      },
      {
        name: "CheDoRiengTuID",
        using: "BTREE",
        fields: [
          { name: "CheDoRiengTuID" },
        ]
      },
    ]
  });
  }
}
