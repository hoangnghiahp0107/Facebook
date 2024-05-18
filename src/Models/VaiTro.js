import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class VaiTro extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaVaiTro: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenVaiTro: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'VaiTro',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaVaiTro" },
        ]
      },
    ]
  });
  }
}
