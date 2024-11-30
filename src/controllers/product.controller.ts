import { RequestHandler } from "express";
import { CategoryModel, ProductModel } from "~/models";
import { createError, createSuccess } from "~/utils";

const createProduct: RequestHandler = async (req, res, next) => {
  const { name, material, size, price, description, categoryId } = req.body;

  try {
    const categoryExists = await CategoryModel.findByPk(categoryId);
    if (!categoryExists) {
      return createError(res, {
        message: "Danh mục không tồn tại",
      });
    }

    const newProduct = await ProductModel.create({
      name,
      material,
      size,
      price,
      description,
      status: "FOR_SALE",
      categoryId,
    });

    return createSuccess(res, {
      data: newProduct.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct: RequestHandler = async (req, res, next) => {
  const { status } = req.body;
  console.log("PRODUCT_STATUS ", status);
  const { id } = req.params;

  console.log("PRODUCT_ID ", id);
  try {
    const productExists = await ProductModel.findByPk(id);
    if (!productExists) {
      return createError(res, {
        message: "Không tìm thấy sản phẩm",
      });
    }

    await productExists.update({
      status,
    });
    await productExists.save();
    return createSuccess(res, {
      message: "Cập nhật thành công",
      data: productExists.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await ProductModel.findAll({
      attributes: { exclude: ["categoryId"] },
      include: CategoryModel,
    });
    return createSuccess(res, {
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findByPk(id, {
      attributes: { exclude: ["categoryId"] },
      include: CategoryModel,
    });

    if (!product) {
      return createError(res, {
        message: "Không tìm thấy sản phẩm",
      });
    }
    return createSuccess(res, {
      data: product?.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const getProductsNewest: RequestHandler = async (req, res, next) => {
  try {
    const products = await ProductModel.findAll({
      order: [["createdAt", "DESC"]], // Sort by the newest first
      attributes: { exclude: ["categoryId"] },
      include: CategoryModel,
      // limit: 10,
    });

    return createSuccess(res, {
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const productController = {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
  getProductsNewest,
};
