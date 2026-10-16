import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { GalleryFolder, PhotoAsset } from '../domain/models/photo.model';

/**
 * Puerto de salida (Hexagonal Architecture) para la obtención de carpetas/series
 * y fotografías del porfolio. Permite cambiar el proveedor (Cloudinary, S3, Supabase,
 * CMS Headless o JSON estático) sin modificar ningún componente de interfaz ni caso de uso.
 */
export interface PhotoCatalogPort {
  /** Devuelve todas las carpetas/eventos con su imagen de portada, título y descripción */
  getFolders(): Observable<GalleryFolder[]>;

  /** Busca los metadatos completos de una carpeta por su ID o slug */
  getFolderById(folderId: string): Observable<GalleryFolder | undefined>;

  /** Obtiene todas las fotografías de una carpeta, optimizadas para grilla y lightbox */
  getPhotosByFolder(folderId: string): Observable<PhotoAsset[]>;

  /** Fuerza la recarga del catálogo desde el adaptador activo */
  refreshCatalog(): Observable<GalleryFolder[]>;
}

export const PHOTO_CATALOG_PORT = new InjectionToken<PhotoCatalogPort>('PHOTO_CATALOG_PORT');
