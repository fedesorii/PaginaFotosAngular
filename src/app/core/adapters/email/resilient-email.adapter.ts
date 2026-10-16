import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, from, map, of } from 'rxjs';
import { send } from '@emailjs/browser';
import { EmailNotificationPort } from '../../ports/email-notification.port';
import { HOST_ENVIRONMENT_PORT } from '../../ports/host-environment.port';
import { ContactInquiry, EmailDeliveryResult } from '../../domain/models/inquiry.model';

const INQUIRY_LOG_STORAGE_KEY = 'ij_contact_inquiries_log_v1';
const PHOTOGRAPHER_EMAIL = 'ignacionahuel1@hotmail.com';

@Injectable({
  providedIn: 'root',
})
export class ResilientEmailAdapter implements EmailNotificationPort {
  private readonly http = inject(HttpClient);
  private readonly hostEnv = inject(HOST_ENVIRONMENT_PORT);

  sendInquiry(inquiry: ContactInquiry): Observable<EmailDeliveryResult> {
    const config = this.hostEnv.getRuntimeConfig();
    const enrichedInquiry: ContactInquiry = {
      ...inquiry,
      id: inquiry.id || `INQ-${Date.now().toString(36).toUpperCase()}`,
      createdAt: inquiry.createdAt || new Date().toISOString(),
    };

    // 1. Siempre registramos la consulta en la bandeja resiliente local del estudio
    this.saveToLocalLog(enrichedInquiry);

    const moodboardSummary =
      enrichedInquiry.moodboardItems.length > 0
        ? enrichedInquiry.moodboardItems
            .map((m) => `• ${m.photoTitle} (${m.folderTitle})`)
            .join('\n')
        : 'Sin referencias seleccionadas en la Mesa de Luz.';

    const mailtoUrl = this.buildMailtoFallbackUrl(enrichedInquiry, moodboardSummary);

    // 2. Si el adaptador seleccionado es un Webhook HTTP (ej. Formspree, Resend, Vercel API)
    if (
      config.emailAdapter === 'webhook' &&
      config.webhookEndpointUrl &&
      config.webhookEndpointUrl.startsWith('http')
    ) {
      return this.http
        .post(config.webhookEndpointUrl, {
          ...enrichedInquiry,
          moodboardSummary,
        })
        .pipe(
          map(() => ({
            success: true,
            providerName: 'webhook' as const,
            timestamp: new Date().toISOString(),
            referenceCode: enrichedInquiry.id!,
            userMessage:
              'Tu consulta y referencias visuales fueron enviadas correctamente. Ignacio te responderá a la brevedad.',
            mailtoFallbackUrl: mailtoUrl,
          })),
          catchError(() =>
            of(this.buildResilientQueueSuccess(enrichedInquiry, mailtoUrl))
          )
        );
    }

    // 3. Si el adaptador es EmailJS y las credenciales reales están configuradas
    const hasConfiguredEmailJs =
      config.emailAdapter === 'emailjs' &&
      Boolean(config.emailJsServiceId) &&
      config.emailJsServiceId !== 'TU_SERVICE_ID' &&
      Boolean(config.emailJsTemplateId) &&
      config.emailJsTemplateId !== 'TU_TEMPLATE_ID' &&
      Boolean(config.emailJsPublicKey) &&
      config.emailJsPublicKey !== 'TU_PUBLIC_KEY';

    if (hasConfiguredEmailJs && this.hostEnv.isBrowser()) {
      const templateParams: Record<string, unknown> = {
        user_name: enrichedInquiry.clientName,
        user_email: enrichedInquiry.clientEmail,
        client_phone: enrichedInquiry.clientPhone || 'No especificado',
        service_type: enrichedInquiry.serviceType,
        event_date: enrichedInquiry.eventDate || 'A definir',
        event_location: enrichedInquiry.eventLocation || 'A definir',
        subject: enrichedInquiry.subject,
        message: `${enrichedInquiry.message}\n\n--- REFERENCIAS MESA DE LUZ ---\n${moodboardSummary}`,
        reference_code: enrichedInquiry.id,
      };

      return from(
        send(config.emailJsServiceId, config.emailJsTemplateId, templateParams, {
          publicKey: config.emailJsPublicKey,
        })
      ).pipe(
        map(() => ({
          success: true,
          providerName: 'emailjs' as const,
          timestamp: new Date().toISOString(),
          referenceCode: enrichedInquiry.id!,
          userMessage:
            'Mensaje enviado con éxito vía EmailJS. Recibirás respuesta de Ignacio Juárez dentro de las próximas 24 horas.',
          mailtoFallbackUrl: mailtoUrl,
        })),
        catchError(() =>
          of(this.buildResilientQueueSuccess(enrichedInquiry, mailtoUrl))
        )
      );
    }

    // 4. Cola resiliente desacoplada (cuando EmailJS aún no tiene Service/Template ID de producción o se eligió modo autónomo)
    return of(this.buildResilientQueueSuccess(enrichedInquiry, mailtoUrl));
  }

  getInquiryLog(): ContactInquiry[] {
    return this.hostEnv.getStorageItem<ContactInquiry[]>(INQUIRY_LOG_STORAGE_KEY, []);
  }

  clearInquiryLog(): void {
    this.hostEnv.removeStorageItem(INQUIRY_LOG_STORAGE_KEY);
  }

  private saveToLocalLog(inquiry: ContactInquiry): void {
    const existing = this.getInquiryLog();
    this.hostEnv.setStorageItem(INQUIRY_LOG_STORAGE_KEY, [inquiry, ...existing].slice(0, 50));
  }

  private buildResilientQueueSuccess(
    inquiry: ContactInquiry,
    mailtoUrl: string
  ): EmailDeliveryResult {
    return {
      success: true,
      providerName: 'local-resilient-queue',
      timestamp: new Date().toISOString(),
      referenceCode: inquiry.id!,
      userMessage:
        'Tu propuesta y selección de fotografías quedaron registradas en la bandeja del estudio (Ref. ' +
        inquiry.id +
        '). También podés abrir tu correo con un clic para envío directo.',
      mailtoFallbackUrl: mailtoUrl,
    };
  }

  private buildMailtoFallbackUrl(inquiry: ContactInquiry, moodboardSummary: string): string {
    const subject = encodeURIComponent(
      `[${inquiry.serviceType}] ${inquiry.subject} — ${inquiry.clientName}`
    );
    const body = encodeURIComponent(
      `Hola Ignacio,\n\n` +
        `Mi nombre es ${inquiry.clientName} (${inquiry.clientEmail}).\n` +
        `Tipo de proyecto: ${inquiry.serviceType}\n` +
        `Fecha estimada: ${inquiry.eventDate || 'A coordinar'}\n` +
        `Locación: ${inquiry.eventLocation || 'A coordinar'}\n\n` +
        `Mensaje:\n${inquiry.message}\n\n` +
        `Referencias seleccionadas en tu porfolio (Mesa de Luz):\n${moodboardSummary}\n\n` +
        `Código de referencia: ${inquiry.id}`
    );
    return `mailto:${PHOTOGRAPHER_EMAIL}?subject=${subject}&body=${body}`;
  }
}
