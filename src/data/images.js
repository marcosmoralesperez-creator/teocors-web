// Product photos live in src/assets so Vite fingerprints them (and inlines
// them in the single-file build).
const files = import.meta.glob('../assets/products/*.webp', { eager: true, query: '?url', import: 'default' });

export const productImage = (id) => files[`../assets/products/${id}.webp`];
