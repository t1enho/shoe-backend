import { Router } from "express";
import { categoryController } from "~/controllers";

const categoryRoute = Router();

categoryRoute.get("/categories", categoryController.getCategories);

categoryRoute.post("/categories", categoryController.createCategory);

categoryRoute.put("/categories/:id", categoryController.updateCategory);

export default categoryRoute;
