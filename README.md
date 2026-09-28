# TEOCORS — tienda web

Sitio de la marca de ropa TEOCORS: portada fiel a la imagen oficial 2026 (TEO · CORS con la figura de chaqueta beige girando en 3D y siguiendo el cursor), sección **Personaliza** con escena 3D de Spline, colección con vista rápida y carrito, y la sección **Música por amigos del colegio de Marko**.

## Tecnología

- Vite + JavaScript para el sitio, con **React + TypeScript + Tailwind CSS v4** para la portada y «Personaliza».
- Estructura **shadcn/ui**: componentes en `src/components/ui/`, utilidad `cn()` en `src/lib/utils.ts`, alias `@/` → `src/` (ver `components.json`). Así `npx shadcn@latest add <componente>` los deja en el lugar correcto.
- Tailwind se carga **sin preflight** (el sitio ya tiene su reset) y solo escanea `src/components` y `src/react`, para no chocar con los estilos existentes (`src/app.css`).

## Cómo verlo

```bash
npm install
npm run dev       # abre http://localhost:5173
```

Para publicarlo:

```bash
npm run build     # genera la carpeta dist/, lista para subir a cualquier hosting estático
npm run preview   # revisa el build antes de subirlo
```

¿Quieres un solo archivo que se abra con doble clic, sin instalar nada?

```bash
npm run build:single   # genera dist-single/index.html con todo adentro (código, fotos y fuentes)
```

Abierto desde el disco, el video de música se abre en YouTube; en un hosting se reproduce dentro de la página. Esta versión no incluye el motor de Spline (pesa varios MB): en su lugar se ve la figura en video.

## Qué editar

| Quiero cambiar…                          | Archivo                         |
| ---------------------------------------- | ------------------------------- |
| Productos, precios, tallas agotadas      | `src/data/products.js`          |
| Secciones (Hombre, Mujer, Niños) y tallas | `departments` en `src/data/products.js` |
| Guía de tallas por sección               | `SIZE_TABLES` en `src/ui/catalog.js` |
| Textos de las secciones                  | `index.html`                    |
| Colores, tipografías, espacios           | `src/styles.css` (variables en `:root`) |
| Portada (textos, enlaces, animación 3D)  | `src/react/TeocorsHero.tsx`     |
| Sección «Personaliza»                    | `src/react/PersonalizaSection.tsx` |
| Escenas de Spline                        | `src/react/config.ts`           |
| Video de la figura de la portada         | `src/assets/media/`             |
| Forma y estampado de las prendas 3D      | `src/three/garmentTexture.js`   |
| Video de la sección de música            | `data-video-id` en `index.html` |

## Capítulos con scroll (estilo micrositio de producto)

Después de la portada, la página se vuelve un recorrido que avanza con el scroll:

- **01 — La pieza** (`src/react/FigureTour.tsx`): la figura queda fija, gira cuadro a cuadro con el scroll y una cámara se acerca a la chaqueta, el jean y la zapatilla, con fichas técnicas. Los textos de las fichas están en `STOPS` (revisa que coincidan con las prendas reales) y el encuadre de cada parada en `focus`.
- **02 — El emblema** (`src/react/EmblemChapter.tsx` y `emblemScene.ts`): las cinco estrellas del logo en metal pulido con three.js (materiales PBR, mapa de entorno y tonemapping ACES). Se separan para mostrar los cinco criterios de la marca y se vuelven a juntar.
- Scroll suave con Lenis; la barra nativa se oculta y la reemplaza un riel de progreso a la derecha. Con «reducir movimiento» del sistema se desactiva el scroll suave.

Los cuadros de la figura (`src/assets/figure-frames/`) salen del video oficial:

```bash
pip install opencv-python-headless numpy pillow
python3 scripts/make-figure-frames.py ruta/al/video.mp4
```

## La figura 3D de la portada

La figura sale del video oficial (`src/assets/media/teocors-figura.*`). El componente `KeyedVideo` quita el fondo negro en tiempo real para que flote sobre la portada; encima, la figura se inclina en 3D hacia el cursor, flota y se acerca al bajar. Con «reducir movimiento» activado en el sistema queda quieta.

Si algún día tienes la figura como modelo 3D en [Spline](https://spline.design), exporta la escena (Export → Code → React) y pega la URL `…/scene.splinecode` en `SPLINE_HERO` dentro de `src/react/config.ts`: la portada usará la escena interactiva en vez del video.

La sección «Personaliza» usa hoy la escena de ejemplo del componente (`SPLINE_PERSONALIZA`); cámbiala por una tuya. Si la escena no carga (sin internet), se muestra la figura en video.

## Tienda por secciones

La tienda está dividida en **Hombre**, **Mujer** y **Niños**. Cada prenda tiene `department` en `src/data/products.js`, y cada sección define sus tallas (Hombre S–XL, Mujer XS–L, Niños 4–12 años). En la página:

- El bloque «Compra por sección» lleva a la tienda ya filtrada.
- La tienda tiene pestañas de sección, filtro por tipo de prenda y orden por precio.
- La vista rápida y la guía de tallas muestran las tallas de la sección de la prenda.
- Los enlaces `#hombre`, `#mujer` y `#ninos` abren la tienda en esa sección (sirven para Instagram o WhatsApp).
- **Buscador**: lupa en la portada, en la barra superior, en la tienda y en el menú del celular (o las teclas `/` y Ctrl/⌘+K). Muestra resultados mientras se escribe, entiende tildes, plurales y palabras como «saco», «sudadera» o «busos» (`SYNONYMS` en `src/ui/search.js`), y «Ver resultados en la tienda» filtra la colección.

Para agregar una prenda, copia una entrada de `products`, cambia `id`, `department`, textos, precio y colores de `garment`, y vuelve a generar las fotos con `npm run render:products`.

## Fotos reales de producto

Las prendas de Hombre y Niños usan fotos reales en lugar del modelo 3D (en `products.js` no llevan `garment`). Para agregar o cambiar una:

1. Guarda la foto en `assets-src/fotos/<id>.png` (o .jpg/.webp), con el mismo `id` del producto.
2. Ejecuta `pip install "rembg[cpu]" pillow` y luego `python3 scripts/cutout-photos.py`: quita el fondo y deja la foto en `src/assets/products/<id>.webp` con el mismo tamaño y encuadre que las demás.

Funciona mejor con fotos grandes (1000 px o más de alto) sobre fondo liso.

## Fotos de producto (3D)

Las imágenes de `src/assets/products/` se generan a partir de las mismas prendas 3D. Si cambias colores o agregas un producto en `src/data/products.js`, vuelve a generarlas:

```bash
npm run render:products
```

Usa Chromium mediante `playwright-core`. Si no lo tienes instalado, ejecuta `npx playwright install chromium` o indica la ruta con `CHROMIUM_PATH=/ruta/a/chrome`.

## Pendiente antes de vender

- Conectar una pasarela de pago real: el botón «Finalizar compra» solo muestra un aviso.
- Conectar el formulario de la lista de correo a un servicio (Mailchimp, Brevo…): hoy solo valida el correo.
- Poner los enlaces reales de Instagram y TikTok en el pie de página.
- Revisar precios, medidas de la guía de tallas y textos de envíos y cambios.
