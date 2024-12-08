import { Router } from "express";
import categoryRoute from "./category.route";
import notificationRoute from "./notification.route";
import orderRoute from "./order.route";
import productRoute from "./product.route";
import userRoute from "./user.route";
import voucherRoute from "./voucher.route";

const routes = Router();

// user
routes.use(userRoute);

// category
routes.use(categoryRoute);

// product
routes.use(productRoute);

routes.use(orderRoute);

routes.use(notificationRoute);

routes.use(voucherRoute);

export default routes;
