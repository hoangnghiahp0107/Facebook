import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class BanBe extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaNguoiDung1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'NguoiDung',
        key: 'MaNguoiDung'
      }
    },
    MaNguoiDung2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'NguoiDung',
        key: 'MaNguoiDung'
      }
    },
    TrangThai: {
      type: DataTypes.ENUM('DaKetBan','ChoXacNhan','BiChan'),
      allowNull: false
    },
    CheDoRiengTuID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'CheDoRiengTu',
        key: 'MaCheDo'
      }
    }
  }, {
    sequelize,
    tableName: 'BanBe',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNguoiDung1" },
          { name: "MaNguoiDung2" },
        ]
      },
      {
        name: "MaNguoiDung2",
        using: "BTREE",
        fields: [
          { name: "MaNguoiDung2" },
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
