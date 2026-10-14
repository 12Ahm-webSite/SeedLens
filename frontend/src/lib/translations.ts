export type Locale = 'ar' | 'en';

export interface Translations {
  // Navigation & Header
  siteTitle: string;
  siteSubtitle: string;
  navAnalyzer: string;
  navHowItWorks: string;
  navCategories: string;
  engineCore: string;
  minecraftJava: string;

  // Hero
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroDesc: string;
  statRadiusTitle: string;
  statRadiusDesc: string;
  statTaxonomyTitle: string;
  statTaxonomyDesc: string;
  statCubiomesTitle: string;
  statCubiomesDesc: string;
  statMapTitle: string;
  statMapDesc: string;

  // Seed Input
  inputPlaceholder: string;
  analyzeButton: string;
  analyzingButton: string;
  clearInput: string;
  trySampleSeeds: string;
  textSeedNotePrefix: string;
  textSeedNoteSuffix: string;
  errorEmptySeed: string;
  errorInvalidSeed: string;

  // Presets
  presetTrading: string;
  presetSpawn: string;
  presetStrategic: string;
  presetNegative: string;
  presetEmpty: string;

  // Results Header
  analysisComplete: string;
  seedLabel: string;
  copySeed: string;
  copiedSeed: string;
  convertedFromText: string;
  usefulLocations: string;
  totalClusters: string;
  searchRadius: string;
  searchRadiusVal: string;
  versionLabel: string;
  discoveredClustersTitle: string;

  // Filter & Sort
  filterLabel: string;
  filterAll: string;
  sortDefault: string;
  sortSpawnAsc: string;
  sortCountDesc: string;
  sortDiameterAsc: string;
  sortDensityDesc: string;
  viewSplit: string;
  viewCards: string;
  viewMap: string;
  showingLocationsCount: string;
  clickCardToFocus: string;

  // Cluster Card
  clusterNumber: string;
  structuresCount: string;
  typesCount: string;
  diameterLabel: string;
  nearestPairLabel: string;
  fromSpawnLabel: string;
  densityLabel: string;
  pointsLabel: string;
  blocksUnit: string;
  viewOnMap: string;
  focusedOnMap: string;
  viewStructures: string;

  // Cluster Modal
  clusterDetailsTitle: string;
  centerCoords: string;
  engineAnalysis: string;
  totalStructuresModal: string;
  structuresInCluster: string;
  clickToCopyTp: string;
  tpCommand: string;
  tpCopied: string;
  locateOnMap: string;
  close: string;

  // Empty State
  emptyTitle: string;
  emptyDesc: string;
  emptySubdesc: string;
  tryAnotherSeed: string;
  evaluatedClusters: string;

  // Loading State
  loadingTitle: string;
  loadingStep1: string;
  loadingStep2: string;
  loadingStep3: string;
  loadingStep4: string;

  // Error State
  errorTitle: string;
  tryAgain: string;

  // Map
  mapTitle: string;
  mapBounds: string;
  mapSpawnMarker: string;
  mapOriginMarker: string;
  mapHoverCoords: string;
  mapZoomIn: string;
  mapZoomOut: string;
  mapFocusSpawn: string;
  mapFocusOrigin: string;
  mapFitBounds: string;
  legendSpawn: string;
  legendOrigin: string;
  mapStylizedBadge: string;
  legendVillage: string;
  legendAncientCity: string;
  legendShipwreck: string;
  legendPyramid: string;
  mapLoading: string;
  mapProjecting: string;
  mapLayerBiomes: string;
  mapLayerMinimal: string;
  mapToggleBiomes: string;
  mapElevationLabel: string;
  mapActiveBiome: string;
  legendBiomes: string;
  legendStructures: string;
  legendCherryGrove: string;
  legendPlains: string;
  legendDesert: string;
  legendPeaks: string;
  legendOcean: string;

  // Categories Section
  categoriesSectionBadge: string;
  categoriesSectionTitle: string;
  categoriesSectionDesc: string;
  criteriaLabel: string;

  // How it works
  howItWorksBadge: string;
  howItWorksTitle: string;
  howItWorksDesc: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Footer
  footerEngineName: string;
  footerTagline: string;
  backToTop: string;
  disclaimer1: string;
  disclaimer2: string;

  // Category Names Translations
  catStrategicMegaHub: string;
  catTradingMetropolis: string;
  catAbyssalHub: string;
  catSpawnOutpost: string;
  catDenseMulti: string;

  // Category Descriptions
  catStrategicMegaHubDesc: string;
  catTradingMetropolisDesc: string;
  catAbyssalHubDesc: string;
  catSpawnOutpostDesc: string;
  catDenseMultiDesc: string;

  // Structure Names
  structVillage: string;
  structShipwreck: string;
  structAncientCity: string;
  structDesertPyramid: string;
  structJungleTemple: string;
  structPillagerOutpost: string;
  structOceanMonument: string;
  structWoodlandMansion: string;
  structTrailRuins: string;
  structTrialChambers: string;
  discoveredPOIs: string;
  discoveredDesc: string;
}

export const translations: Record<Locale, Translations> = {
  ar: {
    // Navigation & Header
    siteTitle: 'SeedLens',
    siteSubtitle: 'مكتشف ومحلل بذور ماين كرافت جافا',
    navAnalyzer: 'المحلل',
    navHowItWorks: 'كيف يعمل؟',
    navCategories: 'التصنيفات',
    engineCore: 'نواة المحرك',
    minecraftJava: 'جافا',

    // Hero
    heroBadge: 'محرك هيكلي قطعي لماين كرافت جافا 1.20.6',
    heroTitlePrefix: 'ما المميز في ',
    heroTitleHighlight: 'بذرة عالمك؟',
    heroDesc:
      'أدخل أي Minecraft Java Seed لاكتشاف التجمعات الهيكلية النادرة، العواصم التجارية، الروابط السحيقة بين السطح والمدن القديمة، والبؤر الاستيطانية عبر نطاق 10,000×10,000 بلوك.',
    statRadiusTitle: 'نطاق 10 آلاف بلوك',
    statRadiusDesc: 'يغطي [-5000، 5000] حول مركز العالم',
    statTaxonomyTitle: 'تصنيف v3.1 الاستراتيجي',
    statTaxonomyDesc: '5 فلاتر لتصنيف أهم المواقع المفيدة عملياً',
    statCubiomesTitle: 'موثق عبر Cubiomes',
    statCubiomesDesc: 'فحص إمكانية التوليد الواقعي للتضاريس',
    statMapTitle: 'خريطة تفاعلية كاملة',
    statMapDesc: 'إسقاط مباشر لإحداثيات X / Z للعبة',

    // Seed Input
    inputPlaceholder: 'أدخل الـ Seed (مثال: 123456789 أو اسم العالم)',
    analyzeButton: 'تحليل البذرة',
    analyzingButton: 'جاري التحليل...',
    clearInput: 'مسح الحقل',
    trySampleSeeds: 'جرّب بذوراً مختارة:',
    textSeedNotePrefix: 'سيتم تحويل البذرة النصية "',
    textSeedNoteSuffix: '" إلى رقم جافا المكافئ: ',
    errorEmptySeed: 'يرجى إدخال رقم البذرة (Seed) أو اسم العالم.',
    errorInvalidSeed: 'بذرة غير صالحة.',

    // Presets
    presetTrading: 'عاصمة تجارية',
    presetSpawn: 'بؤرة Spawn ومركز استراتيجي',
    presetStrategic: 'مركز استراتيجي',
    presetNegative: 'بذرة سالبة',
    presetEmpty: 'حالة بدون مواقع مميزة',

    // Results Header
    analysisComplete: 'اكتمل التحليل بنجاح',
    seedLabel: 'البذرة (Seed)',
    copySeed: 'نسخ الـ Seed',
    copiedSeed: 'تم النسخ!',
    convertedFromText: 'تم التحويل من النص الأصلي: ',
    usefulLocations: 'مواقع مميزة ومفيدة',
    totalClusters: 'إجمالي المجموعات المفحوصة',
    searchRadius: 'نطاق البحث',
    searchRadiusVal: '±5000 بلوك',
    versionLabel: 'ماين كرافت جافا',
    discoveredClustersTitle: 'التجمعات الهيكلية المكتشفة',

    // Filter & Sort
    filterLabel: 'تصفية:',
    filterAll: 'الكل',
    sortDefault: 'الترتيب: المقترح (حسب أهمية المحرك)',
    sortSpawnAsc: 'الترتيب: الأقرب لنقطة البداية (Spawn)',
    sortCountDesc: 'الترتيب: الأكثر هياكل',
    sortDiameterAsc: 'الترتيب: الأصغر قطراً (الأكثر ترابطاً)',
    sortDensityDesc: 'الترتيب: الأعلى كثافة',
    viewSplit: 'عرض مزدوج (بطاقات وخريطة)',
    viewCards: 'بطاقات فقط',
    viewMap: 'خريطة فقط',
    showingLocationsCount: 'عرض {count} موقع مفيد',
    clickCardToFocus: 'اضغط على البطاقة لتحديد مكانها على الخريطة',

    // Cluster Card
    clusterNumber: 'مجموعة رقم #',
    structuresCount: '{count} هياكل',
    typesCount: '{count} أنواع',
    diameterLabel: 'القطر',
    nearestPairLabel: 'أقرب هيكلين',
    fromSpawnLabel: 'عن نقطة البداية',
    densityLabel: 'الكثافة',
    pointsLabel: 'نقاط',
    blocksUnit: 'بلوك',
    viewOnMap: 'عرض على الخريطة',
    focusedOnMap: 'محددة على الخريطة',
    viewStructures: 'عرض الهياكل',

    // Cluster Modal
    clusterDetailsTitle: 'تفاصيل المجموعة الهيكلية',
    centerCoords: 'المركز: X: {x}، Z: {z}',
    engineAnalysis: 'تحليل المحرك الاستراتيجي',
    totalStructuresModal: 'إجمالي الهياكل',
    structuresInCluster: 'الهياكل داخل هذه المجموعة ({count})',
    clickToCopyTp: 'اضغط نسخ لنسخ أمر الانتقال /tp',
    tpCommand: 'نسخ /tp',
    tpCopied: 'تم النسخ',
    locateOnMap: 'تحديد على الخريطة',
    close: 'إغلاق',

    // Empty State
    emptyTitle: 'لم يتم العثور على مواقع مميزة',
    emptyDesc:
      'لم يعثر SeedLens على أي مواقع تطابق معايير المواقع المفيدة والاستراتيجية الحالية ضمن نطاق البحث المحدد.',
    emptySubdesc:
      'هذا لا يعني أن العالم سيئ؛ جرّب بذرة أخرى لاكتشاف عواصم تجارية ومراكز متعددة الهياكل.',
    tryAnotherSeed: 'جرّب بذرة أخرى',
    evaluatedClusters: 'تم فحص وتجميع {count} تكتل مكاني',

    // Loading State
    loadingTitle: 'جاري تحليل البذرة الخاصة بك...',
    loadingStep1: 'تشغيل محاكي Cubiomes وتوليد التضاريس القطعية...',
    loadingStep2: 'اكتشاف حدود ومواقع الهياكل ضمن نطاق 10 آلاف بلوك...',
    loadingStep3: 'حساب التكتلات المكانية وقياسات الكثافة والأقطار...',
    loadingStep4: 'تقييم معايير المواقع المفيدة v3.1 وإنشاء التوضيحات...',

    // Error State
    errorTitle: 'فشل التحليل',
    tryAgain: 'إعادة المحاولة',

    // Map
    mapTitle: 'شبكة ماين كرافت المكانية',
    mapBounds: '[-5000 إلى +5000]',
    mapSpawnMarker: 'نقطة البداية (World Spawn)',
    mapOriginMarker: 'مركز العالم World Origin (0, 0)',
    mapHoverCoords: 'مرر الفأرة على الخريطة لعرض إحداثيات X / Z',
    mapZoomIn: 'تكبير',
    mapZoomOut: 'تصغير',
    mapFocusSpawn: 'الذهاب إلى نقطة البداية (Spawn)',
    mapFocusOrigin: 'الذهاب إلى مركز العالم (0, 0)',
    mapFitBounds: 'ملاءمة حدود نطاق البحث',
    legendSpawn: 'نقطة البداية (Spawn)',
    legendOrigin: 'مركز العالم (0, 0)',
    mapStylizedBadge: 'خريطة استرشادية تكتيكية (Stylized Preview) — ليست تضاريس Minecraft الفعلية',
    legendVillage: 'قرية',
    legendAncientCity: 'مدينة قديمة',
    legendShipwreck: 'حطام سفينة',
    legendPyramid: 'معبد صحراوي',
    mapLoading: 'جاري تحميل خريطة ماين كرافت...',
    mapProjecting: 'إسقاط الشبكة المكانية ثنائية الأبعاد',
    mapLayerBiomes: 'تضاريس وبيئات واقعية',
    mapLayerMinimal: 'شبكة مبسطة',
    mapToggleBiomes: 'تبديل التضاريس والبيئات',
    mapElevationLabel: 'الارتفاع',
    mapActiveBiome: 'البيئة النشطة',
    legendBiomes: 'البيئات والتضاريس',
    legendStructures: 'الهياكل المكتشفة',
    legendCherryGrove: 'بساتين الكرز (ساكورا)',
    legendPlains: 'سهول وغابات',
    legendDesert: 'صحراء وأراضٍ وعرة',
    legendPeaks: 'قمم جبلية وثلوج',
    legendOcean: 'محيطات وأنهار',

    // Categories Section
    categoriesSectionBadge: 'تصنيف v3.1 المحايد والمدقق',
    categoriesSectionTitle: 'فئات المجموعات الاستراتيجية',
    categoriesSectionDesc:
      'يقوم SeedLens بتقييم الهياكل وفق نماذج حسابية دقيقة لتوضيح الأهمية الفعلية لكل موقع للاعبين ومطوري العوالم.',
    criteriaLabel: 'المعايير الرياضية',

    // How it works
    howItWorksBadge: 'تحت الغطاء',
    howItWorksTitle: 'كيف يحلل SeedLens العوالم؟',
    howItWorksDesc:
      'محرك C عالي الأداء مع خوارزميات التجميع المكاني يقدم تحليلاً فورياً ومؤكداً دون الحاجة لتشغيل اللعبة.',
    step1Title: 'محاكاة قطعية لتوليد العالم',
    step1Desc:
      'استخدام نواة Cubiomes لمحاكاة توزيع البيئات وقواعد توليد الهياكل لإصدار جافا 1.20.6 قطعيّاً.',
    step2Title: 'مسح محيطي بمساحة 10 آلاف بلوك',
    step2Desc:
      'مسح النطاق [-5000، 5000] عبر محوري X و Z وتسجيل القرى والمدن القديمة والأهرامات وحطام السفن ومعابد الغابة.',
    step3Title: 'التكتل المكاني وحساب الكثافة',
    step3Desc:
      'تجميع الهياكل المتقاربة ضمن دائرة نصف قطرها 500م، مع حساب الأقطار وأقرب مسافة بين زوج هياكل والكثافة.',
    step4Title: 'تقييم فئات المواقع المفيدة v3.1',
    step4Desc:
      'تصفية المرشحين وفق معايير صارمة لتحديد العواصم التجارية، والمراكز الاستراتيجية الضخمة، والروابط السحيقة للأعماق.',

    // Footer
    footerEngineName: 'SeedLens',
    footerTagline: 'محرك التحليل المكاني القطعي لماين كرافت جافا 1.20.6',
    backToTop: 'العودة للأعلى',
    disclaimer1:
      'هذا الموقع ليس منتجاً رسمياً لماين كرافت. غير معتمد من قبل أو مرتبط بشركتي Mojang أو Microsoft.',
    disclaimer2:
      'Minecraft هي علامة تجارية مسجلة لشركة Mojang Synergies AB.',

    // Category Names
    catStrategicMegaHub: 'مركز استراتيجي فائق',
    catTradingMetropolis: 'عاصمة تجارية',
    catAbyssalHub: 'مركز أعماق سحيق',
    catSpawnOutpost: 'بؤرة Spawn استيطانية',
    catDenseMulti: 'تجمع متعدد فائق الكثافة',

    // Category Descriptions
    catStrategicMegaHubDesc:
      'تجمع نادر وضخم يجمع 3 أنواع مختلفة من الهياكل أو أكثر على مسافات متقاربة جداً لسرعة التقدم في اللعبة.',
    catTradingMetropolisDesc:
      'عدة قرى مأهولة وقريبة من بعضها، مثالية لإنشاء قاعات تجارة القرويين ومزارع الحديد وبناء إمبراطوريات ضخمة.',
    catAbyssalHubDesc:
      'اتصال مباشر وسريع بين السطح وحطام السفن أو القرى نحو المدن القديمة العميقة (Ancient Cities) لنهب سريع للموارد النادرة.',
    catSpawnOutpostDesc:
      'موقع قريب جداً من نقطة بداية العالم (Spawn) يوفر موارد فورية وحدادة وطعاماً واستكشافاً سريعاً دون سفر طويل.',
    catDenseMultiDesc:
      'تجمع فائق التقارب حيث تقع عدة نقاط اهتمام بجوار بعضها البعض مباشرة ضمن مسافة مشي قصيرة جداً.',

    // Structures
    structVillage: 'قرية',
    structShipwreck: 'حطام سفينة',
    structAncientCity: 'مدينة قديمة',
    structDesertPyramid: 'معبد صحراوي',
    structJungleTemple: 'معبد غابة',
    structPillagerOutpost: 'مخفر نهابين',
    structOceanMonument: 'معبد محيط',
    structWoodlandMansion: 'قصر الغابة',
    structTrailRuins: 'آثار المسار',
    structTrialChambers: 'غرف المحاكمة',
    discoveredPOIs: 'معالم العالم المكتشفة',
    discoveredDesc: 'هياكل موثقة بيوميًا في العالم خارج تقييم Useful v3.1.',
  },

  en: {
    // Navigation & Header
    siteTitle: 'SeedLens',
    siteSubtitle: 'Minecraft Java Seed Discovery & Analysis',
    navAnalyzer: 'Analyzer',
    navHowItWorks: 'How It Works',
    navCategories: 'Categories',
    engineCore: 'Engine Core',
    minecraftJava: 'Java',

    // Hero
    heroBadge: 'Deterministic Java 1.20.6 Structure Engine',
    heroTitlePrefix: "What's special about ",
    heroTitleHighlight: 'your seed?',
    heroDesc:
      'Input any Minecraft Java seed to discover rare multi-structure clusters, trading hubs, abyssal surface-to-deep connections, and strategic outposts across a 10,000×10,000 block world perimeter.',
    statRadiusTitle: '10K Block Radius',
    statRadiusDesc: 'Covers [-5000, 5000] around world spawn',
    statTaxonomyTitle: 'v3.1 Calibrated',
    statTaxonomyDesc: '5 strategic category classification filters',
    statCubiomesTitle: 'Cubiomes Verified',
    statCubiomesDesc: 'Viability checked against real terrain logic',
    statMapTitle: 'Interactive Map',
    statMapDesc: 'Minecraft X/Z coordinate projection',

    // Seed Input
    inputPlaceholder: 'Enter your Minecraft seed (e.g. 123456789 or text)',
    analyzeButton: 'Analyze Seed',
    analyzingButton: 'Analyzing...',
    clearInput: 'Clear input',
    trySampleSeeds: 'Try sample seeds:',
    textSeedNotePrefix: 'Text seed "',
    textSeedNoteSuffix: '" will be converted to Java seed numeric: ',
    errorEmptySeed: 'Please enter a Minecraft seed number or world name.',
    errorInvalidSeed: 'Invalid seed.',

    // Presets
    presetTrading: 'Trading Metropolis',
    presetSpawn: 'Spawn Outpost & Mega-Hub',
    presetStrategic: 'Strategic Hub',
    presetNegative: 'Negative Seed',
    presetEmpty: 'Zero Useful Edge Case',

    // Results Header
    analysisComplete: 'Analysis Complete',
    seedLabel: 'Seed',
    copySeed: 'Copy Seed to clipboard',
    copiedSeed: 'Copied!',
    convertedFromText: 'Converted from input text: ',
    usefulLocations: 'Useful Locations',
    totalClusters: 'Total Clusters',
    searchRadius: 'Search Radius',
    searchRadiusVal: '±5000m',
    versionLabel: 'Minecraft Java',
    discoveredClustersTitle: 'Discovered Structural Clusters',

    // Filter & Sort
    filterLabel: 'Filter:',
    filterAll: 'All',
    sortDefault: 'Sort: Recommended (Engine Rank)',
    sortSpawnAsc: 'Sort: Closest to Spawn',
    sortCountDesc: 'Sort: Most Structures',
    sortDiameterAsc: 'Sort: Smallest Diameter',
    sortDensityDesc: 'Sort: Highest Density',
    viewSplit: 'Split View (Cards & Map)',
    viewCards: 'Cards Only',
    viewMap: 'Map Only',
    showingLocationsCount: 'Showing {count} locations',
    clickCardToFocus: 'Click a card to focus on map',

    // Cluster Card
    clusterNumber: 'Cluster #',
    structuresCount: '{count} structures',
    typesCount: '{count} types',
    diameterLabel: 'Diameter',
    nearestPairLabel: 'Nearest Pair',
    fromSpawnLabel: 'From Spawn',
    densityLabel: 'Density',
    pointsLabel: 'points',
    blocksUnit: 'm',
    viewOnMap: 'View on Map',
    focusedOnMap: 'Focused on Map',
    viewStructures: 'Structures',

    // Cluster Modal
    clusterDetailsTitle: 'Cluster Overview',
    centerCoords: 'Center: X: {x}, Z: {z}',
    engineAnalysis: 'Engine Analysis',
    totalStructuresModal: 'Total Structures',
    structuresInCluster: 'Structures inside Cluster ({count})',
    clickToCopyTp: 'Click copy to copy /tp command',
    tpCommand: '/tp',
    tpCopied: 'Copied',
    locateOnMap: 'Locate on Map',
    close: 'Close',

    // Empty State
    emptyTitle: 'No highlighted locations found',
    emptyDesc:
      "SeedLens didn't find any locations matching the current interesting-location criteria within the search area.",
    emptySubdesc:
      'Try another seed to find rare multi-structure hubs and trading metropolises.',
    tryAnotherSeed: 'Try Another Seed',
    evaluatedClusters: '{count} total clusters evaluated',

    // Loading State
    loadingTitle: 'Analyzing your seed...',
    loadingStep1: 'Initializing Cubiomes generator...',
    loadingStep2: 'Discovering structure generation bounds...',
    loadingStep3: 'Computing spatial clusters & density...',
    loadingStep4: 'Evaluating v3.1 interesting locations & categories...',

    // Error State
    errorTitle: 'Analysis Failed',
    tryAgain: 'Try Again',

    // Map
    mapTitle: 'Minecraft Spatial Grid',
    mapBounds: '[-5000 to +5000]',
    mapSpawnMarker: 'World Spawn',
    mapOriginMarker: 'World Origin (0, 0)',
    mapHoverCoords: 'Hover map for coordinates',
    mapZoomIn: 'Zoom In',
    mapZoomOut: 'Zoom Out',
    mapFocusSpawn: 'Go to World Spawn',
    mapFocusOrigin: 'Go to World Origin (0, 0)',
    mapFitBounds: 'Fit Search Bounds',
    legendSpawn: 'World Spawn',
    legendOrigin: 'World Origin (0, 0)',
    mapStylizedBadge: 'Stylized Tactical Preview — Not actual Minecraft voxel terrain',
    legendVillage: 'Village',
    legendAncientCity: 'Ancient City',
    legendShipwreck: 'Shipwreck',
    legendPyramid: 'Pyramid',
    mapLoading: 'Loading Minecraft Map...',
    mapProjecting: 'Projecting spatial grid',
    mapLayerBiomes: 'Realistic Terrain & Biomes',
    mapLayerMinimal: 'Minimalist Grid',
    mapToggleBiomes: 'Toggle Terrain & Biomes',
    mapElevationLabel: 'Elevation',
    mapActiveBiome: 'Active Biome',
    legendBiomes: 'Terrain & Biomes',
    legendStructures: 'Detected Structures',
    legendCherryGrove: 'Cherry Grove (Sakura)',
    legendPlains: 'Plains & Forest',
    legendDesert: 'Desert & Badlands',
    legendPeaks: 'Peaks & Snow',
    legendOcean: 'Oceans & Rivers',

    // Categories Section
    categoriesSectionBadge: 'v3.1 Calibrated Taxonomy',
    categoriesSectionTitle: 'Cluster Categories',
    categoriesSectionDesc:
      'SeedLens evaluates structures against deterministic, mathematically calibrated archetypes so you know exactly why each location matters.',
    criteriaLabel: 'Criteria',

    // How it works
    howItWorksBadge: 'Under the Hood',
    howItWorksTitle: 'How SeedLens Analyzes Worlds',
    howItWorksDesc:
      'High-performance native C engine combined with spatial clustering algorithms to deliver instant, verified seed intelligence.',
    step1Title: 'Deterministic Seed Viability',
    step1Desc:
      'Uses cubiomes C core to deterministically simulate Minecraft Java 1.20.6 biome distribution and structure generation rules without launching the game.',
    step2Title: '10K Spatial Block Perimeter',
    step2Desc:
      'Scans [-5000, 5000] along both X and Z axes from world spawn, recording villages, ancient cities, desert pyramids, shipwrecks, and jungle temples.',
    step3Title: 'Spatial Clustering & Density',
    step3Desc:
      'Groups nearby structures within a 500m radius into multi-pass spatial clusters, calculating exact bounding diameters, closest pairwise distances, and point densities.',
    step4Title: 'Useful v3.1 Category Evaluation',
    step4Desc:
      'Filters candidate clusters against rigorous strategic rules to identify Spawn Outposts, Trading Metropolises, Abyssal surface-to-deep links, and Mega-Hubs.',

    // Footer
    footerEngineName: 'SeedLens',
    footerTagline:
      'Deterministic Spatial Structure Discovery for Minecraft Java 1.20.6',
    backToTop: 'Back to top',
    disclaimer1:
      'Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.',
    disclaimer2:
      'Minecraft is a registered trademark of Mojang Synergies AB.',

    // Category Names
    catStrategicMegaHub: 'Strategic Mega-Hub',
    catTradingMetropolis: 'Trading Metropolis',
    catAbyssalHub: 'Abyssal Hub',
    catSpawnOutpost: 'Spawn Outpost',
    catDenseMulti: 'Dense Multi',

    // Category Descriptions
    catStrategicMegaHubDesc:
      'Rare massive multi-structure gatherings combining three or more distinct structure types in close proximity for maximum progression speed.',
    catTradingMetropolisDesc:
      'Multiple viable villages within easy walking distance, ideal for establishing villager trading halls, iron farms, and multi-settlement civilizations.',
    catAbyssalHubDesc:
      'Direct connection from surface civilization or coastal points down to deep dark ancient cities, providing rapid looting and underground progression.',
    catSpawnOutpostDesc:
      'Immediately accessible from world spawn with ready resources, food, blacksmith loot, or quick deep underground entry without long travel.',
    catDenseMultiDesc:
      'Hyper-compact structure clusters where multiple points of interest generate right next to each other within short walking radius.',

    // Structures
    structVillage: 'Village',
    structShipwreck: 'Shipwreck',
    structAncientCity: 'Ancient City',
    structDesertPyramid: 'Desert Pyramid',
    structJungleTemple: 'Jungle Temple',
    structPillagerOutpost: 'Pillager Outpost',
    structOceanMonument: 'Ocean Monument',
    structWoodlandMansion: 'Woodland Mansion',
    structTrailRuins: 'Trail Ruins',
    structTrialChambers: 'Trial Chambers',
    discoveredPOIs: 'Discovered World POIs',
    discoveredDesc: 'Biome-verified world landmarks outside Useful v3.1 evaluation.',
  },
};
