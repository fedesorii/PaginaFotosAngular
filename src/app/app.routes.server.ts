import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { Gallery } from './services/gallery';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'gallery/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const galleryservice = inject(Gallery);
      const galleries = galleryservice.getAll();
      return galleries.map(g => ({ id: g.id }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
