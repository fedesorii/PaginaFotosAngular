import { Injectable, computed, signal } from '@angular/core';

/**
 * Servicio de Lazy Computing para coordinar el cálculo progresivo de grillas,
 * decodificación asíncrona de imágenes y métricas de hidratación conforme el usuario scrollea.
 */
@Injectable({
  providedIn: 'root',
})
export class LazyComputeService {
  readonly registeredCount = signal<number>(0);
  readonly revealedCount = signal<number>(0);

  readonly completionPercent = computed(() => {
    const total = this.registeredCount();
    if (total <= 0) {
      return 100;
    }
    return Math.min(100, Math.round((this.revealedCount() / total) * 100));
  });

  resetMetrics(): void {
    this.registeredCount.set(0);
    this.revealedCount.set(0);
  }

  registerNode(): void {
    this.registeredCount.update((c) => c + 1);
  }

  markNodeRevealed(): void {
    this.revealedCount.update((c) => c + 1);
  }

  /**
   * Calcula progresivamente el límite de elementos visibles a montar en el DOM
   * a medida que el usuario avanza por la página.
   */
  computeNextBatchSize(currentVisible: number, totalItems: number, step = 6): number {
    return Math.min(totalItems, currentVisible + step);
  }
}
