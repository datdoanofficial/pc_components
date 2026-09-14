export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  description: string;
  specifications: string; // JSON string, parse với JSON.parse() nếu cần hiển thị dạng bảng
}
