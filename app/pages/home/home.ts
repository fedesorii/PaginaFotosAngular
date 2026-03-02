import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Gallery } from '../../services/gallery';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private galleryService = inject(Gallery);

  galleries = this.galleryService.getAll();
}
