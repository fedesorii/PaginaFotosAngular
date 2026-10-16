import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { EMAIL_NOTIFICATION_PORT } from '../../core/ports/email-notification.port';
import { AspectRatioVariant, GalleryCategory } from '../../core/domain/models/photo.model';
import { ContactInquiry } from '../../core/domain/models/inquiry.model';
import {
  EmailAdapterType,
  MediaAdapterType,
  PortfolioRuntimeConfig,
} from '../../core/domain/models/runtime-config.model';

type StudioTab = 'upload' | 'folders' | 'adapters' | 'inquiries';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './studio.html',
  styleUrl: './studio.css',
})
export class Studio implements OnInit {
  readonly portfolio = inject(PortfolioStateService);
  private readonly emailPort = inject(EMAIL_NOTIFICATION_PORT);

  readonly activeTab = signal<StudioTab>('upload');
  readonly statusBanner = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- TAB 1: UPLOAD PHOTO ---
  uploadFolderId = 'norte-argentino';
  uploadTitle = '';
  uploadCaption = '';
  uploadImageUrl = '';
  uploadSelectedFile?: File;
  uploadAspectVariant: AspectRatioVariant = 'portrait';
  uploadLocation = 'Buenos Aires, Argentina';
  uploadYear = '2026';
  readonly isUploadingPhoto = signal<boolean>(false);

  // --- TAB 2: CREATE FOLDER ---
  folderTitle = '';
  folderSubtitle = '';
  folderCategory: GalleryCategory = 'eventos';
  folderLocation = 'Buenos Aires, Argentina';
  folderYear = '2026';
  folderClient = '';
  folderSummary = '';
  folderExtendedNotesText = '';
  folderCoverUrl = '';
  folderCloudinaryTag = '';
  readonly isSavingFolder = signal<boolean>(false);

  // --- TAB 3: HEXAGONAL ADAPTERS CONFIG ---
  configDraft: PortfolioRuntimeConfig = { ...this.portfolio.runtimeConfig() };
  manifestJsonText = '';

  // --- TAB 4: INQUIRIES LOG ---
  readonly inquiries = signal<ContactInquiry[]>([]);

  ngOnInit(): void {
    this.configDraft = { ...this.portfolio.runtimeConfig() };
    this.refreshInquiries();
    const folders = this.portfolio.folders();
    if (folders.length > 0) {
      this.uploadFolderId = folders[0].id;
    }
  }

  setTab(tab: StudioTab): void {
    this.activeTab.set(tab);
    this.statusBanner.set(null);
    if (tab === 'inquiries') {
      this.refreshInquiries();
    } else if (tab === 'adapters') {
      this.configDraft = { ...this.portfolio.runtimeConfig() };
      this.manifestJsonText = this.portfolio.exportManifest();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadSelectedFile = file;
    if (!this.uploadTitle) {
      this.uploadTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.uploadImageUrl = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  onCoverFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.folderCoverUrl = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  submitPhotoUpload(event: Event): void {
    event.preventDefault();
    if (!this.uploadFolderId || !this.uploadTitle.trim() || !this.uploadImageUrl.trim()) {
      this.statusBanner.set({
        type: 'error',
        text: 'Seleccioná una carpeta, ingresá un título y proporcioná una imagen o URL.',
      });
      return;
    }

    this.isUploadingPhoto.set(true);
    this.portfolio
      .uploadPhotoFromStudio({
        folderId: this.uploadFolderId,
        title: this.uploadTitle.trim(),
        caption: this.uploadCaption.trim() || this.uploadTitle.trim(),
        imageUrlOrDataUrl: this.uploadImageUrl.trim(),
        file: this.uploadSelectedFile,
        aspectVariant: this.uploadAspectVariant,
        location: this.uploadLocation.trim(),
        year: this.uploadYear.trim(),
      })
      .subscribe({
        next: (result) => {
          this.isUploadingPhoto.set(false);
          this.statusBanner.set({
            type: 'success',
            text: result.message,
          });
          this.uploadTitle = '';
          this.uploadCaption = '';
          this.uploadImageUrl = '';
          this.uploadSelectedFile = undefined;
        },
        error: () => {
          this.isUploadingPhoto.set(false);
          this.statusBanner.set({
            type: 'error',
            text: 'No se pudo registrar la fotografía. Verificá los datos o el tamaño de la imagen.',
          });
        },
      });
  }

  submitCreateFolder(event: Event): void {
    event.preventDefault();
    if (!this.folderTitle.trim() || !this.folderSummary.trim() || !this.folderCoverUrl.trim()) {
      this.statusBanner.set({
        type: 'error',
        text: 'Completá al menos el título de la carpeta, la descripción breve y la imagen de portada.',
      });
      return;
    }

    this.isSavingFolder.set(true);
    const notes = this.folderExtendedNotesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    this.portfolio
      .saveFolderFromStudio({
        title: this.folderTitle.trim(),
        subtitle: this.folderSubtitle.trim() || 'Serie Fotográfica',
        category: this.folderCategory,
        location: this.folderLocation.trim() || 'Argentina',
        year: this.folderYear.trim() || '2026',
        clientOrContext: this.folderClient.trim() || 'Producción Editorial',
        summary: this.folderSummary.trim(),
        extendedNotes: notes.length > 0 ? notes : [this.folderSummary.trim()],
        coverPhotoUrl: this.folderCoverUrl.trim(),
        cloudinaryTag: this.folderCloudinaryTag.trim() || undefined,
      })
      .subscribe({
        next: (created) => {
          this.isSavingFolder.set(false);
          this.statusBanner.set({
            type: 'success',
            text: `Carpeta "${created.title}" creada y publicada en el porfolio (/gallery/${created.id}).`,
          });
          this.folderTitle = '';
          this.folderSubtitle = '';
          this.folderClient = '';
          this.folderSummary = '';
          this.folderExtendedNotesText = '';
          this.folderCoverUrl = '';
          this.folderCloudinaryTag = '';
        },
        error: () => {
          this.isSavingFolder.set(false);
          this.statusBanner.set({
            type: 'error',
            text: 'No se pudo guardar la carpeta.',
          });
        },
      });
  }

  private readonly curatedFolderIds = new Set([
    'norte-argentino',
    'bonaburguense',
    'quebrada-y-terracota',
    'gastronomia-editorial',
    'noches-de-evento',
    'pueblos-del-norte',
    'salinas-y-altiplano',
    'retratos-y-escena',
  ]);

  isCustomFolder(folderId: string): boolean {
    return !this.curatedFolderIds.has(folderId.toLowerCase());
  }

  removeCustomFolder(folderId: string): void {
    this.portfolio.deleteCustomFolder(folderId).subscribe((deleted) => {
      if (deleted) {
        this.statusBanner.set({
          type: 'success',
          text: `Carpeta personalizada "${folderId}" eliminada.`,
        });
      }
    });
  }

  saveAdaptersConfig(event: Event): void {
    event.preventDefault();
    this.portfolio.updateRuntimeConfig(this.configDraft);
    this.manifestJsonText = this.portfolio.exportManifest();
    this.statusBanner.set({
      type: 'success',
      text: 'Configuración de adaptadores hexagonales actualizada en caliente.',
    });
  }

  resetAdaptersToDefault(): void {
    this.portfolio.resetRuntimeConfig();
    this.configDraft = { ...this.portfolio.runtimeConfig() };
    this.manifestJsonText = this.portfolio.exportManifest();
    this.statusBanner.set({
      type: 'success',
      text: 'Adaptadores restaurados a los valores predeterminados de producción.',
    });
  }

  setMediaAdapter(adapter: MediaAdapterType): void {
    this.configDraft.mediaAdapter = adapter;
  }

  setEmailAdapter(adapter: EmailAdapterType): void {
    this.configDraft.emailAdapter = adapter;
  }

  generateManifestExport(): void {
    this.manifestJsonText = this.portfolio.exportManifest();
    this.statusBanner.set({
      type: 'success',
      text: 'Manifiesto JSON generado. Podés copiarlo o respaldarlo para migrar de host.',
    });
  }

  importManifestFromText(): void {
    if (!this.manifestJsonText.trim()) return;
    const ok = this.portfolio.importManifest(this.manifestJsonText);
    if (ok) {
      this.configDraft = { ...this.portfolio.runtimeConfig() };
      this.statusBanner.set({
        type: 'success',
        text: 'Manifiesto JSON importado correctamente. Catálogo y configuración sincronizados.',
      });
    } else {
      this.statusBanner.set({
        type: 'error',
        text: 'El JSON ingresado no tiene un formato de manifiesto válido.',
      });
    }
  }

  refreshInquiries(): void {
    this.inquiries.set(this.emailPort.getInquiryLog());
  }

  clearInquiries(): void {
    this.emailPort.clearInquiryLog();
    this.refreshInquiries();
    this.statusBanner.set({
      type: 'success',
      text: 'Registro local de consultas limpiado.',
    });
  }
}
