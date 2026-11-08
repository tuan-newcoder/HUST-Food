/**
 * Định dạng số tiền sang chuẩn tiền tệ Việt Nam (VNĐ)
 * @param amount Số tiền (number)
 * @returns Chuỗi tiền tệ, ví dụ: 45.000 ₫
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

