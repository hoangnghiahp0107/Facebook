import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class CamXuc extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaCamXuc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    LoaiCamXuc: {
      type: DataTypes.ENUM('Like','Love','Haha','Wow','Sad','Angry'),
      allowNull: false
    },
    NguoiDungID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'NguoiDung',
        key: 'MaNguoiDung'
      }
    },
    BaiVietID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'BaiViet',
        key: 'MaBV'
      }
    },
    BinhLuanID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'BinhLuan',
        key: 'MaBL'
      }
    },
    ThoiGian: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'CamXuc',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaCamXuc" },
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
        name: "BaiVietID",
        using: "BTREE",
        fields: [
          { name: "BaiVietID" },
        ]
      },
      {
        name: "BinhLuanID",
        using: "BTREE",
        fields: [
          { name: "BinhLuanID" },
        ]
      },
    ]
  });
  }
}
