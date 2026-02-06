import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Servicio disponible en toda la aplicación
})
export class Gallery {
  //Acá cargamos los objetos de las galerías
  private data = [
    {
      id: 'bodas',
      title: 'Bodas de Ensueño',
      photos: ['https://picsum.photos/id/103/800', 'https://picsum.photos/id/104/800'],
    },
    {
      id: 'retratos',
      title: 'Retratos Urbanos',
      photos: ['https://picsum.photos/id/64/800', 'https://picsum.photos/id/65/800'],
    },
    {
      id: 'lorem',
      title: 'lorem ipsum',
      photos: ['https://picsum.photos/id/30/800', 'https://picsum.photos/id/31/800'],
    },
    {
      id: 'abba',
      title: 'Navida Habba',
      photos: ['https://picsum.photos/id/130/800', 'https://picsum.photos/id/131/800'],
    },
    {
      id: 'ipsum',
      title: 'ipsum lorem',
      photos: ['https://picsum.photos/id/12/800', 'https://picsum.photos/id/13/800'],
    },
    {
      id: 'Perry',
      title: 'El Ornitorrinco',
      photos: ['https://picsum.photos/id/3/800', 'https://picsum.photos/id/4/800'],
    },
    {
      id: 'Arctic Monkeys',
      title: 'Do I Wanna Know?',
      photos: ['https://picsum.photos/id/250/800', 'https://picsum.photos/id/251/800'],
    },
    {
      id: 'nana nana nana nana',
      title: 'BATMAN!!',
      photos: ['https://picsum.photos/id/198/800', 'https://picsum.photos/id/199/800'],
    },
  ];

  getAll() {
    return this.data;
  }

  getById(id: string) {
    return this.data.find((g) => g.id === id);
  }
}
