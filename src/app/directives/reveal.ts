import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appReveal]',
})
export class Reveal {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // 1. Preparamos el elemento: le damos el estado "invisible" inicial
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(30px)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.8s ease-out');

    // 2. Configuramos el observador
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 3. Cuando entra en pantalla, disparamos la animación
          this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
          this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
          observer.unobserve(this.el.nativeElement) // Dejamos de observar para ahorrar recursos
        }
      })
    }, {
      threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    });

    observer.observe(this.el.nativeElement);
  }
}
