import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { createError } from "~/utils";

export const authenticateToken: RequestHandler<unknown> = async (
  req,
  res,
  next
) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      throw createHttpError(401, "Token không hợp lệ");
    }

    jwt.verify(
      accessToken as string,
      process.env.JWT_SECRET_KEY as string,
      (err, user: any) => {
        if (err)
          return createError(res, {
            message: "Không hợp lệ",
          });

        //@ts-ignore
        req.user = user;
        next();
      }
    );
  } catch (error) {
    next(error);
  }
};
