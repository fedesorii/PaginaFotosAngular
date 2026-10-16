import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HOST_ENVIRONMENT_PORT } from '../ports/host-environment.port';
import { PHOTO_CATALOG_PORT } from '../ports/photo-catalog.port';
import { PHOTO_UPLOAD_PORT } from '../ports/photo-upload.port';
import { EMAIL_NOTIFICATION_PORT } from '../ports/email-notification.port';
import { BrowserHostAdapter } from '../adapters/host/browser-host.adapter';
import { CloudinaryPhotoAdapter } from '../adapters/media/cloudinary-photo.adapter';
import { HybridPhotoUploadAdapter } from '../adapters/upload/hybrid-photo-upload.adapter';
import { ResilientEmailAdapter } from '../adapters/email/resilient-email.adapter';

/**
 * Punto único de ensamblaje de Inyección de Dependencias para la Arquitectura Hexagonal.
 * Si en el futuro se desea reemplazar Cloudinary por AWS S3/Supabase, EmailJS por Resend,
 * o Vercel por otro host, solo se cambia la clase concreta en este archivo.
 */
export function providePortfolioHexagonalCore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: HOST_ENVIRONMENT_PORT,
      useExisting: BrowserHostAdapter,
    },
    {
      provide: PHOTO_CATALOG_PORT,
      useExisting: CloudinaryPhotoAdapter,
    },
    {
      provide: PHOTO_UPLOAD_PORT,
      useExisting: HybridPhotoUploadAdapter,
    },
    {
      provide: EMAIL_NOTIFICATION_PORT,
      useExisting: ResilientEmailAdapter,
    },
  ]);
}
