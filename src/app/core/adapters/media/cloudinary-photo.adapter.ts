import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { PhotoCatalogPort } from '../../ports/photo-catalog.port';
import { HOST_ENVIRONMENT_PORT } from '../../ports/host-environment.port';
import {
  AspectRatioVariant,
  GalleryFolder,
  PhotoAsset,
} from '../../domain/models/photo.model';
import {
  buildCloudinaryHighResUrl,
  buildCloudinaryThumbUrl,
  buildCuratedFolders,
} from '../../domain/data/curated-catalog.data';
import {
  CUSTOM_FOLDERS_STORAGE_KEY,
  CUSTOM_PHOTOS_STORAGE_KEY,
} from '../../domain/models/runtime-config.model';

interface CloudinaryListResource {
  public_id: string;
  version: number | string;
  format: string;
  width?: number;
  height?: number;
  created_at?: string;
}

interface CloudinaryListResponse {
  resources: CloudinaryListResource[];
}

const ASPECT_CYCLE: AspectRatioVariant[] = ['tall', 'portrait', 'editorial', 'compact'];

@Injectable({
  providedIn: 'root',
})
export class CloudinaryPhotoAdapter implements PhotoCatalogPort {
  private readonly http = inject(HttpClient);
  private readonly hostEnv = inject(HOST_ENVIRONMENT_PORT);

  getFolders(): Observable<GalleryFolder[]> {
    const config = this.hostEnv.getRuntimeConfig();
    const baseCloud = config.cloudinaryPrimaryCloudName || 'ddozsonun';
    const watermark = config.watermarkText || '© IGNACIO JUÁREZ · FOTOGRAFÍA';

    // Obtenemos las 8 carpetas curadas con las 31 fotografías reales de Ignacio Juárez
    const curatedFolders = buildCuratedFolders(baseCloud, watermark);
    const customFolders = this.getCustomFoldersFromStorage(watermark);
    const customPhotosMap = this.getCustomPhotosFromStorage();

    // Si estamos en modo local o en SSR (para evitar bloqueos de red en prerender),
    // devolvemos inmediatamente el catálogo combinado y enriquecido.
    if (!this.hostEnv.isBrowser() || config.mediaAdapter === 'curated-local') {
      return of(this.mergeFolders(curatedFolders, customFolders, customPhotosMap));
    }

    // En navegador con adaptador híbrido Cloudinary: consultamos portadas-home.json
    // para descubrir dinámicamente cualquier carpeta nueva etiquetada en Cloudinary
    // (probando primero la nube primaria y luego la secundaria si devuelve 401).
    return this.fetchCloudinaryListWithFallback('portadas-home').pipe(
      map((result) => {
        const discoveredFolders = this.extractDynamicFoldersFromPortadas(
          result.resources,
          result.cloudNameUsed,
          curatedFolders,
          watermark
        );
        return this.mergeFolders(
          [...curatedFolders, ...discoveredFolders],
          customFolders,
          customPhotosMap
        );
      }),
      catchError(() => of(this.mergeFolders(curatedFolders, customFolders, customPhotosMap)))
    );
  }

  getFolderById(folderId: string): Observable<GalleryFolder | undefined> {
    const normalized = folderId.trim().toLowerCase();
    return this.getFolders().pipe(
      map((folders) =>
        folders.find(
          (f) =>
            f.id.toLowerCase() === normalized ||
            f.slug.toLowerCase() === normalized ||
            f.cloudinaryTag.toLowerCase() === normalized
        )
      )
    );
  }

  getPhotosByFolder(folderId: string): Observable<PhotoAsset[]> {
    const config = this.hostEnv.getRuntimeConfig();
    const watermark = config.watermarkText || '© IGNACIO JUÁREZ · FOTOGRAFÍA';
    const customPhotosMap = this.getCustomPhotosFromStorage();

    return this.getFolderById(folderId).pipe(
      switchMap((folder) => {
        if (!folder) {
          return of([]);
        }

        const customForFolder =
          customPhotosMap[folder.id] || customPhotosMap[folder.id.toLowerCase()] || [];

        // Si la carpeta ya posee su selección curada de placas reales, la usamos como base
        // y si es una carpeta maestra de Cloudinary (ej. 'norte-argentino', 'Bonaburguense'
        // o una carpeta nueva descubierta en Cloudinary), sincronizamos con Cloudinary en vivo.
        const curatedPhotos = (folder.curatedPhotos ?? []).map((p) => ({
          ...p,
          watermarkText: watermark,
        }));

        const isMasterTagFolder =
          folder.id.toLowerCase() === folder.cloudinaryTag.toLowerCase() &&
          this.hostEnv.isBrowser() &&
          config.mediaAdapter === 'cloudinary-hybrid';

        if (!isMasterTagFolder) {
          return of(this.combinePhotos(customForFolder, curatedPhotos));
        }

        return this.fetchCloudinaryListWithFallback(folder.cloudinaryTag).pipe(
          map((liveResult) => {
            if (!liveResult.resources || liveResult.resources.length === 0) {
              return this.combinePhotos(customForFolder, curatedPhotos);
            }
            const syncedPhotos = this.mergeLiveResourcesWithCurated(
              liveResult.resources,
              liveResult.cloudNameUsed,
              folder.id,
              curatedPhotos,
              watermark
            );
            return this.combinePhotos(customForFolder, syncedPhotos);
          }),
          catchError(() => of(this.combinePhotos(customForFolder, curatedPhotos)))
        );
      })
    );
  }

  refreshCatalog(): Observable<GalleryFolder[]> {
    return this.getFolders();
  }

  private fetchCloudinaryListWithFallback(
    tag: string
  ): Observable<{ cloudNameUsed: string; resources: CloudinaryListResource[] }> {
    const config = this.hostEnv.getRuntimeConfig();
    const primary = (config.cloudinaryPrimaryCloudName || 'ddozsonun').trim();
    const fallback = (config.cloudinaryFallbackCloudName || 'ddozsonun').trim();

    const primaryUrl = `https://res.cloudinary.com/${primary}/image/list/${tag}.json`;

    return this.http.get<CloudinaryListResponse>(primaryUrl).pipe(
      map((res) => ({
        cloudNameUsed: primary,
        resources: res?.resources ?? [],
      })),
      catchError(() => {
        if (fallback && fallback !== primary) {
          const fallbackUrl = `https://res.cloudinary.com/${fallback}/image/list/${tag}.json`;
          return this.http.get<CloudinaryListResponse>(fallbackUrl).pipe(
            map((res) => ({
              cloudNameUsed: fallback,
              resources: res?.resources ?? [],
            })),
            catchError(() => of({ cloudNameUsed: 'ddozsonun', resources: [] }))
          );
        }
        return of({ cloudNameUsed: primary, resources: [] });
      })
    );
  }

  private extractDynamicFoldersFromPortadas(
    resources: CloudinaryListResource[],
    cloudName: string,
    existingCurated: GalleryFolder[],
    watermarkText: string
  ): GalleryFolder[] {
    const existingTags = new Set(existingCurated.map((f) => f.cloudinaryTag.toLowerCase()));
    const existingIds = new Set(existingCurated.map((f) => f.id.toLowerCase()));
    const dynamicMap = new Map<string, GalleryFolder>();

    resources.forEach((res, idx) => {
      const folderName = res.public_id.includes('/')
        ? res.public_id.split('/')[0]
        : res.public_id;
      const lower = folderName.toLowerCase();

      if (!existingTags.has(lower) && !existingIds.has(lower) && !dynamicMap.has(lower)) {
        const formattedTitle = folderName
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
        const aspect = ASPECT_CYCLE[idx % ASPECT_CYCLE.length];
        const indexNum = String(existingCurated.length + dynamicMap.size + 1).padStart(2, '0');

        dynamicMap.set(lower, {
          id: folderName,
          slug: folderName,
          indexNumber: indexNum,
          title: formattedTitle,
          subtitle: 'Serie Fotográfica Sincronizada desde Cloudinary',
          category: 'eventos',
          categoryLabel: 'Serie en Nube',
          location: 'Buenos Aires, Argentina',
          year: '2026',
          clientOrContext: 'Producción Ignacio Juárez',
          coverPhotoUrl: buildCloudinaryThumbUrl(
            cloudName,
            res.public_id,
            res.version,
            res.format,
            aspect
          ),
          coverHighResUrl: buildCloudinaryHighResUrl(
            cloudName,
            res.public_id,
            res.version,
            res.format
          ),
          coverAspectVariant: aspect,
          summary: `Colección fotográfica "${formattedTitle}" cargada dinámicamente desde el archivo en la nube de Ignacio Juárez.`,
          extendedNotes: [
            `Esta carpeta fue detectada automáticamente a través de la etiqueta de sincronización en Cloudinary (${folderName}).`,
            `Cada fotografía conserva su resolución original de archivo y sello de autoría.`,
          ],
          technicalSpecs: {
            camera: 'Full-Frame Digital',
            optics: '35mm / 50mm Prime',
            lighting: 'Luz natural y ambiental',
            colorProfile: 'Edición Autoral Ignacio Juárez',
            deliverable: `Archivo Digital (${watermarkText})`,
          },
          photoCount: 1,
          cloudinaryTag: folderName,
          featured: true,
        });
      }
    });

    return Array.from(dynamicMap.values());
  }

  private mergeLiveResourcesWithCurated(
    liveResources: CloudinaryListResource[],
    cloudName: string,
    folderId: string,
    curatedPhotos: PhotoAsset[],
    watermarkText: string
  ): PhotoAsset[] {
    const curatedByPublicId = new Map<string, PhotoAsset>();
    for (const p of curatedPhotos) {
      curatedByPublicId.set(p.publicId.toLowerCase(), p);
    }

    const result: PhotoAsset[] = [...curatedPhotos];

    liveResources.forEach((res, idx) => {
      const key = res.public_id.toLowerCase();
      if (!curatedByPublicId.has(key)) {
        const aspect = ASPECT_CYCLE[idx % ASPECT_CYCLE.length];
        const shortCode = res.public_id.split('/').pop() || String(idx + 1);
        result.push({
          id: `${folderId}__${res.public_id.replace('/', '-')}`,
          publicId: res.public_id,
          folderId,
          index: result.length + 1,
          title: `Placa Nº ${shortCode}`,
          caption: `Fotografía de la serie ${folderId} capturada por Ignacio Juárez.`,
          thumbUrl: buildCloudinaryThumbUrl(
            cloudName,
            res.public_id,
            res.version,
            res.format,
            aspect
          ),
          highResUrl: buildCloudinaryHighResUrl(
            cloudName,
            res.public_id,
            res.version,
            res.format
          ),
          width: res.width || 1600,
          height: res.height || 2400,
          aspectVariant: aspect,
          watermarkText,
          metadata: {
            location: 'Argentina',
            year: '2026',
            filmStock: 'Colorimetría Autoral',
          },
        });
      }
    });

    return result;
  }

  private mergeFolders(
    baseFolders: GalleryFolder[],
    customFolders: GalleryFolder[],
    customPhotosMap: Record<string, PhotoAsset[]>
  ): GalleryFolder[] {
    const mapById = new Map<string, GalleryFolder>();

    for (const folder of baseFolders) {
      const extraPhotos =
        customPhotosMap[folder.id] || customPhotosMap[folder.id.toLowerCase()] || [];
      mapById.set(folder.id.toLowerCase(), {
        ...folder,
        photoCount: (folder.curatedPhotos?.length || folder.photoCount) + extraPhotos.length,
      });
    }

    for (const custom of customFolders) {
      const key = custom.id.toLowerCase();
      const extraPhotos = customPhotosMap[custom.id] || customPhotosMap[key] || [];
      const existing = mapById.get(key);
      if (existing) {
        mapById.set(key, {
          ...existing,
          ...custom,
          curatedPhotos: existing.curatedPhotos,
          photoCount: (existing.curatedPhotos?.length || 0) + extraPhotos.length,
        });
      } else {
        mapById.set(key, {
          ...custom,
          photoCount: (custom.curatedPhotos?.length || 0) + extraPhotos.length,
        });
      }
    }

    return Array.from(mapById.values()).map((folder, i) => ({
      ...folder,
      indexNumber: String(i + 1).padStart(2, '0'),
    }));
  }

  private combinePhotos(customPhotos: PhotoAsset[], basePhotos: PhotoAsset[]): PhotoAsset[] {
    const combined = [...customPhotos, ...basePhotos];
    return combined.map((photo, idx) => ({
      ...photo,
      index: idx + 1,
    }));
  }

  private getCustomFoldersFromStorage(watermarkText: string): GalleryFolder[] {
    const raw = this.hostEnv.getStorageItem<GalleryFolder[]>(CUSTOM_FOLDERS_STORAGE_KEY, []);
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw.map((f) => ({
      ...f,
      curatedPhotos: (f.curatedPhotos ?? []).map((p) => ({
        ...p,
        watermarkText,
      })),
    }));
  }

  private getCustomPhotosFromStorage(): Record<string, PhotoAsset[]> {
    const raw = this.hostEnv.getStorageItem<Record<string, PhotoAsset[]>>(
      CUSTOM_PHOTOS_STORAGE_KEY,
      {}
    );
    return raw && typeof raw === 'object' ? raw : {};
  }
}
