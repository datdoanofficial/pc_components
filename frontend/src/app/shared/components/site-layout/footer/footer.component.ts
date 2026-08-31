import {
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private routerSub: Subscription | null = null;
  private scrollHandler = () => this.handleScroll();

  headerFooterHeight = signal('0rem');

  constructor() {
    if (!this.isBrowser) return;

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

    if (!this.isBrowser || typeof window === 'undefined') return;

    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.scrollHandler);
  }

  private handleScroll(): void {
    if (!this.isBrowser || typeof window === 'undefined') return;

    const footerEl = this.footerRef?.nativeElement;
    if (!footerEl) return;

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
