export function formatPrice(price: string | number) {
  return `${Number(price).toLocaleString("vi-VN")} đ`;
}
