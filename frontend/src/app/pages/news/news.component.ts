import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { TiltDirective } from '../../shared/directives/tilt.directive';

interface NewsItem {
  date: string;
  title: string;
  content: string;
}

const LOREM =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

const HOT_TOPICS: NewsItem[] = [
  { date: 'April 20, 2024', title: 'UNTITLED', content: LOREM },
  { date: 'April 05, 2024', title: 'UNTITLED', content: LOREM },
];

const NEWS_LIST: NewsItem[] = Array.from({ length: 5 }, () => ({
  date: 'April 05, 2024',
  title: 'UNTITLED',
  content: LOREM,
}));

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterLink, TiltDirective],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements AfterViewInit {
  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly hotTopics = HOT_TOPICS;
  readonly newsList = NEWS_LIST;

  private targetEl!: HTMLElement;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return; // Bỏ qua nếu chạy ở Server Side

    this.targetEl =
      (this.el.nativeElement.querySelector('.news-body') as HTMLElement) || this.el.nativeElement;

    gsap.from('.hot-topic .topic', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power3.out',
    });

    gsap.from('.news-list .news', {
      opacity: 0,
      y: 16,
      duration: 0.5,
      stagger: 0.08,
      delay: 0.2,
      ease: 'power3.out',
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isBrowser) return;

    const glowLines = this.el.nativeElement.querySelectorAll('.glow-line') as NodeListOf<HTMLElement>;

    glowLines.forEach((line) => {
      const rect = line.getBoundingClientRect();
      // Tính x, y tương đối so với chính thanh border đó
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      line.style.setProperty('--x', `${x}px`);
      line.style.setProperty('--y', `${y}px`);
    });
  }
}
