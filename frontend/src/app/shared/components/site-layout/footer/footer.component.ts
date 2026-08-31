import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnDestroy {
  @ViewChild('footerRef') footerRef!: ElementRef<HTMLDivElement>;

  private router = inject(Router);
  private routerSub: Subscription | null = null;
  private scrollHandler = () => this.handleScroll();

  headerFooterHeight = signal('0rem');

  constructor() {
    // Toàn bộ thao tác đụng tới window/scroll chỉ chạy ở browser,
    // tránh lỗi/không gắn được listener khi component render qua SSR.
    afterNextRender(() => {
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      window.addEventListener('resize', this.scrollHandler);
      this.handleScroll();

      this.routerSub = this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => this.handleScroll());
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.scrollHandler);
  }

  private handleScroll(): void {
    const footerEl = this.footerRef?.nativeElement;
    if (!footerEl) return;

    // getBoundingClientRect() luôn chính xác theo viewport, không phụ thuộc
    // offsetParent — an toàn với mọi kiểu position (absolute/relative/static).
    const rect = footerEl.getBoundingClientRect();
    const footerOffsetTop = rect.top + window.scrollY;
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const maxScroll = 600;

    if (scrollPosition + windowHeight >= footerOffsetTop) {
      const scrollRatio = Math.min(
        (scrollPosition + windowHeight - footerOffsetTop) / maxScroll,
        1,
      );
      const height = 6 * scrollRatio;
      this.headerFooterHeight.set(`${height}rem`);
    } else {
      this.headerFooterHeight.set('0rem');
    }
  }
}
