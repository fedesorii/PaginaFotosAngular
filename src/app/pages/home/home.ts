import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Gallery } from '../../services/gallery';
import { toSignal } from '@angular/core/rxjs-interop';
import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Reveal],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private galleryService = inject(Gallery);

  galleries = toSignal(this.galleryService.getGalleriesFromCloudinary(), { initialValue: [] });
}
