// Mood images for the Lookbook section, served by Unsplash. They show the
// mood behind Colección 01, not TEOCORS garments, so the section says so.
const unsplash = (id: string) => (w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export interface MoodImage {
  src: (width: number) => string;
  alt: string;
  caption: string;
}

export const moodImages: MoodImage[] = [
  {
    src: unsplash('1515886657613-9f3515b0c78f'),
    alt: 'Retrato editorial de moda',
    caption: 'Siluetas amplias',
  },
  {
    src: unsplash('1503342217505-b0a15ec3261c'),
    alt: 'Persona con camiseta de algodón',
    caption: 'Algodón con peso',
  },
  {
    src: unsplash('1523381210434-271e8be1f52b'),
    alt: 'Prendas colgadas en un perchero',
    caption: 'Tirajes cortos',
  },
  {
    src: unsplash('1441984904996-e0b6ba687e04'),
    alt: 'Interior de una tienda de ropa con prendas en percheros',
    caption: 'Hecho para durar',
  },
];
