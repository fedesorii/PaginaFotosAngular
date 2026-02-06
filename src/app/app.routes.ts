import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { GalleryDetail } from './pages/gallery-detail/gallery-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'gallery/:id', component: GalleryDetail },
  { path: '**', redirectTo: '' }, // Redirige a Home si la ruta no existe
];
