import { RequestHandler } from "express";
import {
  NotificationModel,
  OrderItemModel,
  OrderModel,
  ProductModel,
} from "~/models";
import { createSuccess } from "~/utils";

const getNotifications: RequestHandler = async (req, res, next) => {
  try {
    //@ts-ignore
    const userId = req.user?.id;

    const notifications = await NotificationModel.findAll({
      where: {
        uid: userId,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderModel,
          include: [
            {
              model: OrderItemModel,
              include: [{ model: ProductModel }],
            },
          ],
        },
      ],
    });

    return createSuccess(res, {
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const notificationController = {
  getNotifications,
};
