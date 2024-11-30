import { Response } from "express";

export const createError = <T>(res: Response<T>, result: T) => {
  const response: any = {
    code: 400,
    status: "error",
    ...result,
  };

  res.status(400).json(response);
};

export const createSuccess = <T>(res: Response<T>, result: T) => {
  const response: any = {
    code: 200,
    status: "success",
    ...result,
  };

  res.status(200).json(response);
};
