import { DataTypes } from "sequelize";
import { TABLE_NAMES } from "../../constants";
import { connection } from "../config";

const OrderModel = connection.define(TABLE_NAMES.ORDERS, {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.ENUM({
      values: ["PAID", "UNPAID"],
    }),
    allowNull: true,
  },
  paymentType: {
    type: DataTypes.ENUM({
      values: ["ZALOPAY", "MOMO", "DEFAULT"],
    }),
    allowNull: true,
  },
});

export default OrderModel;
