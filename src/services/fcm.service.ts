import * as admin from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
const sendSignupNotification = async (token: string) => {
  const message = {
    notification: {
      title: "Chào mừng đến với Wahoo!",
      body: "Cảm ơn bạn đã đăng ký. Khám phá các tính năng của chúng tôi ngay bây giờ!",
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendPushNotify = async (message: Message) => {
  try {
    await admin.messaging().send(message);
  } catch (error) {}
};

export const fcmService = {
  sendSignupNotification,
  sendPushNotify,
};
