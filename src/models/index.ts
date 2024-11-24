import CategoryModel from "./category.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "./product.model";
import UserModel from "./user.model";

export { default as CategoryModel } from "./category.model";
export { default as OrderItemModel } from "./order-item.model";
export { default as OrderModel } from "./order.model";
export { default as ProductModel } from "./product.model";
export { default as UserModel } from "./user.model";

OrderModel.belongsTo(UserModel, {
  foreignKey: "customerId",
  as: "customer",
});
OrderModel.belongsTo(UserModel, {
  foreignKey: "deliveryId",
  as: "delivery",
});

OrderModel.hasMany(OrderItemModel, {
  foreignKey: "orderId",
});
OrderItemModel.belongsTo(OrderModel, {
  foreignKey: "orderId",
  // as: 'order',
});
OrderItemModel.belongsTo(ProductModel, {
  foreignKey: "productId",
  // as: 'product'
});

OrderModel.sync({
  // keep
});

OrderItemModel.sync({
  // keep
});

ProductModel.sync({
  // keep
});

UserModel.sync({
  // keep
});

CategoryModel.sync({
  // keep
});
