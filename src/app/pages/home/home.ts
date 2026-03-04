import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Gallery } from '../../services/gallery';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private galleryService = inject(Gallery);

  galleries = toSignal(this.galleryService.getGalleriesFromCloudinary(), { initialValue: [] });
}
