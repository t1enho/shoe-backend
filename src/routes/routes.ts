import { Router } from "express";
import categoryRoute from "./category.route";
import productRoute from "./product.route";
import userRoute from "./user.route";

const routes = Router();

// user
routes.use(userRoute);

// category
routes.use(categoryRoute);

// product
routes.use(productRoute);

export default routes;
