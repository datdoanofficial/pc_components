import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

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

/**
 * Ánh xạ nhãn hiển thị trên UI -> giá trị `category` thật sự lưu trong DB (Product.category).
 * - `null`  = nhãn này gộp nhiều loại sản phẩm, hiện tại show tất cả (vì mọi sp seed đều là PC Components).
 * - không có key trong map = nhãn này chưa có sản phẩm tương ứng trong DB (Desktop Computer, Monitors...
 *   là các loại sp bạn chưa seed), chọn vào sẽ hợp lý khi ra danh sách rỗng cho tới khi có data thật.
 * - có key = khớp trực tiếp với cột category trong bảng products.
 */
const CATEGORY_VALUE_MAP: Record<string, string | null> = {
  'PC Components': null,
  'CPUs / Processors': 'CPU',
  Motherboards: 'Mainboard',
  'GPUs / Graphics Cards': 'GPU',
  'Memory / RAM': 'RAM',
  'Hard Drives & SSDs': 'SSD',
  Cases: 'Case',
  'Power Supplies': 'PSU',
  'Fans & Cooling': 'Cooling',
  'Custom Liquid Cooling': 'Cooling',
};

const PRICE_MIN = 100;
const PRICE_MAX = 9990;

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
})
export class StoreComponent {
  private showcase01 = viewChild<ElementRef<HTMLElement>>('showcase01');
  private showcase02 = viewChild<ElementRef<HTMLElement>>('showcase02');
  private showcase03 = viewChild<ElementRef<HTMLElement>>('showcase03');
  private filterPanel = viewChild<ElementRef<HTMLElement>>('filterPanel');
  private priceTrack = viewChild<ElementRef<HTMLElement>>('priceTrack');

  private productService = inject(ProductService);

  // Danh sách sản phẩm thật lấy từ backend, thay cho mảng giả trước đây
  readonly allProducts = signal<Product[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly categoryFilters = CATEGORY_FILTERS;
  readonly componentFilters = COMPONENT_FILTERS;
  readonly priceMin = PRICE_MIN;
  readonly priceMax = PRICE_MAX;

  displayedCount = signal(9);
  activeFilterList1 = signal<string | null>(null);
  activeFilterList2 = signal<string | null>(null);
  isFilterVisible = signal(false);

  values = signal<[number, number]>([PRICE_MIN, PRICE_MAX]);

  // Lọc theo category (nếu có chọn) + khoảng giá đang chọn.
  // Ưu tiên filter danh sách dưới (Filter By - khớp component), nếu không chọn thì dùng danh sách trên (Categories).
  readonly filteredProducts = computed(() => {
    const [min, max] = this.values();
    const activeLabel = this.activeFilterList2() ?? this.activeFilterList1();

    return this.allProducts().filter((p) => {
      const inPriceRange = p.price >= min && p.price <= max;

      if (!activeLabel) {
        return inPriceRange;
      }

      // 'PC Components' -> null (show tất cả); nhãn khác chưa có mapping -> undefined (chưa có sp loại này)
      const mappedCategory = CATEGORY_VALUE_MAP[activeLabel];
      if (mappedCategory === null) {
        return inPriceRange;
      }
      if (mappedCategory === undefined) {
        return false;
      }
      return inPriceRange && p.category?.toLowerCase() === mappedCategory.toLowerCase();
    });
  });

  readonly visibleProducts = computed(() =>
    this.filteredProducts().slice(0, this.displayedCount()),
  );

  filterPositionClass = computed(() =>
    this.isFilterVisible() ? 'max-[640px]:right-0' : 'max-[640px]:-right-full',
  );

  // % vị trí của 2 chấm tròn trên track, tính theo CÙNG 1 công thức duy nhất
  // (không còn dùng linear-gradient riêng lẻ như trước -> đảm bảo luôn khớp với vị trí chấm tròn thật)
  readonly minPercent = computed(
    () => ((this.values()[0] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100,
  );
  readonly maxPercent = computed(
    () => ((this.values()[1] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100,
  );
  readonly rangeWidthPercent = computed(() => this.maxPercent() - this.minPercent());

  constructor() {
    // Gọi API lấy danh sách sản phẩm thật từ backend Spring Boot
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Không thể tải danh sách sản phẩm:', err);
        this.errorMessage.set('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        this.isLoading.set(false);
      },
    });

    // Parallax scroll + click-outside listeners chỉ chạy trên browser
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
    this.activeFilterList2.set(null); // chỉ 1 filter category active tại 1 thời điểm
    this.displayedCount.set(9);
  }

  handleFilterClickList2(filter: string): void {
    this.activeFilterList2.update((prev) => (prev === filter ? null : filter));
    this.activeFilterList1.set(null); // chỉ 1 filter category active tại 1 thời điểm
    this.displayedCount.set(9);
  }

  handleLoadMore(): void {
    this.displayedCount.update((count) => count + 9);
  }

  toggleFilter(): void {
    this.isFilterVisible.update((v) => !v);
    document.body.style.overflow = this.isFilterVisible() ? 'hidden' : 'unset';
  }

  closeFilter(): void {
    this.isFilterVisible.set(false);
    document.body.style.overflow = 'unset';
  }

  private readonly MIN_GAP = 100;
  private readonly STEP = 50;

  /** Kéo 1 trong 2 chấm tròn trên thanh giá. Gọi từ (pointerdown) trên chấm tròn. */
  startPriceDrag(event: PointerEvent, thumb: 'min' | 'max'): void {
    event.preventDefault();
    const track = this.priceTrack()?.nativeElement;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    document.body.style.userSelect = 'none';

    const updateFromClientX = (clientX: number) => {
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const rawValue = PRICE_MIN + ratio * (PRICE_MAX - PRICE_MIN);
      const stepped = Math.round(rawValue / this.STEP) * this.STEP;

      const [min, max] = this.values();
      if (thumb === 'min') {
        // Không bao giờ vượt quá (max - MIN_GAP), không bao giờ thấp hơn PRICE_MIN
        const next = Math.min(Math.max(stepped, PRICE_MIN), max - this.MIN_GAP);
        this.values.set([next, max]);
      } else {
        // Không bao giờ thấp hơn (min + MIN_GAP), không bao giờ vượt quá PRICE_MAX
        const next = Math.max(Math.min(stepped, PRICE_MAX), min + this.MIN_GAP);
        this.values.set([min, next]);
      }
    };

    const onPointerMove = (moveEvent: PointerEvent) => updateFromClientX(moveEvent.clientX);

    const onPointerUp = () => {
      document.body.style.userSelect = '';
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
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
