import { DataTypes } from "sequelize";
import { TABLE_NAMES } from "../../constants";
import { connection } from "../config";

const ProductModel = connection.define(TABLE_NAMES.PRODUCTS, {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameNormalized: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  material: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({
      values: ["OUT_OF_STOCK", "STOP_SELLING", "FOR_SALE"],
    }),
    allowNull: true,
  },
  imageURL: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
});

export default ProductModel;
