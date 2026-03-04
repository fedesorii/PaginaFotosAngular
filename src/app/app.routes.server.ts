import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { Gallery } from './services/gallery';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'gallery/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
