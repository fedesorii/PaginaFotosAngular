import { AspectRatioVariant, GalleryCategory, PhotoAsset } from './photo.model';

export const CUSTOM_FOLDERS_STORAGE_KEY = 'ij_custom_folders_v1';
export const CUSTOM_PHOTOS_STORAGE_KEY = 'ij_custom_photos_by_folder_v1';

export type HostPlatformType = 'vercel' | 'github-pages' | 'netlify' | 'node-ssr' | 'browser-local';
export type MediaAdapterType = 'cloudinary-hybrid' | 'curated-local';
export type EmailAdapterType = 'emailjs' | 'webhook' | 'resilient-queue';

export interface PortfolioRuntimeConfig {
  mediaAdapter: MediaAdapterType;
  cloudinaryPrimaryCloudName: string;
  cloudinaryFallbackCloudName: string;
  cloudinaryUploadPreset: string;
  emailAdapter: EmailAdapterType;
  emailJsServiceId: string;
  emailJsTemplateId: string;
  emailJsPublicKey: string;
  webhookEndpointUrl: string;
  watermarkText: string;
  watermarkEnabled: boolean;
}

export interface CreateFolderPayload {
  id?: string;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  location: string;
  year: string;
  clientOrContext: string;
  summary: string;
  extendedNotes: string[];
  coverPhotoUrl: string;
  coverAspectVariant?: AspectRatioVariant;
  cloudinaryTag?: string;
}

export interface UploadPhotoPayload {
  folderId: string;
  title: string;
  caption: string;
  imageUrlOrDataUrl: string;
  file?: File;
  aspectVariant?: AspectRatioVariant;
  location?: string;
  year?: string;
}

export interface UploadPhotoResult {
  success: boolean;
  providerUsed: 'cloudinary-api' | 'local-studio-adapter';
  asset: PhotoAsset;
  message: string;
}
