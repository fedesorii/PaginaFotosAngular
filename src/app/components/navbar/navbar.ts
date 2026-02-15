import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  // Signal para controlar si el menú móvil está visible
  isMenuOpen = signal(false);

  // Función para abrir/cerrar al hacer clic
  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }
  
  // Función para cerrar el menú cuando se hace clic en un enlace
  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
