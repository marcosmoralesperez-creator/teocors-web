# Casa del Sebas — tienda web

Joyería en oro de 18k: cubanas, tenis y dijes iced. La portada usa la foto de la mano con cadenas sobre fondo arena; el resto del sitio toma de ahí sus colores. Incluye catálogo con filtros (cadenas normales, pulseras, dijes, anillos y aretes), **Crea tu cadena** (cadenas personalizables con nombre, placa grabada o inicial y precio en vivo), ficha de cada pieza (talla, grabado), bolsa de compra, pedido por WhatsApp, sección "A medida" con la escena 3D de Spline, explicación del oro 18k y preguntas frecuentes.

Proyecto aparte de la tienda TEOCORS (la carpeta raíz del repositorio): tiene su propio `package.json`.

## Cómo verlo

```bash
cd casa-del-sebas
npm install
npm run dev            # abre http://localhost:5173
```

Para publicarlo:

```bash
npm run build          # genera dist/, lista para cualquier hosting estático
npm run preview        # revisa el build antes de subirlo
npm run build:single   # dist-single/index.html: un solo archivo con todo adentro
```

### Versión publicada en claude.ai

La web está publicada como Artifact privado en https://claude.ai/artifact/P8JThhjm48YjgRjENX64Rp (se comparte desde el menú *Share* de la página). Esa versión se genera así:

```bash
npm run build:artifact            # dist-artifact/: igual que dist/, pero sin el runtime de Spline
python3 scripts/artifact-page.py  # crea dist-artifact/page.html y lista los archivos a publicar
```

La plataforma bloquea pedidos a servidores externos, así que ahí la escena de Spline muestra la foto de respaldo. En `npm run dev` o en un hosting normal se ve el robot 3D.

## Tecnología

React 19 + TypeScript + Vite, Tailwind CSS v4 y la estructura de shadcn/ui (`components.json`).

```
src/
  components/
    ui/                 ← componentes shadcn (card, spotlight, splite)
    sections/           ← secciones de la página
    spline-scene-basic.tsx
  lib/utils.ts          ← cn() de shadcn
  data/products.ts      ← catálogo y precios
  index.css             ← colores, tipografías y tokens de shadcn
render/                 ← modelos 3D de las joyas para las fotos del catálogo
```

### Por qué `src/components/ui`

Es la carpeta donde la CLI de shadcn (`npx shadcn@latest add …`) instala los componentes, según `components.json` (`"ui": "@/components/ui"`). Si los componentes copiados a mano viven ahí, los que agregues después con la CLI quedan junto a ellos. Además, los imports del tipo `@/components/ui/card` funcionan igual que en la documentación de shadcn y de 21st.dev.

### Componente 3D (Spline)

- `src/components/ui/splite.tsx`, `spotlight.tsx` y `card.tsx` están copiados tal cual.
- `src/components/spline-scene-basic.tsx` es el demo adaptado a la marca: textos en español, foco dorado, columnas apiladas en celular. Además, el runtime de Spline (varios MB) solo se descarga cuando la tarjeta está por entrar en pantalla.
- El demo original le pasaba `fill="white"` a `<Spotlight>`, pero la versión de ibelick no tiene esa prop (era de otra versión del componente). Aquí el color del foco se da con clases (`from-gold-pale …`).
- Si la escena no carga (sin internet o con prod.spline.design bloqueado), se muestra una foto de la cubana y el resto de la página sigue funcionando.
- Para usar otra escena, cambia la URL `scene=` en `spline-scene-basic.tsx` por la de tu proyecto de Spline (Export → Code → React).

## Qué editar

| Quiero cambiar…                         | Archivo                                  |
| --------------------------------------- | ---------------------------------------- |
| Número de WhatsApp e Instagram          | `src/lib/site.ts`                        |
| Productos, precios, tallas, descripción | `src/data/products.ts`                   |
| Cadenas personalizables: tipos, grosores, precios, dijes y combinaciones listas | `src/data/custom-chain.ts` |
| Foto de la portada                      | `src/assets/photos/hero.webp`            |
| Puntos "+" sobre la foto                | `hotspots` en `src/components/sections/hero.tsx` |
| Colores y tipografías                   | `@theme` en `src/index.css`              |
| Preguntas frecuentes                    | `faqs` en `src/components/sections/info.tsx` |

## Fotos del catálogo

Las imágenes de `src/assets/products/` se generan con three.js a partir de modelos 3D de cada pieza (`render/jewelry.js`, `render/scene.js`). Si agregas un producto, crea su toma en `render/scene.js` con el mismo `id` y vuelve a generarlas:

```bash
npm run render:products             # todas
npm run render:products -- soga-5   # solo algunas
```

Usa Chromium con `playwright-core`. Si no lo tienes, ejecuta `npx playwright install chromium` o indica la ruta con `CHROMIUM_PATH=/ruta/a/chrome`. Cuando tengas fotos reales de las piezas, reemplaza los `.webp` (mismo nombre, formato vertical 4:5).

## Pendiente antes de vender

- Poner el enlace real de Instagram en `src/lib/site.ts` (el WhatsApp ya es el 312 343 0942).
- Revisar precios, pesos, cantidad de diamantes, tiempos de entrega y la política de cambios de 15 días: son de ejemplo.
- Confirmar el tipo de diamante que se vende (el sitio dice "de laboratorio VS") y la ciudad del showroom.
- Si quieres cobrar en línea, conecta una pasarela de pago (Wompi, Mercado Pago…). Hoy el pedido se cierra por WhatsApp.
- Usar la foto de portada solo si tienes derechos sobre ella.
