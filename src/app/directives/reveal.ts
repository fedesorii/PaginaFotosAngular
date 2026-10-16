import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LazyComputeService } from '../core/services/lazy-compute.service';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class Reveal implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly lazyCompute = inject(LazyComputeService);

  /** Índice opcional para calcular el desfase escalonado (stagger) entre columnas */
  @Input() revealIndex = 0;

  /** Desplazamiento vertical inicial en píxeles antes de entrar en viewport */
  @Input() revealOffsetY = 36;

  private observer: IntersectionObserver | null = null;
  private isRevealed = false;

  ngOnInit(): void {
    const element = this.el.nativeElement;
    this.lazyCompute.registerNode();

    const prefersReducedMotion =
      isPlatformBrowser(this.platformId) &&
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (
      !isPlatformBrowser(this.platformId) ||
      typeof IntersectionObserver === 'undefined' ||
      prefersReducedMotion
    ) {
      // En SSR, entornos sin IntersectionObserver o cuando el usuario prefiere reducir movimiento
      this.renderer.setStyle(element, 'opacity', '1');
      this.renderer.addClass(element, 'is-revealed');
      this.lazyCompute.markNodeRevealed();
      return;
    }

    // Cálculo perezoso de retardo por columna para acentuar el efecto de collage escalonado
    const staggerMs = (this.revealIndex % 4) * 75;

    this.renderer.setStyle(element, 'opacity', '0');
    this.renderer.setStyle(
      element,
      'transform',
      `translate3d(0, ${this.revealOffsetY}px, 0) scale(0.985)`
    );
    this.renderer.setStyle(element, 'will-change', 'opacity, transform');
    this.renderer.setStyle(
      element,
      'transition',
      `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${staggerMs}ms, transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) ${staggerMs}ms`
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isRevealed) {
            this.isRevealed = true;
            this.revealElement(element);
            this.observer?.unobserve(element);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '120px 0px 120px 0px',
      }
    );

    this.observer.observe(element);
  }

  private revealElement(element: HTMLElement): void {
    const img = element.querySelector('img');
    const triggerVisible = () => {
      this.renderer.setStyle(element, 'opacity', '1');
      this.renderer.setStyle(element, 'transform', 'translate3d(0, 0, 0) scale(1)');
      this.renderer.addClass(element, 'is-revealed');
      this.lazyCompute.markNodeRevealed();
    };

    if (img && !img.complete) {
      const onLoaded = () => {
        triggerVisible();
        img.removeEventListener('load', onLoaded);
        img.removeEventListener('error', onLoaded);
      };
      img.addEventListener('load', onLoaded, { once: true });
      img.addEventListener('error', onLoaded, { once: true });
      // Fallback de seguridad en caso de que la red sea lenta para no bloquear el layout
      setTimeout(triggerVisible, 320);
    } else {
      requestAnimationFrame(triggerVisible);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
