import { RequestHandler } from "express";
import { CategoryModel } from "~/models";
import { createError, createSuccess } from "~/utils";

const createCategory: RequestHandler = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newCategory = await CategoryModel.create({
      name,
      description,
    });

    return createSuccess(res, {
      data: newCategory.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory: RequestHandler = async (req, res, next) => {
  const { name, description } = req.body;
  const { id } = req.params;

  try {
    const categoryExists = await CategoryModel.findByPk(id);
    if (!categoryExists) {
      return createError(res, {
        message: "Không tìm thấy danh mục này",
      });
    }

    const newUpdate = {
      name,
      description,
    };

    categoryExists.update({ ...newUpdate });
    categoryExists.save();

    return createSuccess(res, {
      message: "Cập nhật thành công",
      data: categoryExists.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await CategoryModel.findAll();
    return createSuccess(res, {
      data: categories,
    });
  } catch (error) {}
};
export const categoryController = {
  createCategory,
  updateCategory,
  getCategories,
};
