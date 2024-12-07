import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import _ from "lodash";
import { UserModel } from "~/models";
import { fcmService } from "~/services";
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
    fcmToken,
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
      fcmToken: fcmToken,
    };

    const newUser = await UserModel.create({
      ...payload,
    });

    const userResult = _.omit(newUser.toJSON(), ["password"]);

    await fcmService.sendSignupNotification(fcmToken);

    return createSuccess(res, {
      data: userResult,
    });
  } catch (error) {
    next(error);
  }
};

const login: RequestHandler = async (req, res, next) => {
  const { username, password, fcmToken } = req.body;

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
    userExists.update({
      fcmToken,
    });
    userExists.save();
    return createSuccess(res, {
      data: { ...userResult, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

const getUserInfo: RequestHandler = async (req, res, next) => {
  // @ts-ignore
  const uid = req.user.id;
  try {
    const userExists = await UserModel.findOne({
      where: {
        id: uid,
      },
    });

    if (!userExists) {
      return createError(res, {
        message: "Người dùng không tồn tại",
      });
    }

    return createSuccess(res, {
      data: userExists.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const updateUserInfo: RequestHandler = async (req, res, next) => {
  const { fullname, username, picture, phoneNumber, dateOfBirth } = req.body;

  // @ts-ignore
  const uid = req.user.id;
  try {
    const userExists = await UserModel.findOne({
      where: {
        id: uid,
      },
    });

    if (!userExists) {
      return createError(res, {
        message: "Người dùng không tồn tại",
      });
    }

    if (userExists.toJSON().username !== username) {
      const usernameExists = await UserModel.findOne({
        where: {
          username,
        },
      });

      if (usernameExists) {
        return createError(res, {
          message: "Tên người dùng đã được sử dụng",
        });
      }
    } else {
      userExists.update({
        fullname,
        username,
        picture,
        phoneNumber,
        dateOfBirth,
      });

      userExists.save();

      return createSuccess(res, {
        data: userExists.toJSON(),
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const loginWithGoogle: RequestHandler = async (req, res, next) => {
  const { idToken, fcmToken } = req.body;
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
        fcmToken,
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

const updatePassword: RequestHandler = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  // @ts-ignore
  const uid = req.user.id;

  try {
    const userExists = await UserModel.findOne({
      where: {
        id: uid,
      },
    });
    if (!userExists) {
      return createError(res, {
        message: "Người dùng không tồn tại",
      });
    }

    const passwordMatch = await comparePassword(
      oldPassword,
      userExists?.toJSON().password
    );

    if (!passwordMatch) {
      return createError(res, {
        message: "Mật khẩu không đúng",
      });
    }

    const newHashedPassword = await hashPassword(newPassword);
    userExists.update({ password: newHashedPassword });
    userExists.save();

    return createSuccess(res, {
      message: "Cập nhật thành công",
    });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  signUp,
  login,
  getUserInfo,
  updateUserInfo,
  loginWithGoogle,
  updatePassword,
};
