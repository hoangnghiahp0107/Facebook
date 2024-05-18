import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class TinNhan extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaTN: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NguoiGui: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'NguoiDung',
        key: 'MaNguoiDung'
      }
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
    tableName: 'TinNhan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaTN" },
        ]
      },
      {
        name: "NguoiGui",
        using: "BTREE",
        fields: [
          { name: "NguoiGui" },
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
