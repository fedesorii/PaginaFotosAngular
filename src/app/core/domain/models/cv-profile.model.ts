export interface CVTimelineEntry {
  year: string;
  role: string;
  projectOrClient: string;
  location: string;
  description: string;
  category: string;
  relatedFolderId?: string;
}

export interface ServiceOffering {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  idealFor: string;
  turnaround: string;
  sampleFolderId: string;
}

export interface EquipmentGroup {
  category: string;
  items: string[];
}

export interface PhotographerProfile {
  fullName: string;
  artisticName: string;
  roleTitle: string;
  location: string;
  availabilityText: string;
  manifestoQuote: string;
  shortPitch: string;
  biographyParagraphs: string[];
  portraitImageUrl: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  pinterestHandle: string;
  pinterestUrl: string;
  stats: {
    label: string;
    value: string;
    detail: string;
  }[];
  timeline: CVTimelineEntry[];
  services: ServiceOffering[];
  equipment: EquipmentGroup[];
  workflowSteps: {
    stepNumber: string;
    title: string;
    description: string;
  }[];
}
