import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMAIL_NOTIFICATION_PORT } from '../../core/ports/email-notification.port';
import { MoodboardService } from '../../core/services/moodboard.service';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { ContactInquiry, EmailDeliveryResult } from '../../core/domain/models/inquiry.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  private readonly emailPort = inject(EMAIL_NOTIFICATION_PORT);
  private readonly route = inject(ActivatedRoute);
  readonly moodboard = inject(MoodboardService);
  readonly portfolio = inject(PortfolioStateService);

  readonly serviceOptions = [
    'Cobertura de Eventos & Aniversarios',
    'Fotografía Gastronómica & Producto',
    'Sesión Editorial & Retrato',
    'Crónica de Viaje / Paisaje / Arquitectura',
    'Proyecto Integral a Medida',
  ];

  clientName = '';
  clientEmail = '';
  clientPhone = '';
  serviceType = this.serviceOptions[0];
  eventDate = '';
  eventLocation = '';
  subject = '';
  message = '';

  readonly isSending = signal<boolean>(false);
  readonly deliveryResult = signal<EmailDeliveryResult | null>(null);
  readonly errorMessage = signal<string>('');

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const requestedService = params.get('service');
      if (requestedService) {
        const match = this.serviceOptions.find((opt) =>
          opt.toLowerCase().includes(requestedService.toLowerCase())
        );
        this.serviceType = match || requestedService;
        if (!this.subject) {
          this.subject = `Propuesta: ${requestedService}`;
        }
      }
    });
  }

  selectService(option: string): void {
    this.serviceType = option;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.clientName.trim() || !this.clientEmail.trim() || !this.message.trim()) {
      this.errorMessage.set('Por favor completá tu nombre, email y los detalles del proyecto.');
      return;
    }

    this.isSending.set(true);
    this.errorMessage.set('');
    this.deliveryResult.set(null);

    const inquiry: ContactInquiry = {
      clientName: this.clientName.trim(),
      clientEmail: this.clientEmail.trim(),
      clientPhone: this.clientPhone.trim() || undefined,
      serviceType: this.serviceType,
      eventDate: this.eventDate.trim() || undefined,
      eventLocation: this.eventLocation.trim() || undefined,
      subject: this.subject.trim() || `${this.serviceType} — ${this.clientName.trim()}`,
      message: this.message.trim(),
      moodboardItems: [...this.moodboard.items()],
      createdAt: new Date().toISOString(),
    };

    this.emailPort.sendInquiry(inquiry).subscribe({
      next: (result) => {
        this.isSending.set(false);
        this.deliveryResult.set(result);
        this.clientName = '';
        this.clientEmail = '';
        this.clientPhone = '';
        this.eventDate = '';
        this.eventLocation = '';
        this.subject = '';
        this.message = '';
      },
      error: () => {
        this.isSending.set(false);
        this.errorMessage.set(
          'No se pudo procesar el envío en este momento. Podés escribir directamente a ignacionahuel1@hotmail.com.'
        );
      },
    });
  }

  resetConfirmation(): void {
    this.deliveryResult.set(null);
  }
}
