import { RequestHandler } from "express";
import { VoucherModel } from "~/models";
import { createError, createSuccess } from "~/utils";

const createVoucher: RequestHandler = async (req, res, next) => {
  const { code, description, limit, timesUsed, min, max, minOrderValue } =
    req.body;
  try {
    const voucherExists = await VoucherModel.findOne({ where: { code } });

    if (voucherExists) {
      return createError(res, {
        message: "Mã này đã tồn tại",
      });
    }
    const newVoucher = await VoucherModel.create({
      code,
      description,
      limit,
      //   timesUsed,
      min,
      max,
      minOrderValue,
    });

    return createSuccess(res, {
      data: newVoucher.toJSON(),
    });
  } catch (error) {}
};

const getVouchers: RequestHandler = async (req, res, next) => {
  try {
    const vouchers = await VoucherModel.findAll();
    return createSuccess(res, {
      data: vouchers,
    });
  } catch (error) {}
};

const checkDiscount: RequestHandler = async (req, res, next) => {
  const { code, amount } = req.body;
  try {
    const voucher = (await VoucherModel.findOne({ where: { code } })) as any;
    if (!voucher) {
      return createError(res, {
        message: "Voucher không tồn tại",
      });
    }
    if (voucher?.timesUsed >= voucher?.limit) {
      return createError(res, {
        message: "Voucher đã hết lượt sử dụng",
      });
    }
    if (amount < voucher.minOrderValue) {
      return createError(res, {
        message: `Giá trị đơn hàng không đủ điều kiện. Yêu cầu tối thiểu: ${voucher.minOrderValue}.`,
      });
    }
    const discount = Math.min(amount, voucher.max);
    return createSuccess(res, {
      data: {
        ...voucher.toJSON(),
        discount,
      },
      message: `Bạn được giảm ${discount} tiền.`,
    });
  } catch (error) {}
};
export const voucherController = {
  createVoucher,
  getVouchers,
  checkDiscount,
};
