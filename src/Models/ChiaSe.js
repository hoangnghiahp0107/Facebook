import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ChiaSe extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaChiaSe: {
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
    NguoiDungID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'NguoiDung',
        key: 'MaNguoiDung'
      }
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
    }
  }, {
    sequelize,
    tableName: 'ChiaSe',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaChiaSe" },
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
