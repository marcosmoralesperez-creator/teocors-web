# TEOCORS — tienda web

Sitio de la marca de ropa TEOCORS: tema oscuro con detalles dorados, una camiseta en 3D (three.js) que se mueve como tela en la portada, colección con filtros, vista rápida y carrito, el **TEOCORS Lab** con una escena 3D interactiva de Spline, lookbook de inspiración y la sección **Música por amigos del colegio de Marko**.

Hecho con **React 19 + TypeScript + Tailwind CSS 4**, con la estructura de proyecto de **shadcn/ui** y animaciones de **Motion** (framer-motion).

## Cómo verlo

```bash
npm install
npm run dev       # abre http://localhost:5173
```

Para publicarlo:

```bash
npm run build     # revisa los tipos y genera dist/, lista para subir a cualquier hosting estático
npm run preview   # revisa el build antes de subirlo
```

¿Quieres un solo archivo que se abra con doble clic, sin instalar nada?

```bash
npm run build:single   # genera dist-single/index.html con todo adentro (código, fotos y fuentes)
```

Abierto desde el disco, el video de música se abre en YouTube; en un hosting se reproduce dentro de la página. La escena del Lab y las fotos del lookbook se cargan de internet: sin conexión se muestran imágenes de respaldo.

## Estructura (shadcn/ui)

```
src/
├── components/
│   ├── ui/          ← componentes base de shadcn/ui (button, card, dialog, sheet…) + splite y spotlight
│   ├── layout/      ← barra de anuncio, encabezado, menú móvil y pie de página
│   ├── sections/    ← secciones de la página (hero, colección, lab 3D, lookbook, música…)
│   ├── shop/        ← carrito, vista rápida, guía de tallas y el estado de la tienda
│   └── common/      ← títulos, animación de entrada, iconos de marca
├── data/            ← productos, textos del sitio y fotos del lookbook
├── hooks/           ← hooks de React
├── lib/utils.ts     ← `cn()` para combinar clases de Tailwind
├── three/           ← escena 3D de la portada y dibujo de las prendas
└── index.css        ← Tailwind + colores, tipografías y animaciones de la marca
```

`components.json` configura shadcn/ui: los componentes van en `@/components/ui` y los estilos en `src/index.css`. El alias `@/` apunta a `src/` (en `tsconfig.json` y `vite.config.ts`).

**¿Por qué `components/ui`?** Es la carpeta donde el CLI de shadcn (`npx shadcn@latest add …`) copia cada componente, y la ruta que usan todos los ejemplos (`import { Card } from "@/components/ui/card"`). Mantenerla hace que cualquier componente de shadcn o de 21st.dev funcione copiándolo tal cual, sin reescribir importaciones, y separa las piezas base reutilizables de las secciones propias de la tienda.

Para añadir más componentes de shadcn:

```bash
npx shadcn@latest add accordion tabs   # se instalan en src/components/ui
```

## Qué editar

| Quiero cambiar…                          | Archivo                                   |
| ---------------------------------------- | ----------------------------------------- |
| Productos, precios, tallas agotadas      | `src/data/products.ts`                    |
| Menú, video de música, redes, envío gratis, escena del Lab | `src/data/site.ts`      |
| Fotos del lookbook                       | `src/data/lookbook.ts`                    |
| Textos de cada sección                   | `src/components/sections/*.tsx`           |
| Colores, tipografías, animaciones        | `src/index.css` (variables en `:root`)    |
| Escena 3D de la portada                  | `src/three/hero.ts`                       |
| Forma y estampado de las prendas 3D      | `src/three/garmentTexture.ts`             |

## Fotos de producto

Las imágenes de `src/assets/products/` se generan a partir de las mismas prendas 3D. Si cambias colores o agregas un producto en `src/data/products.ts`, vuelve a generarlas:

```bash
npm run render:products
```

Usa Chromium mediante `playwright-core`. Si no lo tienes instalado, ejecuta `npx playwright install chromium` o indica la ruta con `CHROMIUM_PATH=/ruta/a/chrome`.

## Pendiente antes de vender

- Conectar una pasarela de pago real: el botón «Finalizar compra» solo muestra un aviso.
- Conectar el formulario de la lista de correo a un servicio (Mailchimp, Brevo…): hoy solo valida el correo.
- Poner los enlaces reales de Instagram y TikTok en `src/data/site.ts`.
- Revisar precios, medidas de la guía de tallas y textos de envíos y cambios.
- Cambiar las fotos de inspiración del lookbook por fotos propias con las prendas TEOCORS.
