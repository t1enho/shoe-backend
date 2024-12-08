export const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const calculateDiscount = (amount: number, voucher: any) => {
  // Kiểm tra nếu voucher không tồn tại hoặc đã hết lượt sử dụng
  if (!voucher) {
    return 0; // Không có voucher thì không giảm giá
  }

  if (voucher.timesUsed >= voucher.limit) {
    return 0; // Voucher hết lượt sử dụng
  }

  // Kiểm tra nếu giá trị đơn hàng nhỏ hơn giá trị tối thiểu của voucher
  if (amount < voucher.minOrderValue) {
    return 0; // Không đủ điều kiện giảm giá
  }

  // Tính toán giá trị giảm giá, lấy giá trị nhỏ nhất giữa giá trị đơn hàng và giá trị giảm giá tối đa của voucher
  const discount = Math.min(amount, voucher.max);

  return discount; // Trả về giá trị giảm giá
};
