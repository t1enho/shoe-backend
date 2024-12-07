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

    // const accessToken =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMzIzMDQ5NCwiZXhwIjoxNzY0NzY2NDk0fQ.J8Q7zHiXG-b0lK6rX_-6yFy_4kK8IFhOF0SOEEmp23Q";

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
