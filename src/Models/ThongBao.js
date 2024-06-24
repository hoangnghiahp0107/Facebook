import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ThongBao extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaThongBao: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NguoiNhan: {
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
    tableName: 'ThongBao',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaThongBao" },
        ]
      },
      {
        name: "NguoiNhan",
        using: "BTREE",
        fields: [
          { name: "NguoiNhan" },
        ]
      },
    ]
  });
  }
}
