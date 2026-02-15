# 📸 Portafolio de Fotografía - Angular 21

Este es un portafolio web editorial y minimalista diseñado para fotógrafos. Utiliza una distribución de cuadrícula dinámica inspirada en diseños de alta gama y está optimizado para SEO mediante prerenderizado de rutas dinámicas.

## 🛠️ Tecnologías utilizadas

- **Angular 21.1.2** (Standalone Components & Signals)
- **Node.js 24.13.1**
- **SSR & Prerendering** para optimización de carga y buscadores
- **CSS Grid (Infinite Masonry)** para la distribución de imágenes.

## 🚀 Instalación y configuración local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/nombre-del-repo.git](https://github.com/tu-usuario/nombre-del-repo.git)
   cd nombre-del-repo

2. **Instalar dependencias:**
```bash
npm install

```
3. **Ejecutar en modo desarrollo:**
```bash
ng serve

```


Accede a `http://localhost:4200` en tu navegador.

## 📁 Estructura de Datos (Cómo agregar fotos)

Para añadir o modificar galerías, edita el archivo:
`src/app/services/gallery.ts`

Solo necesitas agregar un objeto al array `data`. El sistema de prerenderizado detectará el nuevo `id` automáticamente en el próximo despliegue.

## 🌐 Despliegue en GitHub Pages

Este proyecto está configurado para ser hosteado de forma estática en GitHub Pages.

### Configuración para un nuevo usuario:

Si vas a publicar esto en una cuenta de GitHub diferente, sigue estos pasos:

1. **Vincular el nuevo repositorio:**
```bash
git remote remove origin

```

(Luego vincula el nuevo remoto con `git remote add origin ...`)
2. **Actualizar el despliegue:**
Asegúrate de cambiar el `base-href` en el comando de despliegue por el nombre de tu repositorio:
```bash
ng deploy --base-href=/nombre-de-tu-repo/

```

3. **Rutas Dinámicas (Prerender):**
El archivo `src/app/app.routes.server.ts` ya está configurado para generar las páginas de cada galería por adelantado. No es necesario modificarlo a menos que cambies la lógica del servicio de datos.


```
