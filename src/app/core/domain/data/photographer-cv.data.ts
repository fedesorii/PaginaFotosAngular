import { PhotographerProfile } from '../models/cv-profile.model';

export const IGNACIO_JUAREZ_CV_PROFILE: PhotographerProfile = {
  fullName: 'Ignacio Nahuel Juárez',
  artisticName: 'Ignacio Juárez',
  roleTitle: 'Fotógrafo Documental, de Eventos, Producto & Paisaje',
  location: 'Quilmes · Zona Sur de Buenos Aires, Argentina (Disponible para viajes)',
  availabilityText: 'Agenda Abierta 2026 / 2027 — Eventos, Campañas Gastronómicas & Sesiones',
  manifestoQuote: 'Fotografía con identidad, pulso documental y luz propia.',
  shortPitch:
    'Fotógrafo autónomo especializado en narrar eventos en vivo, identidad gastronómica de producto, retratos ambientales y crónicas de paisaje con una estética honesta inspirada en el celuloide.',
  biographyParagraphs: [
    'Soy fotógrafo autónomo de la zona sur de Buenos Aires. Mi mirada comenzó a formarse recorriendo distintas provincias del país, siempre en búsqueda de escenas reales, arquitecturas con memoria y momentos auténticos.',
    'Trabajo con una fuerte influencia de la fotografía analógica de 35mm, priorizando la esencia, la naturalidad de los gestos y la nobleza de las texturas por encima del retoque artificial.',
    'Me especializo en cobertura de eventos sociales y de marca, fotografía gastronómica y de producto, retratos en locación y ensayos de paisaje, ofreciendo imágenes con colorimetría precisa, luz cuidada y una narrativa visual pensada para conectar y atraer.',
  ],
  portraitImageUrl: 'assets/FotoPerfil-NachoJuarez.jpeg',
  email: 'ignacionahuel1@hotmail.com',
  instagramHandle: '@igna99s',
  instagramUrl: 'https://www.instagram.com/igna99s/',
  pinterestHandle: '@ignacionahuel1',
  pinterestUrl: 'https://ar.pinterest.com/ignacionahuel1/',
  stats: [
    {
      label: 'Especialidades Clave',
      value: '04',
      detail: 'Eventos · Producto · Retrato · Paisaje',
    },
    {
      label: 'Estética & Revelado',
      value: '35mm',
      detail: 'Colorimetría inspirada en película analógica',
    },
    {
      label: 'Cobertura Geográfica',
      value: 'AR',
      detail: 'GBA, CABA y proyectos en todo el país',
    },
    {
      label: 'Entrega Curada',
      value: '100%',
      detail: 'Edición autoral placa por placa en alta resolución',
    },
  ],
  timeline: [
    {
      year: '2025 — Presente',
      role: 'Fotógrafo Principal & Director de Color',
      projectOrClient: 'Coberturas de Marca & Gastronomía (Bonaburguense II Aniversario)',
      location: 'Quilmes, Buenos Aires',
      description:
        'Dirección y cobertura integral de eventos de aniversario, registro documental de cocina en vivo y producción de catálogo gastronómico para comunicación comercial y redes.',
      category: 'Eventos & Producto',
      relatedFolderId: 'Bonaburguense',
    },
    {
      year: '2025',
      role: 'Autor & Fotógrafo Documental',
      projectOrClient: 'Serie Editorial "Norte Argentino: Crónica de Altura"',
      location: 'Salta & Jujuy (Quebrada de las Conchas, Purmamarca, Salinas Grandes)',
      description:
        'Expedición fotográfica a través de los Valles Calchaquíes, la Quebrada de Humahuaca y la Puna a 4.170 m s. n. m., desarrollando una colección de 15 placas sobre territorio, arquitectura de adobe y paisaje.',
      category: 'Ensayo Documental & Paisaje',
      relatedFolderId: 'norte-argentino',
    },
    {
      year: '2023 — 2025',
      role: 'Fotógrafo Autónomo de Sesiones & Eventos',
      projectOrClient: 'Clientes Privados, Emprendimientos & Proyectos Editoriales',
      location: 'Zona Sur GBA & CABA',
      description:
        'Desarrollo de sesiones de retrato en locación, fotografía de producto para marcas emergentes y coberturas nocturnas con luz ambiente.',
      category: 'Retrato & Eventos',
      relatedFolderId: 'retratos-y-escena',
    },
    {
      year: '2021 — 2023',
      role: 'Exploración Analógica & Laboratorio Digital',
      projectOrClient: 'Archivo Personal en 35mm & Óptica Clásica',
      location: 'Buenos Aires, Argentina',
      description:
        'Investigación sobre emulsiones fotográficas, comportamiento del grano, halación en luces nocturnas y construcción de perfiles de color propios.',
      category: 'Investigación Visual',
      relatedFolderId: 'noches-de-evento',
    },
  ],
  services: [
    {
      id: 'srv-eventos',
      code: '01 / EVENTOS',
      title: 'Cobertura Documental de Eventos & Aniversarios',
      subtitle: 'Festejos de marca, inauguraciones, bodas íntimas y noches en vivo',
      description:
        'Registro narrativo sin poses forzadas. Capturo la atmósfera real del lugar, la energía de los invitados, el detrás de escena y los detalles de ambientación con sensibilidad cinematográfica.',
      deliverables: [
        'Galería completa editada en alta resolución y formato web optimizado',
        'Selección express (Preview de 15-20 fotos en 24/48 hs para prensa y redes)',
        'Colorimetría autoral consistente en condiciones de luz nocturna o mixta',
      ],
      idealFor: 'Marcas gastronómicas, eventos culturales, aniversarios, bodas y lanzamientos',
      turnaround: 'Adelanto en 48 hs · Entrega final en 7 a 10 días',
      sampleFolderId: 'Bonaburguense',
    },
    {
      id: 'srv-producto',
      code: '02 / PRODUCTO & GASTRONOMÍA',
      title: 'Fotografía Gastronómica & Identidad de Producto',
      subtitle: 'Texturas reales, fuego en acción y dirección de arte para marcas',
      description:
        'Sesiones diseñadas para despertar los sentidos y elevar el valor percibido de tu marca. Desde tomas minimalistas en estudio o cocina hasta planos subjetivos (POV) con acción real.',
      deliverables: [
        'Pack de fotografías heroicas para carta, e-commerce, prensa y campañas',
        'Dirección de emplazamiento, manejo de reflejos y texturas en locación',
        'Formatos adaptados a grillas editoriales, historias y vía pública',
      ],
      idealFor: 'Restaurantes, hamburgueserías de autor, cafeterías, diseño e indumentaria',
      turnaround: '5 a 7 días hábiles',
      sampleFolderId: 'gastronomia-editorial',
    },
    {
      id: 'srv-editorial',
      code: '03 / RETRATO & EDITORIAL',
      title: 'Sesiones de Retrato, Lifestyle & Crónica de Viaje',
      subtitle: 'Retratos con luz natural, books de artistas y campañas en locación',
      description:
        'Sesiones personalizadas en exteriores o locaciones con carácter. Construimos juntos una estética honesta que refleje tu identidad profesional o artística sin rigidez.',
      deliverables: [
        'Asesoramiento previo de locación, horario de luz (Golden Hour / Blue Hour) y estilismo',
        'Dirección relajada durante la sesión priorizando la espontaneidad',
        'Retoque orgánico conservando la textura natural de la piel y el grano fino',
      ],
      idealFor: 'Artistas, músicos, profesionales independientes, editoriales de moda y turismo',
      turnaround: '7 días hábiles',
      sampleFolderId: 'norte-argentino',
    },
  ],
  equipment: [
    {
      category: 'Cuerpos & Formato',
      items: [
        'Sistema Full-Frame Digital de Alto Rango Dinámico',
        'Cámara Analógica Kodak 35mm para tomas de carácter',
        'Doble ranura de respaldo en vivo para seguridad en eventos',
      ],
    },
    {
      category: 'Óptica Fija & Reportaje',
      items: [
        '35mm f/1.8 — Narrativa ambiental, arquitectura y eventos nocturnos',
        '50mm f/1.4 — Perspectiva natural, gastronomía y retrato cercano',
        '85mm f/1.8 & 90mm Macro — Compresión paisajística y detalle fino',
      ],
    },
    {
      category: 'Laboratorio de Color',
      items: [
        'Perfiles propios inspirados en Kodak Portra 400, Ektar 100 y CineStill 800T',
        'Flujo de trabajo calibrado para pantalla y copia impresa Fine-Art',
        'Sistema de entrega con protección de autoría y marca de agua discreta',
      ],
    },
  ],
  workflowSteps: [
    {
      stepNumber: '01',
      title: 'Selección de Referencias & Moodboard',
      description:
        'Podés marcar tus fotografías favoritas directamente en este porfolio usando la Mesa de Luz para que definamos juntos el tono, la luz y el encuadre que buscás.',
    },
    {
      stepNumber: '02',
      title: 'Planificación de Luz & Locación',
      description:
        'Definimos el cronograma clave del evento o la hoja de ruta de la sesión para aprovechar los mejores momentos de luz natural o ambiental.',
    },
    {
      stepNumber: '03',
      title: 'Rodaje con Mirada Documental',
      description:
        'Trabajo de forma ágil y discreta durante el evento o guiando con naturalidad cada puesta en escena de producto y retrato.',
    },
    {
      stepNumber: '04',
      title: 'Curaduría, Colorimetría & Entrega',
      description:
        'Cada placa seleccionada pasa por un revelado autoral individual para lograr colores profundos, pieles honestas y una atmósfera atemporal.',
    },
  ],
};
