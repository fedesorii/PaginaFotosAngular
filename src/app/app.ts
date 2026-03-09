import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('PaginaFotosAngular');

  // Variable para controlar si el botón se muestra o no
  showScrollButton = false;

  // Escucha el evento de scroll en toda la ventana
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Si el usuario bajó más de 400 píxeles, mostramos el botón
    this.showScrollButton = window.scrollY > 400;
  }

  // Función para subir con un efecto suave
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
