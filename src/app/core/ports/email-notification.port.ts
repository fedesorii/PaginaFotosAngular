import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactInquiry, EmailDeliveryResult } from '../domain/models/inquiry.model';

/**
 * Puerto de salida (Hexagonal Architecture) para el envío de consultas y presupuestos.
 * Permite reemplazar EmailJS por Resend, SendGrid, Formspree, AWS SES o un Webhook propio
 * sin alterar la lógica ni el formulario de contacto.
 */
export interface EmailNotificationPort {
  /** Envía una consulta de cliente junto con su selección de fotografías (Moodboard) */
  sendInquiry(inquiry: ContactInquiry): Observable<EmailDeliveryResult>;

  /** Obtiene el historial de consultas almacenadas o enviadas para auditoría del administrador */
  getInquiryLog(): ContactInquiry[];

  /** Limpia el registro local de consultas */
  clearInquiryLog(): void;
}

export const EMAIL_NOTIFICATION_PORT = new InjectionToken<EmailNotificationPort>(
  'EMAIL_NOTIFICATION_PORT'
);
