import {
  Component,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { MoodboardService } from '../../core/services/moodboard.service';
import { LazyComputeService } from '../../core/services/lazy-compute.service';
import { Reveal } from '../../directives/reveal';
import { GalleryFolder, PhotoAsset } from '../../core/domain/models/photo.model';

@Component({
  selector: 'app-gallery-detail',
  standalone: true,
  imports: [RouterLink, Reveal],
  templateUrl: './gallery-detail.html',
  styleUrl: './gallery-detail.css',
})
export class GalleryDetail implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly portfolio = inject(PortfolioStateService);
  readonly moodboard = inject(MoodboardService);
  readonly lazyCompute = inject(LazyComputeService);

  /** ID de la carpeta recibido desde la ruta (/gallery/:id) */
  readonly id = input.required<string>();

  readonly folder = signal<GalleryFolder | undefined>(undefined);
  readonly allPhotos = signal<PhotoAsset[]>([]);
  readonly isLoading = signal<boolean>(true);

  /** Lazy Computing: cantidad progresiva de placas computadas en el DOM según el scroll */
  readonly computedBatchLimit = signal<number>(8);

  /** Acordeón "Read more..." inspirado en Levon Biss Microsculpture */
  readonly isReadMoreExpanded = signal<boolean>(false);

  /** Modo de visualización de la carpeta: Grilla Collage con Desnivel vs Hoja de Contacto */
  readonly viewMode = signal<'collage' | 'contact-sheet'>('collage');

  /** Estado del Lightbox / Focus Modal */
  readonly isLightboxOpen = signal<boolean>(false);
  readonly activeIndex = signal<number>(0);
  readonly isZoomed = signal<boolean>(false);
  readonly showExifPanel = signal<boolean>(true);

  private touchStartX = 0;

  /** Placas visibles actualmente computadas por el motor de Lazy Computing */
  readonly visiblePhotos = computed(() => {
    const list = this.allPhotos();
    const limit = this.computedBatchLimit();
    return list.slice(0, limit);
  });

  readonly hasMoreToCompute = computed(
    () => this.computedBatchLimit() < this.allPhotos().length
  );

  readonly activePhoto = computed<PhotoAsset | undefined>(() => {
    const list = this.allPhotos();
    const idx = this.activeIndex();
    return list[idx];
  });

  /** Navegación entre carpetas anterior y siguiente al pie de la página */
  readonly adjacentFolders = computed(() => {
    const folders = this.portfolio.folders();
    const currentId = this.folder()?.id?.toLowerCase();
    if (!folders.length || !currentId) {
      return { prev: undefined, next: undefined };
    }
    const idx = folders.findIndex((f) => f.id.toLowerCase() === currentId);
    if (idx === -1) {
      return { prev: folders[0], next: folders[1] };
    }
    const prev = folders[(idx - 1 + folders.length) % folders.length];
    const next = folders[(idx + 1) % folders.length];
    return { prev, next };
  });

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (!currentId) {
        return;
      }

      this.isLoading.set(true);
      this.isReadMoreExpanded.set(false);
      this.computedBatchLimit.set(8);
      this.lazyCompute.resetMetrics();

      this.portfolio.getFolderById(currentId).subscribe((foundFolder) => {
        this.folder.set(foundFolder);
      });

      this.portfolio.getPhotosByFolder(currentId).subscribe((photos) => {
        this.allPhotos.set(photos);
        this.isLoading.set(false);
      });
    });
  }

  /** Lazy Computing: a medida que el usuario scrollea, se computan nuevos lotes de imágenes */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId) || !this.hasMoreToCompute()) {
      return;
    }
    const scrollBottom = window.innerHeight + window.scrollY;
    const docHeight = document.documentElement.scrollHeight;

    if (docHeight - scrollBottom < 650) {
      this.computeNextBatch();
    }
  }

  computeNextBatch(): void {
    const nextLimit = this.lazyCompute.computeNextBatchSize(
      this.computedBatchLimit(),
      this.allPhotos().length,
      6
    );
    this.computedBatchLimit.set(nextLimit);
  }

  toggleReadMore(): void {
    this.isReadMoreExpanded.update((v) => !v);
  }

  setViewMode(mode: 'collage' | 'contact-sheet'): void {
    this.viewMode.set(mode);
    if (mode === 'contact-sheet') {
      // En Hoja de Contacto mostramos todas las placas numeradas
      this.computedBatchLimit.set(this.allPhotos().length);
    }
  }

  openLightboxAt(index: number): void {
    if (!this.allPhotos().length) {
      return;
    }
    this.activeIndex.set(index);
    this.isZoomed.set(false);
    this.isLightboxOpen.set(true);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox(): void {
    this.isLightboxOpen.set(false);
    this.isZoomed.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  nextPhoto(event?: Event): void {
    event?.stopPropagation();
    const total = this.allPhotos().length;
    if (!total) {
      return;
    }
    this.isZoomed.set(false);
    this.activeIndex.update((i) => (i + 1) % total);
  }

  prevPhoto(event?: Event): void {
    event?.stopPropagation();
    const total = this.allPhotos().length;
    if (!total) {
      return;
    }
    this.isZoomed.set(false);
    this.activeIndex.update((i) => (i - 1 + total) % total);
  }

  selectFilmstripPhoto(index: number, event: Event): void {
    event.stopPropagation();
    this.isZoomed.set(false);
    this.activeIndex.set(index);
  }

  toggleZoom(event?: Event): void {
    event?.stopPropagation();
    this.isZoomed.update((z) => !z);
  }

  toggleExif(event?: Event): void {
    event?.stopPropagation();
    this.showExifPanel.update((v) => !v);
  }

  toggleMoodboardItem(photo: PhotoAsset, event?: Event): void {
    event?.stopPropagation();
    const folderTitle = this.folder()?.title || 'Archivo Ignacio Juárez';
    this.moodboard.togglePhoto(photo, folderTitle);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.screenX ?? 0;
  }

  onTouchEnd(event: TouchEvent): void {
    const endX = event.changedTouches[0]?.screenX ?? 0;
    const delta = endX - this.touchStartX;
    if (Math.abs(delta) > 45) {
      if (delta < 0) {
        this.nextPhoto();
      } else {
        this.prevPhoto();
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    if (!this.isLightboxOpen()) {
      return;
    }
    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextPhoto();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.prevPhoto();
        break;
      case 'z':
      case 'Z':
        this.toggleZoom();
        break;
      case 'i':
      case 'I':
        this.toggleExif();
        break;
      case 'm':
      case 'M': {
        const current = this.activePhoto();
        if (current) {
          this.toggleMoodboardItem(current);
        }
        break;
      }
    }
  }

  formatIndex(num: number): string {
    return String(num).padStart(2, '0');
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}
