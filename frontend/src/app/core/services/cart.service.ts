import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  guarantee: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _cartProducts = signal<Product[]>([]);
  private _quantities = signal<number[]>([]);

  cartProducts = this._cartProducts.asReadonly();
  quantities = this._quantities.asReadonly();

  totalPrice = computed(() =>
    this._cartProducts().reduce(
      (total, product, index) => total + product.price * (this._quantities()[index] ?? 0),
      0,
    ),
  );

  addProduct(product: Product, quantity: number): void {
    const existingIndex = this._cartProducts().findIndex((p) => p.id === product.id);
    if (existingIndex !== -1) {
      const newQuantities = [...this._quantities()];
      newQuantities[existingIndex] += quantity;
      this._quantities.set(newQuantities);
    } else {
      this._cartProducts.update((products) => [...products, product]);
      this._quantities.update((qtys) => [...qtys, quantity]);
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    const index = this._cartProducts().findIndex((p) => p.id === productId);
    if (index !== -1) {
      const newQuantities = [...this._quantities()];
      newQuantities[index] = quantity;
      this._quantities.set(newQuantities);
    }
  }

  removeProduct(productId: number): void {
    const index = this._cartProducts().findIndex((p) => p.id === productId);
    if (index !== -1) {
      this._cartProducts.update((products) => products.filter((p) => p.id !== productId));
      this._quantities.update((qtys) => qtys.filter((_, i) => i !== index));
    }
  }

  loadDemoProducts(): void {
    const demoProducts: Product[] = [
      {
        id: 1,
        image: '/images/product-details/4070ti-demo.webp',
        name: 'ZOTAC Gaming GeForce RTX 4070 Ti Trinity OC White Edition',
        brand: 'Gigabyte',
        guarantee: '36 Months',
        price: 719.99,
      },
      {
        id: 2,
        image: '/images/product-details/4090-demo.webp',
        name: 'ASUS ROG Strix GeForce RTX™ 4090 White OC Ed',
        brand: 'ASUS ROG',
        guarantee: '36 Months',
        price: 2099.99,
      },
      {
        id: 3,
        image: '/images/product-details/4090msi-demo.webp',
        name: 'MSI GeForce RTX 4090 GAMING X TRIO 24G',
        brand: 'MSI',
        guarantee: '36 Months',
        price: 1899.99,
      },
      {
        id: 4,
        image: '/images/product-details/4080wf.webp',
        name: 'AORUS GeForce RTX™ 4080 16GB XTREME WATERFORCE WB',
        brand: 'AORUS',
        guarantee: '36 Months',
        price: 1499.0,
      },
      {
        id: 5,
        image: '/images/product-details/4080wf.webp',
        name: 'AORUS GeForce RTX™ 4080 16GB XTREME WATERFORCE WB',
        brand: 'AORUS',
        guarantee: '36 Months',
        price: 1499.0,
      },
    ];
    this._cartProducts.set(demoProducts);
    this._quantities.set(demoProducts.map(() => 1));
  }
}
