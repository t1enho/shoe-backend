import { RequestHandler } from "express";

const createProduct: RequestHandler = async (req, res, next) => {
  const { name, material, size, price, description, status } = req.body;

  try {
  } catch (error) {
    next(error);
  }
};

const updateProduct: RequestHandler = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const productController = {
  createProduct,
  updateProduct,
};
