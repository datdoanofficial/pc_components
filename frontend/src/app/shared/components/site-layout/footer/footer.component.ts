import { Component, ElementRef, HostListener, OnDestroy, ViewChild, inject, signal } from '@angular/core';
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
  @ViewChild('headerFooterRef') headerFooterRef!: ElementRef<HTMLDivElement>;

  private router = inject(Router);
  private routerSub: Subscription;

  headerFooterHeight = signal('0rem');

  constructor() {
    // Tương đương useEffect chạy lại mỗi khi location đổi (React cũ)
    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.handleScroll());
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  @HostListener('window:scroll')
  handleScroll(): void {
    const footerEl = this.footerRef?.nativeElement;
    if (!footerEl) return;

    const scrollPosition = window.scrollY;
    const footerOffsetTop = footerEl.offsetTop;
    const windowHeight = window.innerHeight;
    const maxScroll = 600;

    if (scrollPosition + windowHeight >= footerOffsetTop) {
      const scrollRatio = Math.min((scrollPosition + windowHeight - footerOffsetTop) / maxScroll, 1);
      const multiplier = 6; // giống bản gốc: cả 3 mốc width đều dùng chung giá trị 6
      const height = multiplier * scrollRatio;
      this.headerFooterHeight.set(`${height}rem`);
    } else {
      this.headerFooterHeight.set('0');
    }
  }
}