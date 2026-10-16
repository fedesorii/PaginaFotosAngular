import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, Reveal],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly portfolio = inject(PortfolioStateService);
  readonly profile = this.portfolio.profile;
}
