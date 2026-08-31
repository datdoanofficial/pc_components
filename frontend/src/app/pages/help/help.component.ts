import { Component, ElementRef, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface SupportItem {
  title: string;
  iconClass: string;
  bgClass: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent {
  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  line01_items: SupportItem[] = [
    {
      title: 'Service & repair',
      iconClass: 'mdi--account-service',
      bgClass: "bg-[url('/images/help-page/service_repair.webp')]",
    },
    {
      title: 'Report Issue',
      iconClass: 'ic--round-report',
      bgClass: "bg-[url('/images/help-page/report_issue.webp')]",
    },
    {
      title: 'Ordering',
      iconClass: 'solar--bill-list-bold',
      bgClass: "bg-[url('/images/help-page/ordering.webp')]",
    },
  ];

  line02_items: SupportItem[] = [
    {
      title: 'Shipping',
      iconClass: 'ic--round-local-shipping',
      bgClass: "bg-[url('/images/help-page/shipping.webp')]",
    },
    {
      title: 'Products',
      iconClass: 'solar--box-bold',
      bgClass: "bg-[url('/images/help-page/product.webp')]",
    },
    {
      title: 'Returns (RMA)',
      iconClass: 'material-symbols--autorenew-rounded',
      bgClass: "bg-[url('/images/help-page/returns.webp')]",
    },
    {
      title: 'Promotions',
      iconClass: 'iconamoon--discount-fill',
      bgClass: "bg-[url('/images/help-page/discount.webp')]",
    },
    {
      title: 'Website',
      iconClass: 'iconoir--www',
      bgClass: "bg-[url('/images/help-page/website.webp')]",
    },
  ];

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isBrowser) return;

    const glowLines = this.el.nativeElement.querySelectorAll(
      '.glow-line-top, .glow-line-bottom',
    ) as NodeListOf<HTMLElement>;

    glowLines.forEach((line) => {
      const rect = line.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      line.style.setProperty('--x', `${x}px`);
      line.style.setProperty('--y', `${y}px`);
    });
  }
}
