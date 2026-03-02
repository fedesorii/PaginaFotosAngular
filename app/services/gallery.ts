import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface CloudinaryResponse {
  resources: {
    public_id: string;
    version: string;
    format: string;
  }[];
}

@Injectable({
  providedIn: 'root', // Servicio disponible en toda la aplicación
})
export class Gallery {
  private http = inject(HttpClient);

  private cloudName = 'ddozsonun'; // Reemplaza con tu Cloud Name de Cloudinary

  //Acá cargamos los objetos de las galerías
private data = [
  {
    id: 'bonaburguense',
    title: 'Boda Bonaburguense',
    tag: 'galeria-bonaburguense', // El tag que creaste en Cloudinary
    // Para la Home, ponemos una foto manual estática o de Cloudinary
    coverPhoto: 'https://res.cloudinary.com/ddozsonun/image/upload/q_auto,f_auto/v1772426127/BonaBurguense_00.jpg' 
  },
  // Aquí agregarías el siguiente evento en el futuro
];

  // private data = [
  //   {
  //     id: 'bodas',
  //     title: 'Bodas de Ensueño',
  //     photos: ['https://picsum.photos/id/103/800', 'https://picsum.photos/id/104/800'],
  //   },
  //   {
  //     id: 'retratos',
  //     title: 'Retratos Urbanos',
  //     photos: ['https://picsum.photos/id/64/800', 'https://picsum.photos/id/65/800'],
  //   },
  //   {
  //     id: 'lorem',
  //     title: 'lorem ipsum',
  //     photos: ['https://picsum.photos/id/30/800', 'https://picsum.photos/id/31/800'],
  //   },
  //   {
  //     id: 'abba',
  //     title: 'Navida Habba',
  //     photos: ['https://picsum.photos/id/130/800', 'https://picsum.photos/id/131/800'],
  //   },
  //   {
  //     id: 'ipsum',
  //     title: 'ipsum lorem',
  //     photos: ['https://picsum.photos/id/12/800', 'https://picsum.photos/id/13/800'],
  //   },
  //   {
  //     id: 'Perry',
  //     title: 'El Ornitorrinco',
  //     photos: ['https://picsum.photos/id/3/800', 'https://picsum.photos/id/4/800'],
  //   },
  //   {
  //     id: 'Arctic Monkeys',
  //     title: 'Do I Wanna Know?',
  //     photos: ['https://picsum.photos/id/250/800', 'https://picsum.photos/id/251/800'],
  //   },
  //   {
  //     id: 'nana nana nana nana',
  //     title: 'BATMAN!!',
  //     photos: ['https://picsum.photos/id/198/800', 'https://picsum.photos/id/199/800'],
  //   },
  // ];

  getAll() {
    return this.data;
  }

  getById(id: string) {
    return this.data.find((g) => g.id === id);
  }

  getPhotosByTag(tag: string): Observable<string[]> {
    const url = `https://res.cloudinary.com/${this.cloudName}/image/list/${tag}.json`;

    return this.http.get<CloudinaryResponse>(url).pipe(
      map(response => {
        // Transformamos los datos crudos en URLs de imágenes optimizadas
        return response.resources.map(res => 
          `https://res.cloudinary.com/${this.cloudName}/image/upload/q_auto,f_auto/v${res.version}/${res.public_id}.${res.format}`
        );
      })
    );
  }
}
