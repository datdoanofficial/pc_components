import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  afterNextRender,
  inject,
  input,
} from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective {
  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  appTiltMax = input(6); // độ nghiêng tối đa (deg)
  appTiltMaxGlare = input(0.5); // độ sáng glare tối đa (0-1)

  private glareEl: HTMLElement | null = null;
  private setRotateX = gsap.quickTo(this.el.nativeElement, 'rotationX', {
    duration: 0.5,
    ease: 'power3',
  });
  private setRotateY = gsap.quickTo(this.el.nativeElement, 'rotationY', {
    duration: 0.5,
    ease: 'power3',
  });
  private setScale = gsap.quickTo(this.el.nativeElement, 'scale', {
    duration: 0.5,
    ease: 'power3',
  });

  constructor() {
    afterNextRender(() => {
      const host = this.el.nativeElement;
      this.renderer.setStyle(host, 'position', 'relative');
      this.renderer.setStyle(host, 'overflow', 'hidden');
      this.renderer.setStyle(host, 'will-change', 'transform');
      this.renderer.setStyle(host, 'transformPerspective', '600');
      this.renderer.setStyle(host, 'transformStyle', 'preserve-3d');

      this.glareEl = this.renderer.createElement('span');
      this.renderer.setStyle(this.glareEl, 'position', 'absolute');
      this.renderer.setStyle(this.glareEl, 'inset', '0');
      this.renderer.setStyle(this.glareEl, 'pointer-events', 'none');
      this.renderer.setStyle(this.glareEl, 'opacity', '0');
      this.renderer.setStyle(this.glareEl, 'transition', 'opacity 0.3s ease');
      this.renderer.setStyle(
        this.glareEl,
        'background',
        'radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.35), transparent 60%)',
      );
      this.renderer.appendChild(host, this.glareEl);
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const tilt = this.appTiltMax();

    this.setRotateY((px - 0.5) * tilt * 2);
    this.setRotateX(-(py - 0.5) * tilt * 2);
    this.setScale(1.015);

    if (this.glareEl) {
      this.renderer.setStyle(this.glareEl, '--gx', `${px * 100}%`);
      this.renderer.setStyle(this.glareEl, '--gy', `${py * 100}%`);
      this.renderer.setStyle(this.glareEl, 'opacity', `${this.appTiltMaxGlare()}`);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.setRotateX(0);
    this.setRotateY(0);
    this.setScale(1);
    this.glareEl && this.renderer.setStyle(this.glareEl, 'opacity', '0');
  }
}
