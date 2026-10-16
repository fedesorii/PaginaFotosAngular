import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Ignacio Juárez — Fotografía Documental, Eventos & Editorial',
  },
  {
    path: 'about-us',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
    title: 'CV Fotográfico & Servicios — Ignacio Juárez',
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
    title: 'Contacto & Presupuestos — Ignacio Juárez',
  },
  {
    path: 'studio',
    loadComponent: () => import('./pages/studio/studio').then((m) => m.Studio),
    title: 'Studio Admin & Adaptadores — Ignacio Juárez',
  },
  {
    path: 'gallery/:id',
    loadComponent: () =>
      import('./pages/gallery-detail/gallery-detail').then((m) => m.GalleryDetail),
    title: 'Archivo Visual — Ignacio Juárez',
  },
  { path: '**', redirectTo: '' },
];
