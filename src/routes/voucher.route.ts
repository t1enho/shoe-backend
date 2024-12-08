import { Router } from "express";
import { voucherController } from "~/controllers";
import { authenticateToken } from "~/middlewares";

const voucherRoute = Router();

voucherRoute.get("/vouchers", authenticateToken, voucherController.getVouchers);

voucherRoute.post(
  "/vouchers",
  //   authenticateToken,
  voucherController.createVoucher
);

voucherRoute.post(
  "/check-discount",
  //   authenticateToken,
  voucherController.checkDiscount
);

export default voucherRoute;
