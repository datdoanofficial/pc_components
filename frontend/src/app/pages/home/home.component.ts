import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  QueryList,
  computed,
  signal,
} from '@angular/core';
import gsap from 'gsap';

interface ContentItem {
  title: string;
  character?: string;
  title1?: string;
  description: string;
}

interface NumberStep {
  fromY: number | null;
  toY: number;
  fade?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private floatTween: gsap.core.Tween | null = null;

  @ViewChild('headingEl') headingEl?: ElementRef<HTMLElement>;
  @ViewChild('imgEl') imgEl?: ElementRef<HTMLImageElement>;
  @ViewChildren('numberEl') numberEls?: QueryList<ElementRef<HTMLElement>>;

  activeIndex = signal(3);
  animationDirection = signal<'up' | 'down'>('up');

  private images = [
    '/images/landing-page/pc-aio.webp',
    '/images/landing-page/laptop.webp',
    '/images/landing-page/keyboard.webp',
    '/images/landing-page/ps.webp',
    '/images/landing-page/chair.webp',
  ];

  currentImage = computed(() => this.images[(this.activeIndex() + 2) % 5]);

  private numbers = [1, 2, 3, 4, 5];
  sortedNumbers = computed(() => {
    const idx = this.activeIndex();
    return [...this.numbers.slice(idx), ...this.numbers.slice(0, idx)];
  });

  content = computed<ContentItem>(() => {
    switch (this.activeIndex()) {
      case 0:
        return {
          title: 'Computer Pheripherals',
          description:
            'Think of computer peripherals as anything that connects to your computer system to add functionality for work or entertainment. Most computer peripherals are available at Next In.',
        };
      case 1:
        return {
          title: 'Playstation',
          character: '&',
          title1: 'XBOX Consoles',
          description:
            'Gaming has revolutionized the way people relax. No matter your age or where you are from, all you need is a console, and you can play entertaining video games in a matter of seconds. ',
        };
      case 2:
        return {
          title: 'Ergonomic',
          character: '&',
          title1: 'Gaming Chairs',
          description:
            'You can choose the best computer chairs offer features that enhance comfort and ergonomics while working at a computer for long hours  and every user can sit comfortably at work.',
        };
      case 3:
        return {
          title: 'Desktop Computers',
          description:
            'Buying a desktop computer has never been easier at Next In. From gaming, all-in-ones or workstations and servers, we have a large selection of desktops that will be right for you.',
        };
      case 4:
        return {
          title: 'Laptops',
          character: '&',
          title1: 'Notebooks',
          description:
            'You will discover a wide assortment of laptops at impressive offers. Next In will help you find the best laptop for you with our selection of laptop computers for work & play.',
        };
      default:
        return {
          title: 'Desktop Computers',
          description:
            'Buying a desktop computer has never been easier at Next In. From gaming, all-in-ones or workstations and servers, we have a large selection of desktops that will be right for you.',
        };
    }
  });

  // Tất cả điểm đến (toY) đều phải trượt về 0px/0% tuyệt đối
  private readonly UP_STEPS: NumberStep[] = [
    { fromY: 100, toY: 0 }, // slot 0: trượt từ dưới lên 0
    { fromY: 100, toY: 0 }, // slot 1: trượt từ dưới lên 0
    { fromY: 100, toY: 0 }, // slot 2 (active): trượt từ dưới lên 0
    { fromY: 100, toY: 0 }, // slot 3: trượt từ dưới lên 0
    { fromY: null, toY: 0, fade: true }, // slot 4: mờ dần vào
  ];

  private readonly DOWN_STEPS: NumberStep[] = [
    { fromY: null, toY: 0, fade: true }, // slot 0: mờ dần vào
    { fromY: -100, toY: 0 }, // slot 1: trượt từ trên xuống 0
    { fromY: -100, toY: 0 }, // slot 2 (active): trượt từ trên xuống 0
    { fromY: -100, toY: 0 }, // slot 3: trượt từ trên xuống 0
    { fromY: -100, toY: 0 }, // slot 4: trượt từ trên xuống 0
  ];

  ngOnInit(): void {
    this.startInterval();
  }

  ngAfterViewInit(): void {
    this.animateHeading('up', true);
    this.animateImageTransition('up', true);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.floatTween?.kill();
  }

  private startInterval(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.transitionTo((this.activeIndex() + 1) % 5, 'up');
    }, 8000);
  }

  handleLeftClick(): void {
    this.transitionTo((this.activeIndex() - 1 + 5) % 5, 'down');
    this.startInterval();
  }

  handleRightClick(): void {
    this.transitionTo((this.activeIndex() + 1) % 5, 'up');
    this.startInterval();
  }

  private transitionTo(newIndex: number, dir: 'up' | 'down'): void {
    this.activeIndex.set(newIndex);
    this.animationDirection.set(dir);

    // Chờ Angular render nội dung mới rồi mới animate
    requestAnimationFrame(() => {
      this.animateNumbers(dir);
      this.animateHeading(dir);
      this.animateImageTransition(dir);
    });
  }

  // ---------- GSAP ----------

  private animateHeading(dir: 'up' | 'down', first = false): void {
    if (!this.headingEl) return;
    const fromY = first ? 24 : dir === 'up' ? 28 : -28;
    gsap.fromTo(
      this.headingEl.nativeElement,
      { y: fromY, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', overwrite: 'auto' },
    );
  }

  private animateImageTransition(dir: 'up' | 'down', first = false): void {
    if (!this.imgEl) return;
    const el = this.imgEl.nativeElement;

    this.floatTween?.kill();
    gsap.set(el, { clearProps: 'all' });

    const fromY = first ? 40 : dir === 'up' ? 34 : -34;
    gsap.fromTo(
      el,
      { y: fromY, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        overwrite: 'auto',
        onComplete: () => this.startFloatingImage(),
      },
    );
  }

  private startFloatingImage(): void {
    if (!this.imgEl) return;

    gsap.set(this.imgEl.nativeElement, {
      willChange: 'transform',
      force3D: true,
    });

    this.floatTween = gsap.to(this.imgEl.nativeElement, {
      y: -10,
      duration: 1.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private animateNumbers(dir: 'up' | 'down'): void {
    if (!this.numberEls) return;

    const steps = dir === 'up' ? this.UP_STEPS : this.DOWN_STEPS;

    this.numberEls.forEach((ref, i) => {
      const p = ref.nativeElement.querySelector('p');
      const step = steps[i];

      if (!p || !step) return;

      if (step.fade) {
        gsap.fromTo(
          p,
          { opacity: 0, scale: 0.7, yPercent: dir === 'up' ? 60 : -60 },
          {
            opacity: 1,
            scale: 1,
            yPercent: 0,
            duration: 1,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => {
              gsap.set(p, { yPercent: 0, scale: 1, opacity: 1 });
            },
          },
        );
      } else {
        gsap.fromTo(
          p,
          {
            yPercent: step.fromY as number,
            opacity: 1,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => {
              gsap.set(p, { yPercent: 0, y: 0, opacity: 1 });
            },
          },
        );
      }
    });
  }
}
