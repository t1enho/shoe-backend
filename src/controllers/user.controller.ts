import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import _ from "lodash";
import { UserModel } from "~/models";
import {
  comparePassword,
  createError,
  createSuccess,
  generateToken,
  hashPassword,
} from "~/utils";

const signUp: RequestHandler = async (req, res, next) => {
  const {
    username,
    fullname,
    dateOfBirth,
    phoneNumber,
    password,
    method,
    picture,
    email,
  } = req.body;

  try {
    const usernameExists: any = await UserModel.findOne({
      where: {
        username,
      },
    });
    if (usernameExists) {
      return createError(res, {
        message: "Tên người dùng đã được sử dụng",
      });
    }

    const emailExists: any = await UserModel.findOne({
      where: {
        email,
      },
    });
    if (emailExists) {
      return createError(res, {
        message: "Email đã được sử dụng",
      });
    }

    const hashedPassword = await hashPassword(password);

    const payload = {
      username,
      fullname,
      dateOfBirth,
      phoneNumber,
      password: hashedPassword,
      method: "username",
      picture,
      email,
      role: "user",
    };

    const newUser = await UserModel.create({
      ...payload,
    });

    const userResult = _.omit(newUser.toJSON(), ["password"]);

    return createSuccess(res, {
      data: userResult,
    });
  } catch (error) {
    next(error);
  }
};

const login: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const userExists = await UserModel.findOne({
      where: {
        username,
      },
    });
    const userObj = userExists?.toJSON();
    if (!userExists) {
      return createError(res, {
        devCode: "",
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    }

    const passwordMatch = await comparePassword(password, userObj.password);

    if (!passwordMatch) {
      return createError(res, {
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    }

    const accessToken = generateToken(userObj);
    const userResult = _.omit(userObj, ["password"]);
    return createSuccess(res, {
      data: { ...userResult, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

const getUserInfo = () => {};

const updateUserInfo = () => {};

const loginWithGoogle: RequestHandler = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();

  let accessToken;
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return createError(res, {
        message: "Lỗi",
      });
    }

    const userExists = await UserModel.findOne({
      where: {
        socialId: payload.sub,
      },
    });

    if (!userExists) {
      const info = {
        socialId: payload.sub,
        email: payload?.email,
        method: "google",
        picture: payload?.picture,
        fullname: payload?.name,
        role: "user",
      };

      const newUser = await UserModel.create(info);
      accessToken = generateToken(newUser.toJSON());
      return createSuccess(res, {
        data: { ...newUser.toJSON(), accessToken },
      });
    }
    accessToken = generateToken(userExists.toJSON());
    return createSuccess(res, {
      data: { ...userExists.toJSON(), accessToken },
    });
  } catch (error) {
    return createError(res, {
      message: "Không hợp lệ",
    });
  }
};

export const userController = {
  signUp,
  login,
  getUserInfo,
  updateUserInfo,
  loginWithGoogle,
};
