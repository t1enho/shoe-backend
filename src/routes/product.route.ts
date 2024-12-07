import { Router } from "express";
import { productController } from "~/controllers";
import { authenticateToken } from "~/middlewares";

const productRoute = Router();

productRoute.get("/products", authenticateToken, productController.getProducts);

// productRoute.get("/products", productController.getProducts);

productRoute.get("/products/newest", productController.getProductsNewest);

productRoute.get("/products/:id", productController.getProduct);

productRoute.post("/products", productController.createProduct);

productRoute.put("/products/:id", productController.updateProduct);

export default productRoute;
