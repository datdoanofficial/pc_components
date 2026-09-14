import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

const API_BASE_URL = 'http://localhost:8080/api/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  /** Lấy toàn bộ sản phẩm, có thể lọc theo category (khớp @RequestParam ở backend) */
  getProducts(category?: string): Observable<Product[]> {
    const url = category
      ? `${API_BASE_URL}?category=${encodeURIComponent(category)}`
      : API_BASE_URL;
    return this.http.get<Product[]>(url);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_BASE_URL}/${id}`);
  }
}
