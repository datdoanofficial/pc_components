import { Component, ElementRef, afterNextRender, computed, signal, viewChild } from '@angular/core';
import gsap from 'gsap';

interface DemoProduct {
  name: string;
  price: string;
  logo: string;
  image: string;
}

const DEMO_PRODUCT: DemoProduct = {
  name: 'AORUS GeForce RTX™ 4080 16GB XTREME WATERFORCE',
  price: '$1499.00',
  logo: '/images/products/prd_logo_demo.webp',
  image: '/images/products/aorus_geforce_rtx4080_xtreme_waterforce.webp',
};

const CATEGORY_FILTERS = [
  'Desktop Computer',
  'PC Components',
  'Gaming Peripherals',
  'Ergonomic & Gaming Chairs',
  'PlayStation & Xbox Consoles',
  'Laptops & Notebook',
  'Monitors',
];

const COMPONENT_FILTERS = [
  'CPUs / Processors',
  'Motherboards',
  'GPUs / Graphics Cards',
  'Memory / RAM',
  'Hard Drives & SSDs',
  'Cases',
  'Power Supplies',
  'Fans & Cooling',
  'Custom Liquid Cooling',
];

const PRICE_MIN = 100;
const PRICE_MAX = 9990;

@Component({
  selector: 'app-store',
  standalone: true,
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
})
export class StoreComponent {
  private showcase01 = viewChild<ElementRef<HTMLElement>>('showcase01');
  private showcase02 = viewChild<ElementRef<HTMLElement>>('showcase02');
  private showcase03 = viewChild<ElementRef<HTMLElement>>('showcase03');
  private filterPanel = viewChild<ElementRef<HTMLElement>>('filterPanel');

  readonly product = DEMO_PRODUCT;
  readonly items = Array.from({ length: 20 });
  readonly categoryFilters = CATEGORY_FILTERS;
  readonly componentFilters = COMPONENT_FILTERS;
  readonly priceMin = PRICE_MIN;
  readonly priceMax = PRICE_MAX;

  displayedItems = signal(9);
  activeFilterList1 = signal<string | null>(null);
  activeFilterList2 = signal<string | null>(null);
  isFilterVisible = signal(false);

  values = signal<[number, number]>([100, 9900]);

  filterPositionClass = computed(() =>
    this.isFilterVisible() ? 'max-[640px]:right-0' : 'max-[640px]:-right-full',
  );

  trackBackground = computed(() => {
    const [min, max] = this.values();
    const minPct = ((min - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
    const maxPct = ((max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
    return `linear-gradient(to right, #fff 0%, #fff ${minPct}%, #eb7e63 ${minPct}%, #eb7e63 ${maxPct}%, #fff ${maxPct}%, #fff 100%)`;
  });

  constructor() {
    // Parallax scroll + click-outside listeners only make sense in the browser
    // (this project renders with Angular SSR), so we set them up post-render.
    afterNextRender(() => {
      const handleScroll = () => {
        const value = window.scrollY;
        const s1 = this.showcase01()?.nativeElement;
        const s2 = this.showcase02()?.nativeElement;
        const s3 = this.showcase03()?.nativeElement;
        if (s1) s1.style.right = value * 0.06 + 'px';
        if (s2) s2.style.left = value * 0.06 + 'px';
        if (s3) s3.style.right = value * 0.06 + 'px';
      };
      window.addEventListener('scroll', handleScroll, { passive: true });

      const handleClickOutside = (event: MouseEvent) => {
        const panel = this.filterPanel()?.nativeElement;
        if (this.isFilterVisible() && panel && !panel.contains(event.target as Node)) {
          this.closeFilter();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
    });
  }

  handleFilterClickList1(filter: string): void {
    this.activeFilterList1.update((prev) => (prev === filter ? null : filter));
  }

  handleFilterClickList2(filter: string): void {
    this.activeFilterList2.update((prev) => (prev === filter ? null : filter));
  }

  handleLoadMore(): void {
    this.displayedItems.update((count) => count + 9);
  }

  toggleFilter(): void {
    this.isFilterVisible.update((v) => !v);
    document.body.style.overflow = this.isFilterVisible() ? 'hidden' : 'unset';
  }

  closeFilter(): void {
    this.isFilterVisible.set(false);
    document.body.style.overflow = 'unset';
  }

  handleMinRangeInput(raw: string): void {
    const next = Number(raw);
    const [, max] = this.values();
    if (max - next >= 1000) {
      this.values.set([next, max]);
    }
  }

  handleMaxRangeInput(raw: string): void {
    const next = Number(raw);
    const [min] = this.values();
    if (next - min >= 1000) {
      this.values.set([min, next]);
    }
  }

  handleMinInputChange(raw: string): void {
    const minValue = Number(raw);
    const [, max] = this.values();
    if (minValue <= max - 100) {
      this.values.set([minValue, max]);
    } else {
      this.values.set([minValue, minValue + 100]);
    }
  }

  handleMaxInputChange(raw: string): void {
    const maxValue = Number(raw);
    const [min] = this.values();
    if (maxValue >= min + 100) {
      this.values.set([min, maxValue]);
    } else {
      this.values.set([maxValue - 100, maxValue]);
    }
  }

  /** Product card hover: slide the "Add to cart" button up, driven by GSAP for a smooth ease. */
  onCardEnter(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const btn = card.querySelector<HTMLElement>('.add-to-cart-btn');
    if (!btn) return;
    gsap.to(btn, { bottom: '6%', duration: 0.45, ease: 'power2.out', overwrite: true });
  }

  onCardLeave(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const btn = card.querySelector<HTMLElement>('.add-to-cart-btn');
    if (!btn) return;
    gsap.to(btn, { bottom: '-20%', duration: 0.35, ease: 'power2.in', overwrite: true });
  }
}
