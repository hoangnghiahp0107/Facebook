import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class NguoiDung extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    MaNguoiDung: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    SDT: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    MatKhau: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    NgaySinh: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    GioiTinh: {
      type: DataTypes.ENUM('Nam','Nu','Khac'),
      allowNull: false
    },
    HoTen: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AnhDaiDien: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MaVaiTro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'VaiTro',
        key: 'MaVaiTro'
      }
    },
    Daxoa: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    NgayDangKy: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'NguoiDung',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNguoiDung" },
        ]
      },
      {
        name: "MaVaiTro",
        using: "BTREE",
        fields: [
          { name: "MaVaiTro" },
        ]
      },
    ]
  });
  }
}
