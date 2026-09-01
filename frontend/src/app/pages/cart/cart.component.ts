import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { QuantityBtnComponent } from '../../shared/components/site-layout/navbar/nav-tools/quantity-btn/quantity-btn.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [QuantityBtnComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private cartService = inject(CartService);

  cartProducts = this.cartService.cartProducts;
  quantities = this.cartService.quantities;
  totalPrice = this.cartService.totalPrice;

  handleQuantityChange(productId: number, newQuantity: number): void {
    this.cartService.updateQuantity(productId, newQuantity);
  }

  handleRemoveProduct(productId: number): void {
    this.cartService.removeProduct(productId);
  }
}
