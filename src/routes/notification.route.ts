import { Router } from "express";
import { notificationController } from "~/controllers";
import { authenticateToken } from "~/middlewares";

const notificationRoute = Router();

notificationRoute.get(
  "/notifications",
  authenticateToken,
  notificationController.getNotifications
);

export default notificationRoute;
