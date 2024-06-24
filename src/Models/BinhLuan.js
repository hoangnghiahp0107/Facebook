import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class BinhLuan extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaBL: {
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
    NoiDung: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ThoiGian: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'BinhLuan',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaBL" },
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
    ]
  });
  }
}
