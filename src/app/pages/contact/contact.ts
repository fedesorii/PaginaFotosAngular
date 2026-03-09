import { Component } from '@angular/core';
import { sendForm, type EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  imports: [],
  standalone: true,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  isSending = false;
  isSent = false;
  errorMessage = '';

  onSubmit(event: Event) {
    event.preventDefault(); // Evita que la página parpadee al enviar
    this.isSending = true;
    this.errorMessage = '';

    const form = event.target as HTMLFormElement;

    // Se envía el formulario utilizando EmailJS
    sendForm(
      'TU_SERVICE_ID',     // 1. Reemplaza con tu Service ID
        'TU_TEMPLATE_ID',    // 2. Reemplaza con tu Template ID
        form,
        {
          publicKey: 'TU_PUBLIC_KEY', // 3. Reemplaza con tu Public Key
        }
    ).then(() => {
      this.isSent = true;
      this.isSending = false;
      form.reset(); // Limpia el formulario después de enviar

      // el boton se resetea tras 10 segundos para permitir nuevos envíos
      setTimeout(() => {
        this.isSent = false;
      }, 10000);
      }, (error) => {
        const err = error as EmailJSResponseStatus;
        console.error('Error al enviar:', err.text);
        this.isSending = false;
        this.errorMessage = 'Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
      }
    ); 
  }
}
