import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { PhotoUploadPort } from '../../ports/photo-upload.port';
import { HOST_ENVIRONMENT_PORT } from '../../ports/host-environment.port';
import { GalleryFolder, PhotoAsset } from '../../domain/models/photo.model';
import {
  CUSTOM_FOLDERS_STORAGE_KEY,
  CUSTOM_PHOTOS_STORAGE_KEY,
  CreateFolderPayload,
  UploadPhotoPayload,
  UploadPhotoResult,
} from '../../domain/models/runtime-config.model';

interface CloudinaryUploadApiResponse {
  public_id: string;
  version: number;
  format: string;
  width: number;
  height: number;
  secure_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class HybridPhotoUploadAdapter implements PhotoUploadPort {
  private readonly http = inject(HttpClient);
  private readonly hostEnv = inject(HOST_ENVIRONMENT_PORT);

  saveFolder(payload: CreateFolderPayload): Observable<GalleryFolder> {
    const slug = (payload.id || payload.title)
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const categoryLabels: Record<string, string> = {
      eventos: 'Cobertura de Eventos',
      gastronomia: 'Producto & Gastronomía',
      paisajes: 'Paisaje & Crónica',
      retratos: 'Retrato & Lifestyle',
      documental: 'Crónica Cultural',
    };

    const existingFolders = this.hostEnv.getStorageItem<GalleryFolder[]>(
      CUSTOM_FOLDERS_STORAGE_KEY,
      []
    );

    const newFolder: GalleryFolder = {
      id: slug || `serie-${Date.now()}`,
      slug: slug || `serie-${Date.now()}`,
      indexNumber: String(existingFolders.length + 9).padStart(2, '0'),
      title: payload.title.trim(),
      subtitle: payload.subtitle.trim() || 'Serie Fotográfica Autoral',
      category: payload.category,
      categoryLabel: categoryLabels[payload.category] || 'Serie Editorial',
      location: payload.location.trim() || 'Buenos Aires, Argentina',
      year: payload.year.trim() || '2026',
      clientOrContext: payload.clientOrContext.trim() || 'Producción Ignacio Juárez',
      coverPhotoUrl: payload.coverPhotoUrl.trim(),
      coverHighResUrl: payload.coverPhotoUrl.trim(),
      coverAspectVariant: payload.coverAspectVariant || 'portrait',
      summary: payload.summary.trim(),
      extendedNotes:
        payload.extendedNotes.length > 0
          ? payload.extendedNotes
          : [payload.summary.trim()],
      technicalSpecs: {
        camera: 'Full-Frame Digital & 35mm',
        optics: '35mm f/1.8 · 50mm f/1.4',
        lighting: 'Luz natural y ambiental controlada',
        colorProfile: 'Colorimetría Autoral Ignacio Juárez',
        deliverable: 'Galería de Alta Resolución con Marca de Agua',
      },
      photoCount: 0,
      cloudinaryTag: payload.cloudinaryTag?.trim() || slug,
      featured: true,
      curatedPhotos: [],
    };

    const filtered = existingFolders.filter(
      (f) => f.id.toLowerCase() !== newFolder.id.toLowerCase()
    );
    this.hostEnv.setStorageItem(CUSTOM_FOLDERS_STORAGE_KEY, [newFolder, ...filtered]);

    return of(newFolder);
  }

  uploadPhoto(payload: UploadPhotoPayload): Observable<UploadPhotoResult> {
    const config = this.hostEnv.getRuntimeConfig();
    const watermark = config.watermarkText || '© IGNACIO JUÁREZ · FOTOGRAFÍA';
    const cloudName = config.cloudinaryPrimaryCloudName || 'ddozsonun';
    const preset = (config.cloudinaryUploadPreset || '').trim();

    // Si el administrador configuró un Upload Preset de Cloudinary y adjuntó archivo o URL,
    // subimos directamente mediante la API REST desacoplada de Cloudinary.
    if (preset && this.hostEnv.isBrowser() && (payload.file || payload.imageUrlOrDataUrl)) {
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const formData = new FormData();
      if (payload.file) {
        formData.append('file', payload.file);
      } else {
        formData.append('file', payload.imageUrlOrDataUrl);
      }
      formData.append('upload_preset', preset);
      formData.append('folder', payload.folderId);
      formData.append('tags', `${payload.folderId},portadas-home`);

      return this.http.post<CloudinaryUploadApiResponse>(uploadUrl, formData).pipe(
        map((res) => {
          const asset = this.createAndPersistAsset(
            payload,
            res.secure_url,
            res.secure_url,
            res.public_id,
            watermark,
            res.width || 1600,
            res.height || 2400
          );
          return {
            success: true,
            providerUsed: 'cloudinary-api' as const,
            asset,
            message: `Fotografía subida exitosamente a Cloudinary (${cloudName}) y vinculada a "${payload.folderId}".`,
          };
        }),
        catchError(() => {
          const fallbackAsset = this.createAndPersistAsset(
            payload,
            payload.imageUrlOrDataUrl,
            payload.imageUrlOrDataUrl,
            `${payload.folderId}/studio-${Date.now()}`,
            watermark
          );
          return of({
            success: true,
            providerUsed: 'local-studio-adapter' as const,
            asset: fallbackAsset,
            message:
              'Cloudinary Upload API requirió credenciales adicionales; la fotografía se guardó en el Adaptador Local del Estudio.',
          });
        })
      );
    }

    // Adaptador de Estudio Local: persiste inmediatamente la placa en la carpeta seleccionada
    const asset = this.createAndPersistAsset(
      payload,
      payload.imageUrlOrDataUrl,
      payload.imageUrlOrDataUrl,
      `${payload.folderId}/placa-${Date.now()}`,
      watermark
    );

    return of({
      success: true,
      providerUsed: 'local-studio-adapter',
      asset,
      message: `Fotografía agregada a la carpeta "${payload.folderId}" mediante el Adaptador de Estudio.`,
    });
  }

  deleteCustomFolder(folderId: string): Observable<boolean> {
    const existing = this.hostEnv.getStorageItem<GalleryFolder[]>(
      CUSTOM_FOLDERS_STORAGE_KEY,
      []
    );
    const updated = existing.filter((f) => f.id.toLowerCase() !== folderId.toLowerCase());
    this.hostEnv.setStorageItem(CUSTOM_FOLDERS_STORAGE_KEY, updated);

    const photosMap = this.hostEnv.getStorageItem<Record<string, PhotoAsset[]>>(
      CUSTOM_PHOTOS_STORAGE_KEY,
      {}
    );
    delete photosMap[folderId];
    delete photosMap[folderId.toLowerCase()];
    this.hostEnv.setStorageItem(CUSTOM_PHOTOS_STORAGE_KEY, photosMap);

    return of(true);
  }

  deleteCustomPhoto(folderId: string, photoId: string): Observable<boolean> {
    const photosMap = this.hostEnv.getStorageItem<Record<string, PhotoAsset[]>>(
      CUSTOM_PHOTOS_STORAGE_KEY,
      {}
    );
    const list = photosMap[folderId] || photosMap[folderId.toLowerCase()] || [];
    photosMap[folderId] = list.filter((p) => p.id !== photoId);
    this.hostEnv.setStorageItem(CUSTOM_PHOTOS_STORAGE_KEY, photosMap);
    return of(true);
  }

  exportManifestJson(): string {
    const customFolders = this.hostEnv.getStorageItem<GalleryFolder[]>(
      CUSTOM_FOLDERS_STORAGE_KEY,
      []
    );
    const customPhotos = this.hostEnv.getStorageItem<Record<string, PhotoAsset[]>>(
      CUSTOM_PHOTOS_STORAGE_KEY,
      {}
    );
    const runtimeConfig = this.hostEnv.getRuntimeConfig();
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        runtimeConfig,
        customFolders,
        customPhotos,
      },
      null,
      2
    );
  }

  importManifestJson(rawJson: string): boolean {
    try {
      const parsed = JSON.parse(rawJson);
      if (parsed.customFolders && Array.isArray(parsed.customFolders)) {
        this.hostEnv.setStorageItem(CUSTOM_FOLDERS_STORAGE_KEY, parsed.customFolders);
      }
      if (parsed.customPhotos && typeof parsed.customPhotos === 'object') {
        this.hostEnv.setStorageItem(CUSTOM_PHOTOS_STORAGE_KEY, parsed.customPhotos);
      }
      if (parsed.runtimeConfig && typeof parsed.runtimeConfig === 'object') {
        this.hostEnv.updateRuntimeConfig(parsed.runtimeConfig);
      }
      return true;
    } catch {
      return false;
    }
  }

  private createAndPersistAsset(
    payload: UploadPhotoPayload,
    thumbUrl: string,
    highResUrl: string,
    publicId: string,
    watermarkText: string,
    width = 1600,
    height = 2400
  ): PhotoAsset {
    const photosMap = this.hostEnv.getStorageItem<Record<string, PhotoAsset[]>>(
      CUSTOM_PHOTOS_STORAGE_KEY,
      {}
    );
    const currentList = photosMap[payload.folderId] || [];

    const newAsset: PhotoAsset = {
      id: `${payload.folderId}__custom-${Date.now()}`,
      publicId,
      folderId: payload.folderId,
      index: 1,
      title: payload.title.trim() || 'Placa sin título',
      caption:
        payload.caption.trim() ||
        'Fotografía incorporada desde el Estudio de Administración.',
      thumbUrl,
      highResUrl,
      width,
      height,
      aspectVariant: payload.aspectVariant || 'portrait',
      watermarkText,
      metadata: {
        location: payload.location || 'Buenos Aires, Argentina',
        year: payload.year || '2026',
        focalLength: '50mm',
        aperture: 'f/2.8',
        iso: 'ISO 400',
        filmStock: 'Edición Autoral Ignacio Juárez',
      },
    };

    photosMap[payload.folderId] = [newAsset, ...currentList];
    this.hostEnv.setStorageItem(CUSTOM_PHOTOS_STORAGE_KEY, photosMap);
    return newAsset;
  }
}
