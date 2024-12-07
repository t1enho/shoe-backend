import { Router } from "express";
import { orderController } from "~/controllers";
import { authenticateToken } from "~/middlewares";

const orderRoute = Router();

orderRoute.post("/orders", authenticateToken, orderController.createOrder);
orderRoute.post(
  "/orders/zalocallback",
  authenticateToken,
  orderController.createOrderZaloPay
);

orderRoute.get(
  "/orders/history",
  authenticateToken,
  orderController.getOrdersHistory
);

orderRoute.get("/orders/:orderId", authenticateToken, orderController.getOrder);
orderRoute.put(
  "/orders/:orderId",
  authenticateToken,
  orderController.updateOrder
);
export default orderRoute;
