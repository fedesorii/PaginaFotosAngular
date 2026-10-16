export interface SelectedMoodboardItem {
  photoId: string;
  folderId: string;
  folderTitle: string;
  photoTitle: string;
  thumbUrl: string;
}

export interface ContactInquiry {
  id?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceType: string;
  eventDate?: string;
  eventLocation?: string;
  subject: string;
  message: string;
  moodboardItems: SelectedMoodboardItem[];
  createdAt: string;
}

export interface EmailDeliveryResult {
  success: boolean;
  providerName: 'emailjs' | 'webhook' | 'local-resilient-queue';
  timestamp: string;
  referenceCode: string;
  userMessage: string;
  mailtoFallbackUrl?: string;
}
