# TEOCORS — tienda web

Sitio de la marca de ropa TEOCORS: tema oscuro, una camiseta en 3D (three.js) que se mueve como tela en la portada, colección con vista rápida y carrito, y la sección **Música por amigos del colegio de Marko**.

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

Abierto desde el disco, el video de música se abre en YouTube; en un hosting se reproduce dentro de la página.

## Qué editar

| Quiero cambiar…                          | Archivo                         |
| ---------------------------------------- | ------------------------------- |
| Productos, precios, tallas agotadas      | `src/data/products.js`          |
| Textos de las secciones                  | `index.html`                    |
| Colores, tipografías, espacios           | `src/styles.css` (variables en `:root`) |
| Escena 3D de la portada                  | `src/three/hero.js`             |
| Forma y estampado de las prendas 3D      | `src/three/garmentTexture.js`   |
| Video de la sección de música            | `data-video-id` en `index.html` |

## Fotos de producto

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
