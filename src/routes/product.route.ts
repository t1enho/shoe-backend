import { Router } from "express";
import { productController } from "~/controllers";

const productRoute = Router();

productRoute.get("/products", productController.getProducts);

productRoute.get("/products/newest", productController.getProductsNewest);

productRoute.get("/products/:id", productController.getProduct);

productRoute.post("/products", productController.createProduct);

productRoute.put("/products/:id", productController.updateProduct);

export default productRoute;
