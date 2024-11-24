import { DataTypes } from "sequelize";
import { TABLE_NAMES } from "../../constants";
import { connection } from "../config";

const OrderItemModel = connection.define(TABLE_NAMES.ORDER_ITEMS, {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default OrderItemModel;
