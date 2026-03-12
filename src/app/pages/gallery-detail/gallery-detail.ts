import { Component, computed, effect, HostListener, inject, input, signal } from '@angular/core';
import { Gallery } from '../../services/gallery';
import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-gallery-detail',
  imports: [Reveal],
  templateUrl: './gallery-detail.html',
  styleUrl: './gallery-detail.css',
})
export class GalleryDetail {
  private galleryService = inject(Gallery);

  id = input.required<string>(); // Recibe el ID de la galería desde la ruta

  info = computed(() => this.galleryService.getById(this.id())); // Obtiene la información de la galería usando el ID

  // 2. Creamos un Signal vacío para guardar las fotos que llegarán de internet
  photos = signal<string[]>([]);

  // Estado del Lightbox usando Signals
  isLightboxOpen = signal(false);
  selectedImage = signal<string>('');

  constructor() {
    // 3. El effect "escucha". Cuando detecta que entramos a una galería (hay info nueva)...
    effect(() => {
      const currentInfo = this.info();

      if (currentInfo) {
        // ...va a Cloudinary a buscar las fotos usando el Tag
        this.galleryService.getPhotosByTag(currentInfo.tag).subscribe((urls) => {
          // 4. Cuando llegan las URLs, las guardamos en el Signal "photos"
          this.photos.set(urls);
        });
      }
    });
  }

  // Funciones para manejar el Lightbox
  openLightbox(photoUrl: string) {
    // Reemplazamos los parámetros de miniatura por los de alta resolución
    const highResUrl = photoUrl.replace(/c_fill,ar_4:6,w_800/, 'c_limit,w_1600');

    this.selectedImage.set(highResUrl);
    this.isLightboxOpen.set(true);

    // Bloqueamos el scroll de la página detrás del modal
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.isLightboxOpen.set(false);
    this.selectedImage.set('');

    // Restauramos el scroll de la página
    document.body.style.overflow = 'auto';
  }

  // Permite cerrar el modal con la tecla "Escape"
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(e: Event) {
    const event = e as KeyboardEvent;
    if (this.isLightboxOpen()) {
      this.closeLightbox();
    }
  }
}
