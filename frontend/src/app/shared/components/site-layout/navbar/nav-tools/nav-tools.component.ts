import { Component, ElementRef, HostListener, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../../../core/services/cart.service';
import { QuantityBtnComponent } from './quantity-btn/quantity-btn.component';

@Component({
  selector: 'app-nav-tools',
  standalone: true,
  imports: [RouterLink, QuantityBtnComponent],
  templateUrl: './nav-tools.component.html',
})
export class NavToolsComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  cartProducts = this.cartService.cartProducts;
  quantities = this.cartService.quantities;
  totalPrice = this.cartService.totalPrice;

  isCartOpen = signal(false);
  isMenuOpen = signal(false);

  menuLinks = [
    { path: '/store', label: 'Store' },
    { path: '/news', label: 'News' },
    { path: '/help', label: 'Help' },
    { path: '/contact', label: 'Contact' },
    { path: '/login', label: 'Sign In' },
  ];

  ngOnInit(): void {
    // TODO: thay bằng API thật; giữ demo data để khớp hành vi bản React cũ
    if (this.cartProducts().length === 0) {
      this.cartService.loadDemoProducts();
    }
  }

  toggleCart(): void {
    this.isCartOpen.update((v) => !v);
    if (this.isMenuOpen()) this.isMenuOpen.set(false);
    this.syncBodyScroll();
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  private syncBodyScroll(): void {
    document.body.style.overflow = this.isCartOpen() ? 'hidden' : 'auto';
    document.body.style.paddingRight = '0';
  }

  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (this.isCartOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isCartOpen.set(false);
      this.syncBodyScroll();
    }
  }

  handleQuantityChange(productId: number, newQuantity: number): void {
    this.cartService.updateQuantity(productId, newQuantity);
  }

  handleRemoveProduct(productId: number): void {
    this.cartService.removeProduct(productId);
  }

  handleCheckout(): void {
    this.isCartOpen.set(false);
    this.syncBodyScroll();
    this.router.navigate(['/cart'], {
      state: {
        cartProducts: this.cartProducts(),
        quantities: this.quantities(),
        totalPrice: this.totalPrice(),
      },
    });
  }

  truncateName(name: string, maxLength: number): string {
    return name.length > maxLength ? name.substring(0, maxLength - 3) + '...' : name;
  }
}