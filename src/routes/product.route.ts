import { Router } from "express";
import { productController } from "~/controllers";
import { authenticateToken } from "~/middlewares";

const productRoute = Router();

productRoute.get("/products", authenticateToken, productController.getProducts);

productRoute.get(
  "/products/category/:categoryId",
  productController.getProductsByCategory
);

// productRoute.get("/products", productController.getProducts);

productRoute.get("/products/newest", productController.getProductsNewest);

productRoute.get(
  "/products/:id",
  authenticateToken,
  productController.getProduct
);

productRoute.post(
  "/products",
  authenticateToken,
  productController.createProduct
);

productRoute.put(
  "/products/:id",
  authenticateToken,
  productController.updateProduct
);

export default productRoute;
