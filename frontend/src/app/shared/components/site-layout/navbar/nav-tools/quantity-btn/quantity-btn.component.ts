import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-quantity-btn',
  standalone: true,
  templateUrl: './quantity-btn.component.html',
})
export class QuantityBtnComponent {
  initialQuantity = input.required<number>();
  showTitle = input<boolean>(true);
  quantityChange = output<number>();

  quantity = signal(1);

  constructor() {
    // Đồng bộ khi initialQuantity từ ngoài đổi (giống useEffect([initialQuantity]) bên React)
    effect(() => {
      this.quantity.set(this.initialQuantity());
    });
  }

  handleMinusClick(): void {
    const newQuantity = Math.max(1, this.quantity() - 1);
    this.quantity.set(newQuantity);
    this.quantityChange.emit(newQuantity);
  }

  handlePlusClick(): void {
    const newQuantity = this.quantity() + 1;
    this.quantity.set(newQuantity);
    this.quantityChange.emit(newQuantity);
  }
}