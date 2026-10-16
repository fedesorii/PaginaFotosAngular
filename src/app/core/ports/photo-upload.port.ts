import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { GalleryFolder } from '../domain/models/photo.model';
import {
  CreateFolderPayload,
  UploadPhotoPayload,
  UploadPhotoResult,
} from '../domain/models/runtime-config.model';

/**
 * Puerto de salida (Hexagonal Architecture) para el sistema de administración y carga
 * de fotografías/carpetas. Desacopla el panel de estudio de Cloudinary Upload API,
 * AWS S3 Presigned URLs, Firebase Storage o almacenamiento local.
 */
export interface PhotoUploadPort {
  /** Crea o actualiza una carpeta de evento/sesión */
  saveFolder(payload: CreateFolderPayload): Observable<GalleryFolder>;

  /** Sube o registra una nueva fotografía dentro de una carpeta existente */
  uploadPhoto(payload: UploadPhotoPayload): Observable<UploadPhotoResult>;

  /** Elimina una carpeta personalizada creada desde el panel de administración */
  deleteCustomFolder(folderId: string): Observable<boolean>;

  /** Elimina una fotografía subida por el administrador */
  deleteCustomPhoto(folderId: string, photoId: string): Observable<boolean>;

  /** Exporta el manifiesto completo de carpetas y fotos personalizadas en formato JSON */
  exportManifestJson(): string;

  /** Importa un manifiesto JSON de carpetas y fotos personalizadas */
  importManifestJson(rawJson: string): boolean;
}

export const PHOTO_UPLOAD_PORT = new InjectionToken<PhotoUploadPort>('PHOTO_UPLOAD_PORT');
