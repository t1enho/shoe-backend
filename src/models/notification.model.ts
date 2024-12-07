import { DataTypes } from "sequelize";
import { TABLE_NAMES } from "../../constants";
import { connection } from "../config";

const NotificationModel = connection.define(TABLE_NAMES.NOTIFICATIONS, {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM({ values: ["ORDER", "DEFAULT"] }),
    allowNull: true,
  },
});

export default NotificationModel;
