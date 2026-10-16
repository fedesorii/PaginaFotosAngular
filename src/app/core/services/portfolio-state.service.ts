import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PHOTO_CATALOG_PORT } from '../ports/photo-catalog.port';
import { PHOTO_UPLOAD_PORT } from '../ports/photo-upload.port';
import { HOST_ENVIRONMENT_PORT } from '../ports/host-environment.port';
import {
  GalleryCategory,
  GalleryFolder,
  PhotoAsset,
} from '../domain/models/photo.model';
import { IGNACIO_JUAREZ_CV_PROFILE } from '../domain/data/photographer-cv.data';
import {
  CreateFolderPayload,
  PortfolioRuntimeConfig,
  UploadPhotoPayload,
  UploadPhotoResult,
} from '../domain/models/runtime-config.model';

const THEME_STORAGE_KEY = 'ij_portfolio_darkroom_mode_v1';

@Injectable({
  providedIn: 'root',
})
export class PortfolioStateService {
  private readonly catalogPort = inject(PHOTO_CATALOG_PORT);
  private readonly uploadPort = inject(PHOTO_UPLOAD_PORT);
  private readonly hostEnv = inject(HOST_ENVIRONMENT_PORT);

  readonly profile = signal(IGNACIO_JUAREZ_CV_PROFILE);
  readonly folders = signal<GalleryFolder[]>([]);
  readonly isLoadingFolders = signal<boolean>(true);
  readonly activeCategory = signal<'all' | GalleryCategory>('all');
  readonly searchQuery = signal<string>('');
  readonly isDarkroomMode = signal<boolean>(false);
  readonly runtimeConfig = signal<PortfolioRuntimeConfig>(this.hostEnv.getRuntimeConfig());
  readonly hostPlatform = signal(this.hostEnv.detectHostPlatform());

  readonly filteredFolders = computed(() => {
    const category = this.activeCategory();
    const query = this.searchQuery().trim().toLowerCase();
    return this.folders().filter((folder) => {
      const matchesCat = category === 'all' || folder.category === category;
      const matchesQuery =
        !query ||
        folder.title.toLowerCase().includes(query) ||
        folder.subtitle.toLowerCase().includes(query) ||
        folder.location.toLowerCase().includes(query) ||
        folder.summary.toLowerCase().includes(query);
      return matchesCat && matchesQuery;
    });
  });

  readonly totalPhotosCount = computed(() =>
    this.folders().reduce((acc, f) => acc + (f.photoCount || 0), 0)
  );

  constructor() {
    const savedDarkroom = this.hostEnv.getStorageItem<boolean>(THEME_STORAGE_KEY, false);
    this.setDarkroomMode(savedDarkroom);
    this.loadFolders();
  }

  loadFolders(): void {
    this.isLoadingFolders.set(true);
    this.catalogPort.getFolders().subscribe({
      next: (list) => {
        this.folders.set(list);
        this.isLoadingFolders.set(false);
      },
      error: () => {
        this.isLoadingFolders.set(false);
      },
    });
  }

  getFolderById(folderId: string): Observable<GalleryFolder | undefined> {
    return this.catalogPort.getFolderById(folderId);
  }

  getPhotosByFolder(folderId: string): Observable<PhotoAsset[]> {
    return this.catalogPort.getPhotosByFolder(folderId);
  }

  setCategory(category: 'all' | GalleryCategory): void {
    this.activeCategory.set(category);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  toggleDarkroomMode(): void {
    this.setDarkroomMode(!this.isDarkroomMode());
  }

  setDarkroomMode(enabled: boolean): void {
    this.isDarkroomMode.set(enabled);
    this.hostEnv.setStorageItem(THEME_STORAGE_KEY, enabled);
    if (this.hostEnv.isBrowser()) {
      document.documentElement.classList.toggle('darkroom-theme', enabled);
    }
  }

  updateRuntimeConfig(partial: Partial<PortfolioRuntimeConfig>): void {
    const updated = this.hostEnv.updateRuntimeConfig(partial);
    this.runtimeConfig.set(updated);
    this.loadFolders();
  }

  resetRuntimeConfig(): void {
    const reset = this.hostEnv.resetRuntimeConfig();
    this.runtimeConfig.set(reset);
    this.loadFolders();
  }

  saveFolderFromStudio(payload: CreateFolderPayload): Observable<GalleryFolder> {
    return this.uploadPort.saveFolder(payload).pipe(tap(() => this.loadFolders()));
  }

  uploadPhotoFromStudio(payload: UploadPhotoPayload): Observable<UploadPhotoResult> {
    return this.uploadPort.uploadPhoto(payload).pipe(tap(() => this.loadFolders()));
  }

  deleteCustomFolder(folderId: string): Observable<boolean> {
    return this.uploadPort.deleteCustomFolder(folderId).pipe(tap(() => this.loadFolders()));
  }

  exportManifest(): string {
    return this.uploadPort.exportManifestJson();
  }

  importManifest(rawJson: string): boolean {
    const ok = this.uploadPort.importManifestJson(rawJson);
    if (ok) {
      this.runtimeConfig.set(this.hostEnv.getRuntimeConfig());
      this.loadFolders();
    }
    return ok;
  }
}
