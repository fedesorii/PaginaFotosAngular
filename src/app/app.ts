import { Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { MoodboardService } from './core/services/moodboard.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  readonly moodboard = inject(MoodboardService);

  protected readonly title = signal('Ignacio Juárez · Porfolio Fotográfico');

  showScrollButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.showScrollButton = window.scrollY > 400;
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToQuoteWithMoodboard(): void {
    this.moodboard.closeDrawer();
    this.router.navigate(['/contact']);
  }
}
