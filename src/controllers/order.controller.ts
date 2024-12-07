import { RequestHandler } from "express";
import createHttpError from "http-errors";
import moment from "moment";
import { Op } from "sequelize";
import {
  NotificationModel,
  OrderItemModel,
  OrderModel,
  ProductModel,
  UserModel,
} from "~/models";
import { fcmService } from "~/services";
import { createError, createSuccess, formatMoney } from "~/utils";

const CryptoJS = require("crypto-js");
const qs = require("qs");

// APP INFO, STK TEST: 4111 1111 1111 1111
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

const examp: RequestHandler = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const createOrder: RequestHandler = async (req, res, next) => {
  // @ts-ignore
  const { paymentType } = req.body;

  const items = JSON.parse(req.body.items);

  // @ts-ignore
  const uid = req.user.id;

  try {
    const productIds = items.map((item: any) => item.id);

    let products: any = [];

    await Promise.all(
      productIds.map((id: any) =>
        ProductModel.findByPk(id).then((product) => {
          if (product) {
            return product.toJSON();
          }
          throw createHttpError(404, "product_id_not_found_exception");
        })
      )
    )
      .then((values) => {
        products = values as any;
      })
      .catch((error) => {
        throw error;
      });

    const combineProducts = products?.map((item: any) => {
      const found = items?.find((e: any) => e.id === item.id);
      return {
        ...item,
        quantity: found ? found.quantity : 0,
      };
    });

    const totalPrice = combineProducts.reduce((acc: any, currentValue: any) => {
      return acc + currentValue.price * currentValue.quantity;
    }, 0);

    const newOrder = (await OrderModel.create({
      uid,
      totalPrice: totalPrice,
      status: "WAITING",
      paymentType: paymentType,
      paymentStatus: paymentType == "ZALOPAY" ? "PAID" : "UNPAID",
    })) as any;

    // await Promise.all(
    //   combineProducts.map(async (item: any) => {
    //     const itemObj = {
    //       productId: item.id,
    //       quantity: item.quantity,
    //       price: item.price,
    //       orderId: newOrder.id,
    //     };

    //     const product = await OrderItemModel.create(itemObj);
    //     if (product) {
    //       return product.toJSON();
    //     }
    //     throw createHttpError(404, "product_id_not_found_exception", {
    //       id: item.id,
    //     });
    //   })
    // )
    //   .then((values) => {

    //     return createSuccess(res, {
    //       message: "Thành công",
    //     });

    //   })
    //   .catch((error) => {
    //     throw error;
    //   });

    const results = await Promise.allSettled(
      combineProducts.map(async (item: any) => {
        const itemObj = {
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          orderId: newOrder.id,
        };

        const product = await OrderItemModel.create(itemObj);
        if (product) {
          return product.toJSON();
        }
        throw createHttpError(404, "product_id_not_found_exception", {
          id: item.id,
        });
      })
    );

    // Tách kết quả thành các nhóm thành công và thất bại
    const successes = results
      .filter((result) => result.status === "fulfilled")
      .map((result: any) => result.value);
    const errors = results
      .filter((result) => result.status === "rejected")
      .map((result: any) => result.reason);

    // Nếu có lỗi, ném lỗi đầu tiên hoặc xử lý tất cả lỗi
    if (errors.length > 0) {
      // throw errors[0]; // Hoặc bạn có thể xử lý danh sách tất cả các lỗi
    }

    const user = await UserModel.findOne({ where: { id: uid } });

    const fcmToken = user?.toJSON().fcmToken;
    console.log(fcmToken);
    await fcmService.sendPushNotify({
      notification: {
        title: "Thông báo đơn hàng",
        body: "Đơn hàng đã được tạo",
      },
      token: fcmToken,
    });

    try {
      await NotificationModel.create({
        title: `Đơn hàng ${formatMoney(totalPrice)} tại Wahoo`,
        description: `Cảm ơn bạn đã mua hàng tại Wahoo`,
        type: "ORDER",
        orderId: newOrder.id,
        uid: uid,
      });
    } catch (error) {}

    // Nếu không có lỗi, trả về thành công
    return createSuccess(res, {
      message: "Thành công",
      // data: successes,
    });

    //
  } catch (error) {
    next(error);
  }
};

const getOrdersHistory: RequestHandler = async (req, res, next) => {
  const { date } = req.query as any;
  try {
    // @ts-ignore
    const uid = req.user.id;

    let whereClause: any = { uid };

    if (date) {
      const startOfDay = moment(date, "DD/MM/YYYY").startOf("day").toDate();
      const endOfDay = moment(date, "DD/MM/YYYY").endOf("day").toDate();

      console.log("start", startOfDay);
      console.log("end", endOfDay);

      whereClause.createdAt = {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay,
      };
    }

    const orders = await OrderModel.findAll({
      where: whereClause,
      include: [
        {
          model: OrderItemModel,
          include: [
            {
              model: ProductModel,
            },
          ],
        },
      ],
    });

    return createSuccess(res, {
      data: orders,
    });
  } catch (error) {
    console.log(JSON.stringify(error));
  }
};

export const createOrderZaloPay: RequestHandler = (req, res, next) => {
  let result: any = {};
  console.log(req.body);
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng ở đây
      let dataJson = JSON.parse(dataStr, config.key2 as any);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex: any) {
    console.log("lỗi:::" + ex.message);
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  console.log(JSON.parse(req.body.data));

  res.json(result);
};

const getOrder: RequestHandler = async (req, res, next) => {
  try {
    //@ts-ignore
    const id = req.params as any;

    const notificationExists = await OrderModel.findByPk(id);

    if (!notificationExists) {
      return createError(res, {
        message: "Lỗi",
      });
    }
    return createSuccess(res, {
      data: notificationExists,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrder: RequestHandler = async (req, res, next) => {
  // @ts-ignore
  const uid = req.user.id;
  const orderId = req.params.orderId;
  const { status } = req.body;
  console.log(orderId);
  try {
    const orderExists = await OrderModel.findByPk(orderId);
    if (orderExists) await orderExists.update({ status: status });
    console.log(orderExists?.toJSON());
    return createSuccess(res, {
      data: orderExists?.toJSON(),
    });
  } catch (error) {
    console.log(error);
  }
};

export const orderController = {
  createOrder,
  getOrdersHistory,
  createOrderZaloPay,
  getOrder,
  updateOrder,
};
