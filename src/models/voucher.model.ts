import { DataTypes } from "sequelize";
import { connection } from "~/config";
import { TABLE_NAMES } from "../../constants";

const VoucherModel = connection.define(TABLE_NAMES.VOUCERS, {
  code: {
    type: DataTypes.STRING,
    // autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
    comment:
      "Mô tả voucher, có thể chứa các chi tiết như điều kiện và thời hạn.",
  },
  limit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // comment: "Số lượt sử dụng tối đa của voucher.",
  },
  timesUsed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    // comment: "Số lần voucher đã được sử dụng.",
  },
  max: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // comment: "Giá trị giảm tối đa của voucher.",
  },
  min: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // comment: "Giá trị giảm tối thiểu để áp dụng voucher.",
  },
  minOrderValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    // comment: "Đơn tối thiểu để voucher có hiệu lực.",
  },
});

export default VoucherModel;
