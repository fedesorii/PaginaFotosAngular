import {
  AspectRatioVariant,
  GalleryFolder,
  PhotoAsset,
  PhotoExifMetadata,
} from '../models/photo.model';

export interface RawCloudinaryAssetDef {
  publicId: string;
  version: number;
  format: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  aspectVariant: AspectRatioVariant;
  metadata: PhotoExifMetadata;
}

const DEFAULT_WATERMARK = '© IGNACIO JUÁREZ · ARCHIVO FOTOGRÁFICO';

export function buildCloudinaryThumbUrl(
  cloudName: string,
  publicId: string,
  version: number | string,
  format = 'jpg',
  aspectVariant: AspectRatioVariant = 'portrait'
): string {
  const arMap: Record<AspectRatioVariant, string> = {
    tall: 'ar_3:5,c_fill,w_850',
    portrait: 'ar_4:6,c_fill,w_850',
    editorial: 'ar_4:5,c_fill,w_850',
    compact: 'ar_5:6,c_fill,w_850',
    landscape: 'ar_6:5,c_fill,w_900',
  };
  const transform = arMap[aspectVariant] ?? 'ar_4:6,c_fill,w_850';
  return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto:good,f_auto,${transform}/v${version}/${publicId}.${format}`;
}

export function buildCloudinaryHighResUrl(
  cloudName: string,
  publicId: string,
  version: number | string,
  format = 'jpg'
): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto:best,f_auto,c_limit,w_1800/v${version}/${publicId}.${format}`;
}

/**
 * Catálogo completo de las 15 placas originales de la serie "Norte Argentino"
 * tomadas por Ignacio Juárez.
 */
export const NORTE_ARGENTINO_ASSETS: RawCloudinaryAssetDef[] = [
  {
    publicId: 'norte-argentino/01',
    version: 1772681063,
    format: 'jpg',
    width: 1728,
    height: 2592,
    title: 'Vías hacia la Quebrada',
    caption:
      'Perspectiva lineal sobre los rieles históricos enmarcados por la monumentalidad verde de los valles salto-jujeños.',
    aspectVariant: 'tall',
    metadata: {
      location: 'Quebrada del Toro, Salta',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/4.0',
      shutterSpeed: '1/800s',
      iso: 'ISO 200',
      filmStock: 'Kodak Portra 400 Emulation',
    },
  },
  {
    publicId: 'norte-argentino/06',
    version: 1772681064,
    format: 'jpg',
    width: 1574,
    height: 2361,
    title: 'Escala Humana en Terracota',
    caption:
      'Dos figuras sobre la cresta erosionada frente a los paredones rojizos de la Quebrada de las Conchas.',
    aspectVariant: 'portrait',
    metadata: {
      location: 'Cafayate, Salta',
      year: '2025',
      focalLength: '85mm',
      aperture: 'f/5.6',
      shutterSpeed: '1/1000s',
      iso: 'ISO 160',
      filmStock: 'Kodak Ektar 100 Profile',
    },
  },
  {
    publicId: 'norte-argentino/14',
    version: 1772681066,
    format: 'jpg',
    width: 1701,
    height: 2551,
    title: 'Memoria en la Ladera',
    caption:
      'Arquitectura funeraria de adobe, flores de papel y piedra al pie de los cerros minerales en la Quebrada de Humahuaca.',
    aspectVariant: 'editorial',
    metadata: {
      location: 'Maimará, Jujuy',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/5.6',
      shutterSpeed: '1/640s',
      iso: 'ISO 200',
      filmStock: 'Warm Analog Chrome',
    },
  },
  {
    publicId: 'norte-argentino/03',
    version: 1772681057,
    format: 'jpg',
    width: 1712,
    height: 2567,
    title: 'Insignia y Tótem Andino',
    caption:
      'La bandera flameando contra el cielo cobalto del altiplano junto a tallas vernáculas de cardón e iconografía solar.',
    aspectVariant: 'tall',
    metadata: {
      location: 'Purmamarca, Jujuy',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/8.0',
      shutterSpeed: '1/1250s',
      iso: 'ISO 100',
      filmStock: 'Kodak Gold 200',
    },
  },
  {
    publicId: 'norte-argentino/11',
    version: 1772681059,
    format: 'jpg',
    width: 1667,
    height: 2501,
    title: 'Horizonte de Sal',
    caption:
      'Contemplación solitaria sobre la costra hexagonal infinita de las Salinas Grandes a más de 3.450 metros de altitud.',
    aspectVariant: 'compact',
    metadata: {
      location: 'Salinas Grandes, Jujuy',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/11',
      shutterSpeed: '1/2000s',
      iso: 'ISO 100',
      filmStock: 'Fuji Pro 400H Profile',
    },
  },
  {
    publicId: 'norte-argentino/02',
    version: 1772681070,
    format: 'jpg',
    width: 1728,
    height: 2592,
    title: 'Geometría del Camino Mineral',
    caption:
      'Trazo sinuoso de ripio que atraviesa estratos geológicos de óxido, cobre y ceniza volcánica.',
    aspectVariant: 'portrait',
    metadata: {
      location: 'Quebrada de las Conchas, Salta',
      year: '2025',
      focalLength: '70mm',
      aperture: 'f/6.3',
      shutterSpeed: '1/800s',
      iso: 'ISO 200',
      filmStock: 'Kodak Ektar 100 Profile',
    },
  },
  {
    publicId: 'norte-argentino/04',
    version: 1772681063,
    format: 'jpg',
    width: 1709,
    height: 2563,
    title: 'Mediodía en Purmamarca',
    caption:
      'Ritmo peatonal, textiles artesanales y fachadas de tierra cocida bajo el telón policromo del Cerro de los Siete Colores.',
    aspectVariant: 'editorial',
    metadata: {
      location: 'Purmamarca, Jujuy',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/5.6',
      shutterSpeed: '1/1000s',
      iso: 'ISO 160',
      filmStock: 'Kodak Portra 400 Emulation',
    },
  },
  {
    publicId: 'norte-argentino/05',
    version: 1772681066,
    format: 'jpg',
    width: 1645,
    height: 2469,
    title: 'Vigía del Desierto Rojo',
    caption:
      'Un cardón joven iluminado a contraluz resalta contra las murallas sedimentarias de arenisca roja.',
    aspectVariant: 'tall',
    metadata: {
      location: 'Valles Calchaquíes, Salta',
      year: '2025',
      focalLength: '85mm',
      aperture: 'f/4.5',
      shutterSpeed: '1/1250s',
      iso: 'ISO 200',
      filmStock: 'Analog Warmth II',
    },
  },
  {
    publicId: 'norte-argentino/07',
    version: 1772681066,
    format: 'jpg',
    width: 1728,
    height: 2592,
    title: 'Serpentina en la Cuesta del Obispo',
    caption:
      'La ruta provincial 33 descendiendo entre pastizales de altura, flora silvestre amarilla y bancos de nubes.',
    aspectVariant: 'portrait',
    metadata: {
      location: 'Cuesta del Obispo, Salta',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/8.0',
      shutterSpeed: '1/1000s',
      iso: 'ISO 160',
      filmStock: 'Kodak Gold 200',
    },
  },
  {
    publicId: 'norte-argentino/08',
    version: 1772681065,
    format: 'jpg',
    width: 1489,
    height: 2233,
    title: 'Ofrenda en la Corteza',
    caption:
      'Cruz devocional y flores secas abrazadas por la veta profunda de un algarrobo histórico.',
    aspectVariant: 'compact',
    metadata: {
      location: 'Tilcara, Jujuy',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/500s',
      iso: 'ISO 200',
      filmStock: 'Kodak Portra 800 Grain',
    },
  },
  {
    publicId: 'norte-argentino/09',
    version: 1772681059,
    format: 'jpg',
    width: 1716,
    height: 2574,
    title: 'Polinización de Altura',
    caption:
      'Estudio macro de luz natural: abeja melífera sobre inflorescencia silvestre con desenfoque orgánico.',
    aspectVariant: 'editorial',
    metadata: {
      location: 'Chicoana, Salta',
      year: '2025',
      focalLength: '90mm Macro',
      aperture: 'f/2.8',
      shutterSpeed: '1/1600s',
      iso: 'ISO 200',
      filmStock: 'Fuji Velvia 50 Tone',
    },
  },
  {
    publicId: 'norte-argentino/10',
    version: 1772681059,
    format: 'jpg',
    width: 1410,
    height: 2116,
    title: 'Cota 4.170 m s. n. m.',
    caption:
      'Retrato documental sobre el mojón geodésico de altura en el paso hacia las Salinas Grandes.',
    aspectVariant: 'tall',
    metadata: {
      location: 'Cuesta de Lipán (4.170 m), Jujuy',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/5.6',
      shutterSpeed: '1/1250s',
      iso: 'ISO 160',
      filmStock: 'Kodak Portra 400 Emulation',
    },
  },
  {
    publicId: 'norte-argentino/12',
    version: 1772681059,
    format: 'jpg',
    width: 1728,
    height: 2592,
    title: 'Tejados bajo la Niebla Andina',
    caption:
      'El valle habitado emergiendo entre laderas áridas mientras las nubes bajas acarician las cumbres.',
    aspectVariant: 'portrait',
    metadata: {
      location: 'Tilcara, Jujuy',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/7.1',
      shutterSpeed: '1/800s',
      iso: 'ISO 160',
      filmStock: 'Warm Analog Chrome',
    },
  },
  {
    publicId: 'norte-argentino/13',
    version: 1772681068,
    format: 'jpg',
    width: 1728,
    height: 2592,
    title: 'Pirca, Adobe y Café',
    caption:
      'Parador vernáculo construido en piedra seca y adobe rojo al pie de las montañas.',
    aspectVariant: 'compact',
    metadata: {
      location: 'Quebrada de Humahuaca, Jujuy',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/4.0',
      shutterSpeed: '1/640s',
      iso: 'ISO 200',
      filmStock: 'Kodak Gold 200',
    },
  },
  {
    publicId: 'norte-argentino/15',
    version: 1772681063,
    format: 'jpg',
    width: 1728,
    height: 2592,
    title: 'Apacheta en el Salar',
    caption:
      'Altar de piedras y lanas teñidas erigido en agradecimiento a la Pachamama sobre el desierto de sal.',
    aspectVariant: 'editorial',
    metadata: {
      location: 'Salinas Grandes, Jujuy',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/8.0',
      shutterSpeed: '1/1600s',
      iso: 'ISO 100',
      filmStock: 'Kodak Portra 400 Emulation',
    },
  },
];

/**
 * Catálogo completo de las 16 placas originales de la serie "Bonaburguense"
 * (Cobertura de Evento II Aniversario & Fotografía Gastronómica de Producto)
 * tomadas por Ignacio Juárez.
 */
export const BONABURGUENSE_ASSETS: RawCloudinaryAssetDef[] = [
  {
    publicId: 'Bonaburguense/06',
    version: 1772596685,
    format: 'jpg',
    width: 1728,
    height: 2592,
    title: 'Identidad Bona & Fuego Smash',
    caption:
      'Composición editorial cenital: smash burger con panceta crocante, cheddar fundido, aros de cebolla y gráfica azul cobalto.',
    aspectVariant: 'portrait',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/4.0',
      shutterSpeed: '1/160s',
      iso: 'ISO 400',
      filmStock: 'CineStill 800T Warmth',
    },
  },
  {
    publicId: 'Bonaburguense/01',
    version: 1772596682,
    format: 'jpg',
    width: 1674,
    height: 2511,
    title: 'Estudio sobre Acero Inoxidable',
    caption:
      'Fotografía de producto minimalista: el reflejo del pan brioche dorado y la costra Maillard sobre la mesada de cocina.',
    aspectVariant: 'tall',
    metadata: {
      location: 'Estudio / Cocina Bona, Quilmes',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/200s',
      iso: 'ISO 320',
      filmStock: 'Studio Crisp Neutral',
    },
  },
  {
    publicId: 'Bonaburguense/03',
    version: 1772596683,
    format: 'jpg',
    width: 1613,
    height: 2420,
    title: 'Dos Años frente a la Plancha',
    caption:
      'Crónica detrás del fuego: el humo real de la plancha envolviendo la espalda del cocinero durante el festejo del segundo aniversario.',
    aspectVariant: 'editorial',
    metadata: {
      location: 'Bonaburguense, Zona Sur GBA',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/2.0',
      shutterSpeed: '1/250s',
      iso: 'ISO 800',
      filmStock: 'Kodak Portra 800 Push',
    },
  },
  {
    publicId: 'Bonaburguense/04',
    version: 1772596683,
    format: 'jpg',
    width: 1728,
    height: 2592,
    title: 'Ritual Street-Food II Aniversario',
    caption:
      'Interacción directa entre producto e indumentaria conmemorativa "II" en plena noche de celebración.',
    aspectVariant: 'tall',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/3.5',
      shutterSpeed: '1/160s',
      iso: 'ISO 640',
      filmStock: 'Flash & Tungsten Mix',
    },
  },
  {
    publicId: 'Bonaburguense/02',
    version: 1772596687,
    format: 'jpg',
    width: 1501,
    height: 2250,
    title: 'Fachada Encendida',
    caption:
      'El frente de Bonaburguense colmado de comunidad bajo guirnaldas cálidas y el cartel luminoso en la noche del sur.',
    aspectVariant: 'compact',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/2.0',
      shutterSpeed: '1/125s',
      iso: 'ISO 1250',
      filmStock: 'CineStill 800T Night',
    },
  },
  {
    publicId: 'Bonaburguense/05',
    version: 1772596684,
    format: 'jpg',
    width: 1535,
    height: 2431,
    title: 'Cultura de Mesa & Redes',
    caption:
      'El instante previo al brindis capturado en doble plano: la experiencia real y su eco digital inmediato.',
    aspectVariant: 'portrait',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/2.2',
      shutterSpeed: '1/160s',
      iso: 'ISO 800',
      filmStock: 'Kodak Portra 800',
    },
  },
  {
    publicId: 'Bonaburguense/07',
    version: 1772596684,
    format: 'jpg',
    width: 1528,
    height: 2292,
    title: 'Inmersión en Barbacoa',
    caption:
      'Detalle de acción gastronómica: textura brillante de la salsa barbacoa y papas rústicas en primer plano.',
    aspectVariant: 'editorial',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/3.2',
      shutterSpeed: '1/200s',
      iso: 'ISO 400',
      filmStock: 'Warm Culinary LUT',
    },
  },
  {
    publicId: 'Bonaburguense/08',
    version: 1772596685,
    format: 'jpg',
    width: 1598,
    height: 2396,
    title: 'Gesto Espontáneo',
    caption:
      'Retrato cándido durante el evento: gorra gastada de la casa y risa genuina capturada sin pose.',
    aspectVariant: 'compact',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/2.0',
      shutterSpeed: '1/200s',
      iso: 'ISO 800',
      filmStock: 'Kodak Portra 800',
    },
  },
  {
    publicId: 'Bonaburguense/09',
    version: 1772596687,
    format: 'jpg',
    width: 1570,
    height: 2355,
    title: 'Coreografía de Despacho',
    caption:
      'Sincronía en la línea de armado exterior bajo las luces de kermesse durante el pico del evento.',
    aspectVariant: 'tall',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/2.2',
      shutterSpeed: '1/160s',
      iso: 'ISO 1000',
      filmStock: 'CineStill 800T Night',
    },
  },
  {
    publicId: 'Bonaburguense/10',
    version: 1772596686,
    format: 'jpg',
    width: 1557,
    height: 2337,
    title: 'Textura & Dip',
    caption:
      'Primer plano de aro de cebolla crujiente emergiendo de la salsa especial de la casa.',
    aspectVariant: 'portrait',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/3.5',
      shutterSpeed: '1/200s',
      iso: 'ISO 400',
      filmStock: 'Studio Crisp Neutral',
    },
  },
  {
    publicId: 'Bonaburguense/11',
    version: 1772596687,
    format: 'jpg',
    width: 1728,
    height: 2592,
    title: 'Comunidad en la Vereda',
    caption:
      'Contraluz nocturno: el cocinero en el centro de la escena rodeado por los habitués del lugar.',
    aspectVariant: 'editorial',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/2.0',
      shutterSpeed: '1/125s',
      iso: 'ISO 1250',
      filmStock: 'CineStill 800T Night',
    },
  },
  {
    publicId: 'Bonaburguense/12',
    version: 1772596688,
    format: 'jpg',
    width: 1530,
    height: 2295,
    title: 'Camaradería en la Barra',
    caption:
      'Energía festiva a través del ventanal: el equipo y los amigos celebrando dos años de historia.',
    aspectVariant: 'compact',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/160s',
      iso: 'ISO 800',
      filmStock: 'Kodak Gold Warmth',
    },
  },
  {
    publicId: 'Bonaburguense/13',
    version: 1772596688,
    format: 'jpg',
    width: 1452,
    height: 2177,
    title: 'Luz de Guirnalda',
    caption:
      'Retrato nocturno robado entre charlas y cervezas en la calle, con halo cálido de tungsteno.',
    aspectVariant: 'tall',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/160s',
      iso: 'ISO 1250',
      filmStock: 'CineStill 800T Halation',
    },
  },
  {
    publicId: 'Bonaburguense/14',
    version: 1772596689,
    format: 'jpg',
    width: 1728,
    height: 2592,
    title: 'Bandeja Insignia',
    caption:
      'Contraste cromático entre el azul intenso del papel parafinado, el dorado del brioche y el aluminio.',
    aspectVariant: 'portrait',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '35mm',
      aperture: 'f/4.0',
      shutterSpeed: '1/200s',
      iso: 'ISO 400',
      filmStock: 'Studio Crisp Neutral',
    },
  },
  {
    publicId: 'Bonaburguense/15',
    version: 1772596690,
    format: 'jpg',
    width: 1614,
    height: 2420,
    title: 'Experiencia en Primera Persona',
    caption:
      'Plano subjetivo (POV) pensado para piezas de comunicación comercial y alto impacto en redes.',
    aspectVariant: 'editorial',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '28mm',
      aperture: 'f/4.0',
      shutterSpeed: '1/200s',
      iso: 'ISO 400',
      filmStock: 'Warm Culinary LUT',
    },
  },
  {
    publicId: 'Bonaburguense/16',
    version: 1772596690,
    format: 'jpg',
    width: 1724,
    height: 2587,
    title: 'Anatomía del Smash',
    caption:
      'Primer plano macro de la costra caramelizada, doble cheddar fundido y aros de cebolla recién dorados.',
    aspectVariant: 'compact',
    metadata: {
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      focalLength: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/200s',
      iso: 'ISO 400',
      filmStock: 'Warm Culinary LUT',
    },
  },
];

export function mapRawDefsToPhotoAssets(
  defs: RawCloudinaryAssetDef[],
  folderId: string,
  cloudName: string,
  watermarkText = DEFAULT_WATERMARK
): PhotoAsset[] {
  return defs.map((def, idx) => ({
    id: `${folderId}__${def.publicId.replace('/', '-')}`,
    publicId: def.publicId,
    folderId,
    index: idx + 1,
    title: def.title,
    caption: def.caption,
    thumbUrl: buildCloudinaryThumbUrl(
      cloudName,
      def.publicId,
      def.version,
      def.format,
      def.aspectVariant
    ),
    highResUrl: buildCloudinaryHighResUrl(cloudName, def.publicId, def.version, def.format),
    width: def.width,
    height: def.height,
    aspectVariant: def.aspectVariant,
    watermarkText,
    metadata: def.metadata,
  }));
}

/**
 * Construye el catálogo curado de 8 carpetas/series que aparecen como portadas
 * con desnivel (collage) en el Landing y que permiten recorrer cada evento o sesión.
 * Utiliza exclusivamente las 31 fotografías reales de Ignacio Juárez alojadas en Cloudinary.
 */
export function buildCuratedFolders(
  cloudName: string,
  watermarkText = DEFAULT_WATERMARK
): GalleryFolder[] {
  const byId = new Map<string, RawCloudinaryAssetDef>();
  for (const item of [...NORTE_ARGENTINO_ASSETS, ...BONABURGUENSE_ASSETS]) {
    byId.set(item.publicId, item);
  }

  const pickAssets = (ids: string[], folderId: string): PhotoAsset[] => {
    const rawList = ids
      .map((id) => byId.get(id))
      .filter((x): x is RawCloudinaryAssetDef => Boolean(x));
    return mapRawDefsToPhotoAssets(rawList, folderId, cloudName, watermarkText);
  };

  const folders: GalleryFolder[] = [
    {
      id: 'norte-argentino',
      slug: 'norte-argentino',
      indexNumber: '01',
      title: 'Norte Argentino: Crónica de Altura',
      subtitle: 'Ensayo Documental & Paisaje en Salta y Jujuy',
      category: 'paisajes',
      categoryLabel: 'Paisaje & Crónica',
      location: 'Salta & Jujuy, Argentina',
      year: '2025',
      clientOrContext: 'Proyecto Editorial Autónomo',
      coverPhotoUrl: buildCloudinaryThumbUrl(
        cloudName,
        'norte-argentino/01',
        1772681063,
        'jpg',
        'tall'
      ),
      coverHighResUrl: buildCloudinaryHighResUrl(cloudName, 'norte-argentino/01', 1772681063),
      coverAspectVariant: 'tall',
      summary:
        'Un recorrido visual desde los valles verdes y las vías férreas de Salta hasta la inmensidad blanca de las Salinas Grandes a 4.170 metros de altura, explorando la relación entre la escala geológica y la huella humana.',
      extendedNotes: [
        'Realizada a lo largo de las rutas de montaña que conectan la Quebrada de las Conchas, la Cuesta del Obispo, Purmamarca, Maimará, Tilcara y la Puna jujeña, esta serie busca capturar el silencio mineral del noroeste argentino con una sensibilidad heredada del formato analógico.',
        'En lugar de postales estáticas, cada encuadre persigue el diálogo entre la inmensidad del relieve —paredones de terracota, estratos policromos y salares infinitos— y los pequeños gestos cotidianos: caminantes sobre la cresta roja, apachetas rituales, tejidos al sol y pueblos de adobe.',
        'La colorimetría fue trabajada respetando la temperatura cálida de la tierra norteña y el azul profundo de los cielos de altura, manteniendo texturas orgánicas y transiciones suaves en las altas luces.',
      ],
      technicalSpecs: {
        camera: 'Full-Frame Digital + Referencia Kodak 35mm',
        optics: '35mm f/1.8 · 50mm f/1.4 · 85mm f/1.8',
        lighting: 'Luz natural de alta montaña (3.000m – 4.170m)',
        colorProfile: 'Curva Analógica Portra / Ektar Terracota',
        deliverable: 'Serie Editorial Fine-Art & Licencias de Marca',
      },
      photoCount: NORTE_ARGENTINO_ASSETS.length,
      cloudinaryTag: 'norte-argentino',
      featured: true,
      curatedPhotos: mapRawDefsToPhotoAssets(
        NORTE_ARGENTINO_ASSETS,
        'norte-argentino',
        cloudName,
        watermarkText
      ),
    },
    {
      id: 'Bonaburguense',
      slug: 'Bonaburguense',
      indexNumber: '02',
      title: 'Bonaburguense: II Aniversario',
      subtitle: 'Cobertura Documental de Evento & Gastronomía Smash',
      category: 'eventos',
      categoryLabel: 'Eventos & Gastronomía',
      location: 'Quilmes, Buenos Aires',
      year: '2025',
      clientOrContext: 'Bonaburguense — Burgas & Milangas',
      coverPhotoUrl: buildCloudinaryThumbUrl(
        cloudName,
        'Bonaburguense/06',
        1772596685,
        'jpg',
        'portrait'
      ),
      coverHighResUrl: buildCloudinaryHighResUrl(cloudName, 'Bonaburguense/06', 1772596685),
      coverAspectVariant: 'portrait',
      summary:
        'Cobertura integral del segundo aniversario de Bonaburguense: una fusión entre el pulso nocturno del evento en la calle, el humo vivo de la plancha y fotografía gastronómica de producto con identidad urbana.',
      extendedNotes: [
        'Cuando una marca gastronómica celebra su aniversario, necesita mucho más que fotos aisladas de comida: necesita transmitir el calor de su cocina, su comunidad en la vereda y la textura real de su producto.',
        'La sesión se dividió en dos tiempos complementarios: primero, un relevamiento de producto sobre acero inoxidable y bandejas serigrafiadas para destacar el dorado del pan brioche, la costra caramelizada del medallón smash y la identidad gráfica azul eléctrico de la marca.',
        'Luego, al caer la noche, el enfoque viró al fotoperiodismo de eventos bajo las guirnaldas de luz cálida: el equipo despachando entre el humo, las remeras conmemorativas "Dos Años Est. 2022" y los retratos espontáneos de clientes y amigos.',
      ],
      technicalSpecs: {
        camera: 'Cuerpo Full-Frame de Alta Sensibilidad ISO',
        optics: '35mm f/1.8 Documental · 50mm f/1.4 Producto',
        lighting: 'Luz continua de tungsteno, guirnaldas y rebote puntual',
        colorProfile: 'CineStill 800T Night + Warm Culinary Tone',
        deliverable: 'Campaña Digital, Prensa, Redes & Archivo de Marca',
      },
      photoCount: BONABURGUENSE_ASSETS.length,
      cloudinaryTag: 'Bonaburguense',
      featured: true,
      curatedPhotos: mapRawDefsToPhotoAssets(
        BONABURGUENSE_ASSETS,
        'Bonaburguense',
        cloudName,
        watermarkText
      ),
    },
    {
      id: 'quebrada-y-terracota',
      slug: 'quebrada-y-terracota',
      indexNumber: '03',
      title: 'Geología del Silencio',
      subtitle: 'Quebradas, Cuestas & Relieve Mineral',
      category: 'paisajes',
      categoryLabel: 'Paisaje & Territorio',
      location: 'Cafayate & Cuesta del Obispo, Salta',
      year: '2025',
      clientOrContext: 'Colección Fine-Art & Turismo Editorial',
      coverPhotoUrl: buildCloudinaryThumbUrl(
        cloudName,
        'norte-argentino/06',
        1772681064,
        'jpg',
        'editorial'
      ),
      coverHighResUrl: buildCloudinaryHighResUrl(cloudName, 'norte-argentino/06', 1772681064),
      coverAspectVariant: 'editorial',
      summary:
        'Estudio sobre la monumentalidad de las formaciones sedimentarias de los Valles Calchaquíes, donde los caminos de ripio y los cardones trazan líneas de escala frente a murallas de arcilla roja.',
      extendedNotes: [
        'Inspirada en la pintura paisajística clásica y el cine de carretera, esta carpeta reúne las placas donde la topografía cobra protagonismo absoluto. En la Quebrada de las Conchas y la Cuesta del Obispo, la luz oblicua modela cada pliegue de la montaña como una escultura.',
        'Ideal para editoriales de viajes, campañas de hospitalidad boutique, bodegas de altura y proyectos arquitectónicos que buscan dialogar con el paisaje argentino.',
      ],
      technicalSpecs: {
        camera: 'Full-Frame Alta Resolución',
        optics: '35mm · 70mm · 85mm Teleobjetivo Corto',
        lighting: 'Luz diurna filtrada por nubes de montaña',
        colorProfile: 'Terracota & Ocre Mineral (Ektar 100)',
        deliverable: 'Impresiones Fine-Art & Campañas de Destino',
      },
      photoCount: 8,
      cloudinaryTag: 'norte-argentino',
      featured: true,
      curatedPhotos: pickAssets(
        [
          'norte-argentino/06',
          'norte-argentino/02',
          'norte-argentino/05',
          'norte-argentino/07',
          'norte-argentino/01',
          'norte-argentino/12',
          'norte-argentino/09',
          'norte-argentino/11',
        ],
        'quebrada-y-terracota'
      ),
    },
    {
      id: 'gastronomia-editorial',
      slug: 'gastronomia-editorial',
      indexNumber: '04',
      title: 'Materia & Fuego: Gastronomía',
      subtitle: 'Fotografía Comercial de Producto Culinario',
      category: 'gastronomia',
      categoryLabel: 'Producto & Gastronomía',
      location: 'Zona Sur, Buenos Aires',
      year: '2025',
      clientOrContext: 'Producción Gastronómica Comercial',
      coverPhotoUrl: buildCloudinaryThumbUrl(
        cloudName,
        'Bonaburguense/01',
        1772596682,
        'jpg',
        'tall'
      ),
      coverHighResUrl: buildCloudinaryHighResUrl(cloudName, 'Bonaburguense/01', 1772596682),
      coverAspectVariant: 'tall',
      summary:
        'Dirección de arte y fotografía de producto enfocada en texturas reales: el brillo del cheddar fundido, la rugosidad crocante de los aros de cebolla y la potencia visual del packaging en escena.',
      extendedNotes: [
        'En gastronomía comercial, el apetito visual nace de la honestidad de la textura. Evitamos los artificios plásticos para trabajar con el producto recién salido de la plancha, capturando el vapor, el reflejo sobre el acero inoxidable y la caída orgánica de las salsas.',
        'Cada toma está pensada tanto para funcionar en cartas digitales y vía pública como en lanzamientos de marca y contenido editorial de alto impacto.',
      ],
      technicalSpecs: {
        camera: 'Full-Frame + Lentes Luminosos Prime',
        optics: '50mm f/1.4 · 35mm f/1.8 Close-Focus',
        lighting: 'Esquema direccional rasante para resaltar volumen',
        colorProfile: 'Warm Culinary Contrast & True Highlights',
        deliverable: 'Catálogo Comercial, E-Commerce & Social Ads',
      },
      photoCount: 8,
      cloudinaryTag: 'Bonaburguense',
      featured: true,
      curatedPhotos: pickAssets(
        [
          'Bonaburguense/01',
          'Bonaburguense/06',
          'Bonaburguense/16',
          'Bonaburguense/10',
          'Bonaburguense/07',
          'Bonaburguense/14',
          'Bonaburguense/15',
          'Bonaburguense/04',
        ],
        'gastronomia-editorial'
      ),
    },
    {
      id: 'noches-de-evento',
      slug: 'noches-de-evento',
      indexNumber: '05',
      title: 'Crónica Nocturna: Eventos en Vivo',
      subtitle: 'Fotoperiodismo Social, Cultura Urbana & Festejos',
      category: 'eventos',
      categoryLabel: 'Cobertura de Eventos',
      location: 'Buenos Aires, Argentina',
      year: '2025',
      clientOrContext: 'Eventos de Marca, Aniversarios & Sesiones en Vivo',
      coverPhotoUrl: buildCloudinaryThumbUrl(
        cloudName,
        'Bonaburguense/03',
        1772596683,
        'jpg',
        'compact'
      ),
      coverHighResUrl: buildCloudinaryHighResUrl(cloudName, 'Bonaburguense/03', 1772596683),
      coverAspectVariant: 'compact',
      summary:
        'Registro documental de eventos donde la cámara se vuelve invisible para capturar la atmósfera real: risas espontáneas, el ritmo de trabajo detrás de escena y la energía colectiva bajo luces nocturnas.',
      extendedNotes: [
        'Los mejores momentos de un evento ocurren cuando nadie sabe que está siendo fotografiado. Mi enfoque en coberturas nocturnas, aniversarios, lanzamientos y celebraciones íntimas prioriza la luz ambiente —guirnaldas, neones, contraluces— para preservar el clima genuino del lugar.',
        'El resultado es un relato visual cohesivo que sirve como memoria viva para los anfitriones y como herramienta de posicionamiento para marcas y productores de eventos.',
      ],
      technicalSpecs: {
        camera: 'Full-Frame Dual Slot de Respuesta Rápida',
        optics: '35mm f/1.8 & 50mm f/1.4 Apertura Máxima',
        lighting: 'Luz ambiente nocturna (Available Light Documentary)',
        colorProfile: 'Halación Cálida & Negros Profundos',
        deliverable: 'Galería Privada en Alta Resolución + Selección Express',
      },
      photoCount: 9,
      cloudinaryTag: 'Bonaburguense',
      featured: true,
      curatedPhotos: pickAssets(
        [
          'Bonaburguense/03',
          'Bonaburguense/02',
          'Bonaburguense/11',
          'Bonaburguense/08',
          'Bonaburguense/09',
          'Bonaburguense/12',
          'Bonaburguense/13',
          'Bonaburguense/05',
          'Bonaburguense/04',
        ],
        'noches-de-evento'
      ),
    },
    {
      id: 'pueblos-del-norte',
      slug: 'pueblos-del-norte',
      indexNumber: '06',
      title: 'Arquitectura de Adobe & Memoria',
      subtitle: 'Patrimonio, Identidad & Símbolos de la Quebrada',
      category: 'documental',
      categoryLabel: 'Crónica Cultural',
      location: 'Purmamarca, Maimará & Tilcara (Jujuy)',
      year: '2025',
      clientOrContext: 'Archivo Documental & Patrimonio',
      coverPhotoUrl: buildCloudinaryThumbUrl(
        cloudName,
        'norte-argentino/14',
        1772681066,
        'jpg',
        'portrait'
      ),
      coverHighResUrl: buildCloudinaryHighResUrl(cloudName, 'norte-argentino/14', 1772681066),
      coverAspectVariant: 'portrait',
      summary:
        'Un acercamiento íntimo a la textura de los pueblos andinos: muros de pirca y adobe cocido al sol, cementerios de altura, ofrendas florales y el pulso cotidiano en las calles de tierra.',
      extendedNotes: [
        'Más allá del paisaje monumental, la identidad del norte reside en sus materiales y rituales. Esta selección documenta cómo la arquitectura vernácula se funde con el color mismo de los cerros que la rodean.',
        'Cada imagen busca honrar la quietud del mediodía andino, el contraste de los tejidos artesanales y los símbolos de pertenencia que habitan cada rincón de la Quebrada de Humahuaca.',
      ],
      technicalSpecs: {
        camera: 'Full-Frame Digital con Óptica Fija',
        optics: '35mm f/2.0 Reportaje · 50mm f/1.4 Estándar',
        lighting: 'Sol cenital y sombra abierta en galerías de adobe',
        colorProfile: 'Cromática Analógica Cálida de Grano Fino',
        deliverable: 'Editorial Cultural, Libros & Exposiciones',
      },
      photoCount: 8,
      cloudinaryTag: 'norte-argentino',
      featured: true,
      curatedPhotos: pickAssets(
        [
          'norte-argentino/14',
          'norte-argentino/04',
          'norte-argentino/13',
          'norte-argentino/08',
          'norte-argentino/03',
          'norte-argentino/15',
          'norte-argentino/12',
          'norte-argentino/09',
        ],
        'pueblos-del-norte'
      ),
    },
    {
      id: 'salinas-y-altiplano',
      slug: 'salinas-y-altiplano',
      indexNumber: '07',
      title: 'Horizonte Blanco: Salinas (4.170 m)',
      subtitle: 'Minimalismo de Altura en la Puna Jujeña',
      category: 'paisajes',
      categoryLabel: 'Serie Minimalista',
      location: 'Cuesta de Lipán & Salinas Grandes, Jujuy',
      year: '2025',
      clientOrContext: 'Ensayo de Luz & Minimalismo Espacial',
      coverPhotoUrl: buildCloudinaryThumbUrl(
        cloudName,
        'norte-argentino/03',
        1772681057,
        'jpg',
        'editorial'
      ),
      coverHighResUrl: buildCloudinaryHighResUrl(cloudName, 'norte-argentino/03', 1772681057),
      coverAspectVariant: 'editorial',
      summary:
        'A más de cuatro mil metros sobre el nivel del mar, la atmósfera se vuelve cristalina y el paisaje se reduce a tres elementos puros: la sal blanca, la piedra ancestral y el azul profundo del altiplano.',
      extendedNotes: [
        'Subir por la Cuesta de Lipán hasta alcanzar el mojón de los 4.170 metros transforma por completo la percepción de la luz. Al desembocar en las Salinas Grandes, el rebote lumínico del salar exige un control milimétrico de la exposición para conservar el detalle en los cristales de sal.',
        'Esta carpeta explora el vacío, la simetría y la presencia humana reducida a su expresión más esencial frente a la inmensidad.',
      ],
      technicalSpecs: {
        camera: 'Full-Frame con Medición Puntual de Altas Luces',
        optics: '50mm f/1.4 Cerrado a f/8 – f/11',
        lighting: 'Radiación solar de alta puna y reflejo especular',
        colorProfile: 'Fuji Pro 400H / Cianes y Blancos Puros',
        deliverable: 'Obra Seriada para Interiorismo & Editorial',
      },
      photoCount: 7,
      cloudinaryTag: 'norte-argentino',
      featured: true,
      curatedPhotos: pickAssets(
        [
          'norte-argentino/03',
          'norte-argentino/11',
          'norte-argentino/15',
          'norte-argentino/10',
          'norte-argentino/07',
          'norte-argentino/02',
          'norte-argentino/06',
        ],
        'salinas-y-altiplano'
      ),
    },
    {
      id: 'retratos-y-escena',
      slug: 'retratos-y-escena',
      indexNumber: '08',
      title: 'Retratos en Escena & Identidad',
      subtitle: 'Personas, Oficios & Momentos Auténticos',
      category: 'retratos',
      categoryLabel: 'Retrato & Lifestyle',
      location: 'Buenos Aires & Noroeste Argentino',
      year: '2025',
      clientOrContext: 'Selección Transversal de Retrato Documental',
      coverPhotoUrl: buildCloudinaryThumbUrl(
        cloudName,
        'Bonaburguense/04',
        1772596683,
        'jpg',
        'tall'
      ),
      coverHighResUrl: buildCloudinaryHighResUrl(cloudName, 'Bonaburguense/04', 1772596683),
      coverAspectVariant: 'tall',
      summary:
        'Selección curada de retratos ambientales y escenas humanas: desde el oficio gastronómico entre el fuego hasta caminantes en la puna, buscando siempre el gesto honesto sin artificio.',
      extendedNotes: [
        'Tanto en una sesión de marca personal como en un retrato documental en viaje, mi premisa es la misma: no forzar poses rígidas, sino construir un espacio donde la persona habite su propio entorno con naturalidad.',
        'La luz existente —sea el resplandor de una lámpara en la calle o el sol abierto de la montaña— dicta el carácter íntimo y cinematográfico de cada retrato.',
      ],
      technicalSpecs: {
        camera: 'Full-Frame + Cámara Analógica Kodak 35mm',
        optics: '50mm f/1.4 & 85mm f/1.8 Retrato',
        lighting: 'Luz natural y ambiental sin flash invasivo',
        colorProfile: 'Pieles Naturales & Grano Orgánico Sutil',
        deliverable: 'Books de Artistas, Branding Personal & Editorial',
      },
      photoCount: 9,
      cloudinaryTag: 'Bonaburguense',
      featured: true,
      curatedPhotos: pickAssets(
        [
          'Bonaburguense/04',
          'Bonaburguense/13',
          'Bonaburguense/08',
          'norte-argentino/10',
          'norte-argentino/01',
          'Bonaburguense/03',
          'Bonaburguense/12',
          'norte-argentino/04',
          'Bonaburguense/09',
        ],
        'retratos-y-escena'
      ),
    },
  ];

  return folders;
}
