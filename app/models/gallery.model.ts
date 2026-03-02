export interface Gallery {
  id: string; // Ejemplo: 'boda-playa-2026'
  title: string; // Ejemplo: 'Boda en la Playa'
  coverImg: string; // URL de la imagen de portada
  description: string;
  images: string[]; // Lista de URLs de todas las fotos del evento
}
