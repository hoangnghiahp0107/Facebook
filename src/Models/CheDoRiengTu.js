import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class CheDoRiengTu extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaCheDo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenCheDo: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'CheDoRiengTu',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaCheDo" },
        ]
      },
    ]
  });
  }
}
