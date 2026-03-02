import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Gallery } from '../../services/gallery';

@Component({
  selector: 'app-gallery-detail',
  imports: [],
  templateUrl: './gallery-detail.html',
  styleUrl: './gallery-detail.css',
})
export class GalleryDetail {
  private galleryService = inject(Gallery);

  id = input.required<string>(); // Recibe el ID de la galería desde la ruta

  info = computed(() => this.galleryService.getById(this.id())); // Obtiene la información de la galería usando el ID

  // 2. Creamos un Signal vacío para guardar las fotos que llegarán de internet
  photos = signal<string[]>([]);

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
}
