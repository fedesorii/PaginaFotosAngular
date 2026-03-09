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

export interface GalleryItem {
  id: string;
  title: string;
  tag: string; // El tag que usaremos para cargar las fotos desde Cloudinary
  coverPhoto: string; // URL de la foto de portada para la Home
}

@Injectable({
  providedIn: 'root', // Servicio disponible en toda la aplicación
})
export class Gallery {
  private http = inject(HttpClient);
  private cloudName = 'ddozsonun'; // Reemplaza con tu Cloud Name de Cloudinary

  // 1. Busca automáticamente todas las fotos con la etiqueta 'portadas-home'
  getGalleriesFromCloudinary(): Observable<GalleryItem[]> {
    const url = `https://res.cloudinary.com/${this.cloudName}/image/list/portadas-home.json`;

    return this.http.get<CloudinaryResponse>(url).pipe(
      map(response => {
        return response.resources.sort((a, b) => a.public_id.localeCompare(b.public_id)).map(res => {
          // Extraemos el nombre de la carpeta (ej: "bonaburguense/foto00" -> "bonaburguense")
          const folderName = res.public_id.includes('/') ? res.public_id.split('/')[0] : res.public_id;

          // Formateamos el título para que quede presentable (ej: "boda-marina" -> "Boda Marina")
          const formattedTitle = folderName.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

          return {
            id: folderName,
            title: formattedTitle,
            tag: folderName,
            coverPhoto: `https://res.cloudinary.com/${this.cloudName}/image/upload/q_auto,f_auto,c_fill,ar_4:6,w_800/v${res.version}/${res.public_id}.${res.format}`,
          };
        });
      })
    );
  }

  // 2. Como el ID es el nombre de la carpeta, construimos la info al vuelo
  getById(id: string) {
    return {
      id,
      title: id.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
      tag: id,
    };
  }

  // 3. Busca las fotos usando el tag de la carpeta
  getPhotosByTag(tag: string): Observable<string[]> {
    const url = `https://res.cloudinary.com/${this.cloudName}/image/list/${tag}.json`;

    return this.http.get<CloudinaryResponse>(url).pipe(
      map(response => {
        // Transformamos los datos crudos en URLs de imágenes optimizadas
        return response.resources.map(res => 
          `https://res.cloudinary.com/${this.cloudName}/image/upload/q_auto,f_auto,c_fill,ar_4:6,w_800/v${res.version}/${res.public_id}.${res.format}`
        );
      })
    );
  }
}
