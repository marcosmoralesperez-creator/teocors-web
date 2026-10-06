// Datos de contacto de la casa. Cambia el número antes de publicar.
export const WHATSAPP_NUMBER = '573000000000';
export const INSTAGRAM_URL = 'https://instagram.com/';

/** Enlace de WhatsApp con el mensaje ya escrito. */
export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
