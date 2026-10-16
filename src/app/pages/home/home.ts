import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { LazyComputeService } from '../../core/services/lazy-compute.service';
import { Reveal } from '../../directives/reveal';
import { GalleryCategory } from '../../core/domain/models/photo.model';

interface CategoryFilterOption {
  id: 'all' | GalleryCategory;
  label: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Reveal],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly portfolio = inject(PortfolioStateService);
  readonly lazyCompute = inject(LazyComputeService);

  readonly collageRhythm = signal<'staggered' | 'balanced'>('staggered');

  readonly categories: CategoryFilterOption[] = [
    { id: 'all', label: 'Todas las Carpetas' },
    { id: 'eventos', label: 'Eventos & Aniversarios' },
    { id: 'gastronomia', label: 'Producto & Gastronomía' },
    { id: 'paisajes', label: 'Paisaje & Territorio' },
    { id: 'retratos', label: 'Retrato & Escena' },
    { id: 'documental', label: 'Crónica Cultural' },
  ];

  readonly galleries = computed(() => this.portfolio.filteredFolders());

  selectCategory(cat: 'all' | GalleryCategory): void {
    this.portfolio.setCategory(cat);
  }

  toggleCollageRhythm(): void {
    this.collageRhythm.update((mode) => (mode === 'staggered' ? 'balanced' : 'staggered'));
  }
}
