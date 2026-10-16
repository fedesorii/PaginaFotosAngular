import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { MoodboardService } from '../../core/services/moodboard.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly portfolioState = inject(PortfolioStateService);
  readonly moodboard = inject(MoodboardService);

  readonly isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleTheme(): void {
    this.portfolioState.toggleDarkroomMode();
  }

  openMoodboard(): void {
    this.closeMenu();
    this.moodboard.toggleDrawer();
  }
}
