import { Router } from "express";
import categoryRoute from "./category.route";
import userRoute from "./user.route";

const routes = Router();

// user
routes.use(userRoute);

// category
routes.use(categoryRoute);

export default routes;
