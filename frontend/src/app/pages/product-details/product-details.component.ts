import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-details-page px-[8vw] py-[200px] text-[#e5e5e5] bg-black min-h-screen">
      <div class="section-01 grid grid-cols-1 lg:grid-cols-[2.5fr_1.3fr] gap-[4vw] mb-[6vw]">
        <!-- Thumbnails & Main Image -->
        <div class="thumbnails grid grid-cols-[0.45fr_2fr] gap-[1.5vw]">
          <div class="image-items flex flex-col gap-[1.5vw]">
            <div
              *ngFor="let src of imageSources; let i = index"
              (click)="handleItemClick(i)"
              [class.opacity-100]="i === activeIndex"
              class="item relative overflow-hidden aspect-square flex justify-center items-center rounded-[20px] cursor-pointer border border-[#1a1a1a] bg-[#101010] opacity-50 hover:opacity-100 transition-opacity"
            >
              <img
                [src]="src"
                class="w-full h-full object-cover absolute inset-0 rounded-[20px]"
                alt="Thumbnail"
              />
            </div>
          </div>

          <div
            class="main-item relative flex justify-center items-center rounded-[20px] bg-[#101010] overflow-hidden"
          >
            <img
              #mainImage
              [src]="imageSources[activeIndex]"
              class="w-full h-full object-cover"
              alt="Active Product"
            />
          </div>
        </div>

        <!-- Product Information -->
        <div class="product-information">
          <div class="product-heading flex justify-between text-[1.5vw] font-medium">
            <div class="name">AORUS GeForce RTX™ 4080 16GB XTREME WATERFORCE WB</div>
            <div class="flex items-center justify-center wishlist-btn cursor-pointer text-[1.2em]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2em"
                height="1.2em"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.99.99 0 0 0 1.024 0C21.126 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3s-5 3-5 3s-2.239-3-5-3"
                />
              </svg>
            </div>
          </div>

          <div class="product-reviews flex items-center mt-[1.6vw] cursor-pointer text-[#ffc107]">
            <span
              *ngFor="let _ of [0, 1, 2, 3, 4]; let i = index"
              (click)="handleStarClick(i + 1)"
              [class.text-white]="i < rating"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.6em"
                height="0.6em"
                viewBox="0 0 1024 1024"
              >
                <path d="M0 0h1024v1024H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="m908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5c-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1l-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2c17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9l183.7-179.1c5-4.9 8.3-11.3 9.3-18.3c2.7-17.5-9.5-33.7-27-36.3"
                />
              </svg>
            </span>
            <span class="total-reviews ml-[5px] text-[1vw] text-[#8a8a8a]"
              >({{ totalRatings }}) reviews</span
            >
          </div>

          <div class="general-in4 mt-[1.7vw] space-y-[1.5vw] text-[1.1vw] font-light">
            <div class="text-[1vw] font-medium text-white mb-[20px]">General Information:</div>
            <div><span class="text-[#8a8a8a]">Brand:</span> GIGABYTE</div>
            <div><span class="text-[#8a8a8a]">Product Code:</span> GV-N4080AORUSX WB-16GD</div>
            <div><span class="text-[#8a8a8a]">Guarantee:</span> 36 Months</div>
          </div>

          <div
            class="add-to-cart w-full h-[4.3vw] mt-[2vw] flex justify-center items-center border border-[#2a2a2a] rounded-full uppercase text-[1vw] cursor-pointer hover:bg-[#1a1a1a] transition-colors duration-300"
          >
            Add to Cart
          </div>
          <div
            class="buy-now w-full h-[4.3vw] mt-[1.5vw] flex justify-center items-center bg-[var(--primary-color)] rounded-full uppercase text-[1vw] cursor-pointer hover:bg-[var(--hover-color)] transition-colors duration-300"
          >
            Buy now
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .product-details-page {
        font-family: 'Open Sans', sans-serif;
      }
    `,
  ],
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('mainImage') mainImage!: ElementRef;

  activeIndex = 0;
  rating = 0;
  imageSources = [
    '/images/products/product_demo_01.webp',
    '/images/products/product_demo_02.webp',
    '/images/products/product_demo_03.webp',
    '/images/products/product_demo_04.webp',
  ];
  ratings: { [key: number]: number } = { 5: 120, 4: 80, 3: 180, 2: 30, 1: 12 };
  totalRatings = Object.values(this.ratings).reduce((a, b) => a + b, 0);

  ngOnInit(): void {}
  ngAfterViewInit(): void {}

  handleItemClick(index: number) {
    if (index === this.activeIndex) return;
    const direction = index > this.activeIndex ? 30 : -30;
    this.activeIndex = index;

    if (this.mainImage) {
      gsap.fromTo(
        this.mainImage.nativeElement,
        { x: direction, opacity: 0.4 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      );
    }
  }

  handleStarClick(index: number) {
    this.rating = index;
  }
}
