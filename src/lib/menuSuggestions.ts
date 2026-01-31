const pairingOptions = [
  'Chardonnay mineral y notas de manteca tostada.',
  'Malbec joven con taninos sedosos.',
  'Spritz cítrico con hierbas frescas.',
  'Pinot Noir ligero y elegante.',
  'Té blanco con cítricos y flor de azahar.',
  'Cóctel de autor con gin botánico.',
];

const originNotes = [
  'Ingredientes seleccionados de productores locales y temporada corta.',
  'Técnicas francesas con un guiño a la cocina de fuego contemporánea.',
  'Inspiración mediterránea con productos de huerta orgánica.',
  'Recetas de autor nacidas en colaboración con bodegas boutique.',
];

const chefNotes = [
  'Terminaciones a la vista para mantener textura y perfume.',
  'Balanceado con acidez fresca y fondos concentrados.',
  'Emplatado minimalista para resaltar color y contraste.',
  'Cocciones lentas para lograr profundidad y umami.',
];

export const getPairingSuggestion = (name: string) =>
  pairingOptions[Math.abs(name.length) % pairingOptions.length];

export const getOriginNote = (name: string) =>
  originNotes[Math.abs(name.length * 3) % originNotes.length];

export const getChefNote = (name: string) =>
  chefNotes[Math.abs(name.length * 5) % chefNotes.length];
