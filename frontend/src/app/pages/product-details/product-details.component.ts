import { Component, OnInit, OnDestroy } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  activeIndex = 0;
  animationDirection = '';
  rating = 0;
  activeTab = 'key-feature';
  hoveredRating = 0;
  expandedReviewIndex: number | null = null;

  imageSources = [
    '/images/products/product_demo_01.webp',
    '/images/products/product_demo_02.webp',
    '/images/products/product_demo_03.webp',
    '/images/products/product_demo_04.webp',
  ];

  ratings: { [key: number]: number } = { 5: 120, 4: 80, 3: 180, 2: 30, 1: 12 };
  totalRatings = Object.values(this.ratings).reduce((a, b) => a + b, 0);

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  handleTabClick(tab: string): void {
    this.activeTab = tab;
    setTimeout(() => {
      gsap.from('.product-description', { opacity: 0, y: 10, duration: 0.4 });
    }, 10);
  }

  handleItemClick(index: number): void {
    if (index === this.activeIndex) return;
    this.animationDirection = index > this.activeIndex ? 'translate-x-2' : '-translate-x-2';
    this.activeIndex = index;

    gsap.from('.main-item', { scale: 0.98, opacity: 0.8, duration: 0.3 });
    setTimeout(() => {
      this.animationDirection = '';
    }, 500);
  }

  handleStarClick(index: number): void {
    this.rating = index;
  }
}
