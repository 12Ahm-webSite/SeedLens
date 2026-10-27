// Helper for resolving optimized in-game screenshot previews
// Lightweight WebP format (10-40KB) optimized for all internet speeds

export interface PreviewAsset {
  url: string;
  alt_ar: string;
  alt_en: string;
  category: 'landmark' | 'structure';
}

const LANDMARK_PREVIEWS: Record<string, { path: string; ar: string; en: string }> = {
  cherry_caldera: {
    path: '/previews/landmarks/cherry_caldera.webp',
    ar: 'فوهة أزهار الكرز المحاطة بقمم مثلجة',
    en: 'Cherry Blossom Caldera surrounded by snowy peaks',
  },
  cherry_grove: {
    path: '/previews/landmarks/cherry_caldera.webp',
    ar: 'بساتين الكرز الجبلية',
    en: 'Mountain Cherry Groves',
  },
  mountain_crater: {
    path: '/previews/landmarks/mountain_crater.webp',
    ar: 'الفوهة الجبلية المحمية وبحيرة المروج',
    en: 'Mountain Crater Ring and alpine lake',
  },
  epic_clifftop: {
    path: '/previews/landmarks/epic_clifftop.webp',
    ar: 'جرف بانورامي شاهق مطل على المحيط',
    en: 'Epic Clifftop Vista dropping into ocean',
  },
  prime_building_basin: {
    path: '/previews/landmarks/prime_basin.webp',
    ar: 'حوض بناء مستوٍ فسيح بجوار النهر',
    en: 'Prime Flat Building Basin by river and forest',
  },
  isolated_island: {
    path: '/previews/landmarks/survival_island.webp',
    ar: 'جزيرة نجاة منعزلة بمحيط عميق',
    en: 'Isolated Survival Island in deep ocean',
  },
  pale_garden: {
    path: '/previews/landmarks/pale_garden.webp',
    ar: 'غابة الحديقة الباهتة والبلوط الشاحب (1.21.4)',
    en: 'Pale Garden biome and pale oak canopy',
  },
};

const STRUCTURE_PREVIEWS: Record<string, { path: string; ar: string; en: string }> = {
  trial_chambers: {
    path: '/previews/structures/trial_chambers.webp',
    ar: 'غرف المحاكمة النحاسية والتوف',
    en: 'Trial Chambers with copper blocks and trial spawner',
  },
  ancient_city: {
    path: '/previews/structures/ancient_city.webp',
    ar: 'المدينة القديمة وقصر السكالك السحيق',
    en: 'Ancient City center in the deep dark',
  },
  woodland_mansion: {
    path: '/previews/structures/woodland_mansion.webp',
    ar: 'قصر الغابة المظلمة الشاهق',
    en: 'Woodland Mansion in dark forest',
  },
  village: {
    path: '/previews/structures/village.webp',
    ar: 'قرية السهول ومزارع القمح',
    en: 'Plains Village with crops and iron golem',
  },
  pillager_outpost: {
    path: '/previews/structures/pillager_outpost.webp',
    ar: 'مخفر البيلاجر وبرج المراقبة',
    en: 'Pillager Outpost watchtower on a hill',
  },
  ocean_monument: {
    path: '/previews/structures/ocean_monument.webp',
    ar: 'معبد المحيط البريسمارين الغارق',
    en: 'Ocean Monument submerged prismarine temple',
  },
};

export function getFeatureScreenshot(typeOrCategory: string): PreviewAsset | null {
  if (!typeOrCategory) return null;
  const norm = typeOrCategory.toLowerCase().trim();

  // 1. Check landmarks
  for (const [key, item] of Object.entries(LANDMARK_PREVIEWS)) {
    if (norm.includes(key)) {
      return {
        url: item.path,
        alt_ar: item.ar,
        alt_en: item.en,
        category: 'landmark',
      };
    }
  }

  // 2. Check structures
  for (const [key, item] of Object.entries(STRUCTURE_PREVIEWS)) {
    if (norm.includes(key)) {
      return {
        url: item.path,
        alt_ar: item.ar,
        alt_en: item.en,
        category: 'structure',
      };
    }
  }

  // Special aliases
  if (norm.includes('outpost')) {
    const item = STRUCTURE_PREVIEWS.pillager_outpost;
    return { url: item.path, alt_ar: item.ar, alt_en: item.en, category: 'structure' };
  }
  if (norm.includes('monument')) {
    const item = STRUCTURE_PREVIEWS.ocean_monument;
    return { url: item.path, alt_ar: item.ar, alt_en: item.en, category: 'structure' };
  }
  if (norm.includes('mansion')) {
    const item = STRUCTURE_PREVIEWS.woodland_mansion;
    return { url: item.path, alt_ar: item.ar, alt_en: item.en, category: 'structure' };
  }
  if (norm.includes('trial')) {
    const item = STRUCTURE_PREVIEWS.trial_chambers;
    return { url: item.path, alt_ar: item.ar, alt_en: item.en, category: 'structure' };
  }
  if (norm.includes('city') || norm.includes('ancient')) {
    const item = STRUCTURE_PREVIEWS.ancient_city;
    return { url: item.path, alt_ar: item.ar, alt_en: item.en, category: 'structure' };
  }

  return null;
}
