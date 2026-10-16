import { Injectable, computed, inject, signal } from '@angular/core';
import { HOST_ENVIRONMENT_PORT } from '../ports/host-environment.port';
import { SelectedMoodboardItem } from '../domain/models/inquiry.model';
import { PhotoAsset } from '../domain/models/photo.model';

const MOODBOARD_STORAGE_KEY = 'ij_client_moodboard_selection_v1';

/**
 * Servicio de "Mesa de Luz" (Client Moodboard / Curation Shortlist).
 * Permite a potenciales clientes coleccionar fotografías de distintas carpetas
 * mientras recorren el porfolio para adjuntarlas como referencia estética al cotizar.
 */
@Injectable({
  providedIn: 'root',
})
export class MoodboardService {
  private readonly hostEnv = inject(HOST_ENVIRONMENT_PORT);

  readonly items = signal<SelectedMoodboardItem[]>(
    this.hostEnv.getStorageItem<SelectedMoodboardItem[]>(MOODBOARD_STORAGE_KEY, [])
  );
  readonly isDrawerOpen = signal<boolean>(false);

  readonly count = computed(() => this.items().length);

  isSelected(photoId: string): boolean {
    return this.items().some((item) => item.photoId === photoId);
  }

  togglePhoto(photo: PhotoAsset, folderTitle: string): boolean {
    const current = this.items();
    const exists = current.some((item) => item.photoId === photo.id);

    if (exists) {
      const updated = current.filter((item) => item.photoId !== photo.id);
      this.items.set(updated);
      this.hostEnv.setStorageItem(MOODBOARD_STORAGE_KEY, updated);
      return false;
    } else {
      const newItem: SelectedMoodboardItem = {
        photoId: photo.id,
        folderId: photo.folderId,
        folderTitle,
        photoTitle: photo.title,
        thumbUrl: photo.thumbUrl,
      };
      const updated = [newItem, ...current].slice(0, 16);
      this.items.set(updated);
      this.hostEnv.setStorageItem(MOODBOARD_STORAGE_KEY, updated);
      return true;
    }
  }

  removePhoto(photoId: string): void {
    const updated = this.items().filter((item) => item.photoId !== photoId);
    this.items.set(updated);
    this.hostEnv.setStorageItem(MOODBOARD_STORAGE_KEY, updated);
  }

  clearAll(): void {
    this.items.set([]);
    this.hostEnv.removeStorageItem(MOODBOARD_STORAGE_KEY);
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  toggleDrawer(): void {
    this.isDrawerOpen.update((v) => !v);
  }
}
