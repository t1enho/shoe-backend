import { DataTypes } from "sequelize";
import { TABLE_NAMES } from "../../constants";
import { connection } from "../config";

const UserModel = connection.define(TABLE_NAMES.USERS, {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  socialId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  method: {
    type: DataTypes.ENUM({ values: ["google", "facebook", "username"] }),
    allowNull: true,
  },
  picture: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM({ values: ["user", "admin"] }),
    allowNull: true,
  },
  fcmToken: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
});

export default UserModel;
