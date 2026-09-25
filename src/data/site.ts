export const navLinks = [
  { id: 'coleccion', label: 'Colección' },
  { id: 'lab', label: 'Lab 3D' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'musica', label: 'Música' },
  { id: 'marca', label: 'Marca' },
] as const;

export const music = {
  videoId: 'uIEHVVCoKrk',
  url: 'https://youtu.be/uIEHVVCoKrk?list=RDuIEHVVCoKrk',
  title: 'Música por amigos del colegio de Marko',
};

// Replace with the real profiles before launch.
export const socials = {
  instagram: '#',
  tiktok: '#',
  youtube: music.url,
};

export const FREE_SHIPPING = 250000;

// Interactive scene for the TEOCORS Lab section (hosted by Spline).
export const LAB_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';
