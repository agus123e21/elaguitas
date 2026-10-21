/**
 * Mapeo inteligente de fotos reales de estudio para los productos del catálogo
 */
export function getProductPhoto(product = {}) {
  const name = (typeof product === 'string' ? product : product.name || '').toLowerCase()

  // 1. Accesorios y equipos especiales primero
  if (name.includes('bomba') || name.includes('usb')) {
    return '/images/products/bomba-usb.jpg'
  }
  if (name.includes('soporte') || name.includes('canilla') || name.includes('mesa')) {
    return '/images/products/soporte-mesa.jpg'
  }
  if (name.includes('pie') || name.includes('dispensador') || name.includes('dispenser')) {
    return '/images/products/dispenser-pie.jpg'
  }

  // 2. Formatos específicos de bidones
  if (name.includes('descartable')) {
    return '/images/products/bidon-descartable.jpg'
  }
  if (name.includes('12l') || name.includes('12 l') || name.includes('6l') || name.includes('6 l')) {
    return '/images/products/bidon-12l.jpg'
  }
  if (name.includes('20l') || name.includes('20 l') || name.includes('pack') || name.includes('garrafe')) {
    return '/images/products/bidon-20l.jpg'
  }

  return '/images/products/bidon-20l.jpg'
}
