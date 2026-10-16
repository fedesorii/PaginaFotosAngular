import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly portfolioState = inject(PortfolioStateService);
  readonly currentYear = new Date().getFullYear();
}
