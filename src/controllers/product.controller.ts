import { RequestHandler } from "express";
import { Op } from "sequelize";
import unidecode from "unidecode";
import { CategoryModel, ProductModel, UserModel } from "~/models";
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
    const nameNormalized = unidecode(name);
    const newProduct = await ProductModel.create({
      name,
      material,
      size,
      price,
      description,
      status: "FOR_SALE",
      categoryId,
      nameNormalized: nameNormalized,
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
  const { id } = req.params;

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
  //@ts-ignore
  const uid = req.user.id;
  //@ts-ignore
  const { sort, search } = req.query;

  const userExists = await UserModel.findByPk(86);

  if (userExists?.toJSON().role === "admin") {
    console.log("vo");
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
  } else {
    try {
      const normalizedSearchQuery = unidecode(search as string);
      console.log(normalizedSearchQuery);

      const sorted = (sort ? sort : "DESC") as string;
      const products = await ProductModel.findAll({
        order: [["createdAt", sorted]],
        attributes: { exclude: ["categoryId"] },
        include: CategoryModel,
        where: {
          // status: "FOR_SALE",
          nameNormalized: {
            [Op.like]: `%${normalizedSearchQuery.trim()}%`,
          },
        },
      });
      return createSuccess(res, {
        data: products,
      });
    } catch (error) {
      console.log(error);
    }
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
      where: {
        status: "FOR_SALE",
      },
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
