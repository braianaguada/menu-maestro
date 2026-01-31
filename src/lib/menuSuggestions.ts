const pairingOptions = {
  es: [
    'Chardonnay mineral y notas de manteca tostada.',
    'Malbec joven con taninos sedosos.',
    'Spritz cítrico con hierbas frescas.',
    'Pinot Noir ligero y elegante.',
    'Té blanco con cítricos y flor de azahar.',
    'Cóctel de autor con gin botánico.',
  ],
  en: [
    'Mineral Chardonnay with toasted butter notes.',
    'Young Malbec with silky tannins.',
    'Citrus spritz with fresh herbs.',
    'Light and elegant Pinot Noir.',
    'White tea with citrus and orange blossom.',
    'Signature cocktail with botanical gin.',
  ],
  pt: [
    'Chardonnay mineral com notas de manteiga tostada.',
    'Malbec jovem com taninos sedosos.',
    'Spritz cítrico com ervas frescas.',
    'Pinot Noir leve e elegante.',
    'Chá branco com cítricos e flor de laranjeira.',
    'Coquetel autoral com gin botânico.',
  ],
};

const originNotes = {
  es: [
    'Ingredientes seleccionados de productores locales y temporada corta.',
    'Técnicas francesas con un guiño a la cocina de fuego contemporánea.',
    'Inspiración mediterránea con productos de huerta orgánica.',
    'Recetas de autor nacidas en colaboración con bodegas boutique.',
  ],
  en: [
    'Ingredients sourced from local producers and short-season harvests.',
    'French techniques with a nod to contemporary fire cooking.',
    'Mediterranean inspiration with organic garden produce.',
    'Signature recipes created with boutique wineries.',
  ],
  pt: [
    'Ingredientes de produtores locais e safra curta.',
    'Técnicas francesas com um toque de cozinha de fogo contemporânea.',
    'Inspiração mediterrânea com produtos de horta orgânica.',
    'Receitas autorais em parceria com vinícolas boutique.',
  ],
};

const chefNotes = {
  es: [
    'Terminaciones a la vista para mantener textura y perfume.',
    'Balanceado con acidez fresca y fondos concentrados.',
    'Emplatado minimalista para resaltar color y contraste.',
    'Cocciones lentas para lograr profundidad y umami.',
  ],
  en: [
    'Finished à la minute to preserve texture and aroma.',
    'Balanced with bright acidity and concentrated reductions.',
    'Minimal plating to highlight color and contrast.',
    'Slow cooking to build depth and umami.',
  ],
  pt: [
    'Finalização à la minute para manter textura e aroma.',
    'Equilíbrio com acidez fresca e fundos concentrados.',
    'Empratamento minimalista para realçar cor e contraste.',
    'Cocções lentas para alcançar profundidade e umami.',
  ],
};

export const getPairingSuggestion = (name: string, language: 'es' | 'en' | 'pt' = 'es') => {
  const options = pairingOptions[language] || pairingOptions.es;
  return options[Math.abs(name.length) % options.length];
};

export const getOriginNote = (name: string, language: 'es' | 'en' | 'pt' = 'es') => {
  const options = originNotes[language] || originNotes.es;
  return options[Math.abs(name.length * 3) % options.length];
};

export const getChefNote = (name: string, language: 'es' | 'en' | 'pt' = 'es') => {
  const options = chefNotes[language] || chefNotes.es;
  return options[Math.abs(name.length * 5) % options.length];
};
