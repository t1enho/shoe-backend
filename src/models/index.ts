import CategoryModel from "./category.model";
import NotificationModel from "./notification.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "./product.model";
import UserModel from "./user.model";

export { default as CategoryModel } from "./category.model";
export { default as NotificationModel } from "./notification.model";
export { default as OrderItemModel } from "./order-item.model";
export { default as OrderModel } from "./order.model";
export { default as ProductModel } from "./product.model";
export { default as UserModel } from "./user.model";

ProductModel.belongsTo(CategoryModel, {
  foreignKey: "categoryId",
});

OrderModel.belongsTo(UserModel, {
  foreignKey: "uid",
  // as: "customer",
});
// OrderModel.belongsTo(UserModel, {
//   foreignKey: "deliveryId",
//   as: "delivery",
// });

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

// UserModel.hasMany(NotificationModel, {
//   foreignKey: "uid",
// });
NotificationModel.belongsTo(UserModel, {
  foreignKey: "uid",
});

// OrderModel.hasMany(NotificationModel, {
//   foreignKey: "orderId",
// });
NotificationModel.belongsTo(OrderModel, {
  foreignKey: "orderId",
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

NotificationModel.sync({
  // keep
});
