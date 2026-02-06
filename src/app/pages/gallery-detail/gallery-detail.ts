import { Component, computed, inject, input } from '@angular/core';
import { Gallery } from '../../services/gallery';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gallery-detail',
  imports: [RouterLink],
  templateUrl: './gallery-detail.html',
  styleUrl: './gallery-detail.css',
})
export class GalleryDetail {
  private galleryService = inject(Gallery);

  id = input.required<string>(); // Recibe el ID de la galería desde la ruta

  info = computed(() => this.galleryService.getById(this.id())); // Obtiene la información de la galería usando el ID
}
