export type GalleryCategory = 'eventos' | 'gastronomia' | 'paisajes' | 'retratos' | 'documental';

export type AspectRatioVariant = 'portrait' | 'tall' | 'editorial' | 'compact' | 'landscape';

export interface PhotoExifMetadata {
  location?: string;
  year?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  filmStock?: string;
}

export interface PhotoAsset {
  id: string;
  publicId: string;
  folderId: string;
  index: number;
  title: string;
  caption: string;
  thumbUrl: string;
  highResUrl: string;
  width: number;
  height: number;
  aspectVariant: AspectRatioVariant;
  watermarkText: string;
  metadata: PhotoExifMetadata;
}

export interface FolderTechnicalSpecs {
  camera: string;
  optics: string;
  lighting: string;
  colorProfile: string;
  deliverable: string;
}

export interface GalleryFolder {
  id: string;
  slug: string;
  indexNumber: string;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  categoryLabel: string;
  location: string;
  year: string;
  clientOrContext: string;
  coverPhotoUrl: string;
  coverHighResUrl: string;
  coverAspectVariant: AspectRatioVariant;
  /** Breve descripción principal que aparece en el encabezado de la carpeta y en el hover editorial */
  summary: string;
  /** Párrafos extendidos desplegables ("Leer más...") inspirados en Levon Biss Microsculpture */
  extendedNotes: string[];
  technicalSpecs: FolderTechnicalSpecs;
  photoCount: number;
  cloudinaryTag: string;
  featured: boolean;
  /** Lista opcional pre-computada o curada de activos fotográficos de esta carpeta */
  curatedPhotos?: PhotoAsset[];
}
