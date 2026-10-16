import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PHOTO_CATALOG_PORT } from '../core/ports/photo-catalog.port';

export interface GalleryItem {
  id: string;
  title: string;
  tag: string;
  coverPhoto: string;
  summary?: string;
}

/**
 * Fachada de compatibilidad que delega íntegramente en el puerto PHOTO_CATALOG_PORT
 * de la Arquitectura Hexagonal.
 */
@Injectable({
  providedIn: 'root',
})
export class Gallery {
  private readonly catalogPort = inject(PHOTO_CATALOG_PORT);

  getGalleriesFromCloudinary(): Observable<GalleryItem[]> {
    return this.catalogPort.getFolders().pipe(
      map((folders) =>
        folders.map((folder) => ({
          id: folder.id,
          title: folder.title,
          tag: folder.cloudinaryTag,
          coverPhoto: folder.coverPhotoUrl,
          summary: folder.summary,
        }))
      )
    );
  }

  getById(id: string) {
    return {
      id,
      title: id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      tag: id,
    };
  }

  getPhotosByTag(tag: string): Observable<string[]> {
    return this.catalogPort.getPhotosByFolder(tag).pipe(
      map((photos) => photos.map((p) => p.thumbUrl))
    );
  }
}
