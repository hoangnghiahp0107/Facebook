import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class KiemDuyet extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaKiemDuyet: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    BaiVietID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'BaiViet',
        key: 'MaBV'
      }
    },
    NguoiDuyet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'NguoiDung',
        key: 'MaNguoiDung'
      }
    },
    TrangThaiKiemDuyet: {
      type: DataTypes.ENUM('DaKiemDuyet','BiTuChoi'),
      allowNull: false
    },
    ThoiGianKiemDuyet: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'KiemDuyet',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaKiemDuyet" },
        ]
      },
      {
        name: "BaiVietID",
        using: "BTREE",
        fields: [
          { name: "BaiVietID" },
        ]
      },
      {
        name: "NguoiDuyet",
        using: "BTREE",
        fields: [
          { name: "NguoiDuyet" },
        ]
      },
    ]
  });
  }
}
