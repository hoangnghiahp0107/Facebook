import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Story extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaStory: {
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
    }
  }, {
    sequelize,
    tableName: 'Story',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaStory" },
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
