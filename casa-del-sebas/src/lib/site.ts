// Datos de contacto de la casa.
export const WHATSAPP_NUMBER = '573123430942'; // +57 312 343 0942, con indicativo de Colombia
export const WHATSAPP_DISPLAY = '312 343 0942';
export const INSTAGRAM_URL = 'https://instagram.com/';

/** Enlace de WhatsApp con el mensaje ya escrito. */
export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
