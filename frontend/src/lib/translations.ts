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
  errorOutOfRange: string;
  generateRandomSeedBtn: string;

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

  // Landmarks & Scenic/Building Spots
  tabUsefulClusters: string;
  tabLandmarks: string;
  tabAllResults: string;
  allResultsBanner: string;
  allResultsBannerAction: string;
  landmarksSectionTitle: string;
  landmarksSectionDesc: string;
  landmarksCountLabel: string;
  scenicScoreLabel: string;
  buildingScoreLabel: string;
  surroundingBiomesLabel: string;
  primaryBiomeLabel: string;
  copyTpCommand: string;
  copiedTpCommand: string;
  legendLandmarks: string;
  filterAllLandmarks: string;
  navDocumentation: string;

  // Criteria translations
  criteriaStrategicMegaHub: string;
  criteriaTradingMetropolis: string;
  criteriaAbyssalHub: string;
  criteriaSpawnOutpost: string;
  criteriaDenseMulti: string;

  // Documentation page
  docsTitle: string;
  docsSubtitle: string;
  docsBackHome: string;

  // Wishlist & Reverse Seed Finder
  tabAnalyzeSeed: string;
  tabWishlistFinder: string;
  tabCompareSeeds: string;
  tabCommunityVault: string;
  wishlistHeroBadge: string;
  wishlistTitle: string;
  wishlistSubtitle: string;
  playstylePresetsTitle: string;
  playstylePresetsSubtitle: string;
  presetMegaBuilderTitle: string;
  presetMegaBuilderRole: string;
  presetMegaBuilderDesc: string;
  presetDungeonRaiderTitle: string;
  presetDungeonRaiderRole: string;
  presetDungeonRaiderDesc: string;
  presetAestheticCreatorTitle: string;
  presetAestheticCreatorRole: string;
  presetAestheticCreatorDesc: string;
  presetCastawaySurvivorTitle: string;
  presetCastawaySurvivorRole: string;
  presetCastawaySurvivorDesc: string;
  presetEconomyMogulTitle: string;
  presetEconomyMogulRole: string;
  presetEconomyMogulDesc: string;
  customWishlistTitle: string;
  minScenicScore: string;
  minBuildingScore: string;
  desiredLandmark: string;
  desiredCluster: string;
  maxSpawnDistance: string;
  anyOption: string;
  distImmediate: string;
  distClose: string;
  distMedium: string;
  distFar: string;
  findDreamSeedBtn: string;
  searchingSeedsTitle: string;
  searchingSeedsDesc: string;
  matchFoundTitle: string;
  matchFoundDesc: string;
  matchedFeatureLabel: string;
  openFullAnalysisBtn: string;
  findAnotherSeedBtn: string;
  evaluationStats: string;

  // Version Adaptive Strings
  selectedVersionLabel: string;
  presetAestheticCreatorDescLegacy: string;
  presetDungeonRaiderDesc119_120: string;
  presetDungeonRaiderDesc118: string;
  requiresVersion120: string;
  requiresVersion121: string;
  requiresVersion119: string;
  versionNotice118: string;
  versionNotice119: string;
  versionNotice120: string;

  // Phase 4: Waypoints & Postcard Exporters
  exportWaypointsBtn: string;
  exportPostcardBtn: string;
  waypointsModalTitle: string;
  waypointsModalDesc: string;
  tabXaero: string;
  tabJourneyMap: string;
  downloadWaypointsFile: string;
  copyWaypointsText: string;
  copiedWaypointsText: string;
  xaeroInstallGuide: string;
  journeyMapInstallGuide: string;
  postcardModalTitle: string;
  postcardModalDesc: string;
  downloadPostcardImage: string;
  copyDiscordMarkdown: string;
  copiedDiscordMarkdown: string;
  shareOnX: string;

  // Bedrock & Edition
  editionJava: string;
  editionBedrock: string;
  bedrockParity: string;
  bedrockParityBadge: string;
  bedrockParityNotice: string;
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
    statTaxonomyTitle: 'تصنيف v4.2 الاستراتيجي',
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
    errorOutOfRange: 'قيمة البذرة تتجاوز الحد الأقصى لماينكرافت (64-بت: من -9.2 إلى +9.2 كوينتيليون). اضغط زر النرد لتوليد بذرة صالحة فوراً!',
    generateRandomSeedBtn: 'توليد بذرة عشوائية صالحة (🎲)',

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

    // Landmarks & Scenic/Building Spots
    tabUsefulClusters: 'العناقيد الهيكلية',
    tabLandmarks: 'أماكن البناء والمناظر الخلابة',
    landmarksSectionTitle: 'المواقع الطبيعية وأماكن البناء المميزة',
    landmarksSectionDesc: 'فوهات جبلية محاطة بزهور الكرز، أراضٍ مستوية واسعة للبناء، جروف بانورامية، وجزر نجاة معزولة.',
    landmarksCountLabel: 'موقع مميز مكتشف',
    scenicScoreLabel: 'الجمالية والمنظر',
    buildingScoreLabel: 'ملاءمة البناء',
    surroundingBiomesLabel: 'البيومات المحيطة',
    primaryBiomeLabel: 'البيوم الأساسي',
    copyTpCommand: 'نسخ أمر الانتقال',
    copiedTpCommand: 'تم نسخ أمر الانتقال!',
    legendLandmarks: 'المعالم الطبيعية والبنائية',
    filterAllLandmarks: 'كافة المواقع',
    tabAllResults: 'عرض كافة المواقع والعناقيد',
    allResultsBanner: 'تم اكتشاف مواقع بناء ومناظر طبيعية خلابة في هذه البذرة!',
    allResultsBannerAction: 'استعراض أماكن البناء الآن',
    navDocumentation: 'التوثيق وسجل التحديثات',

    // Criteria translations
    criteriaStrategicMegaHub: 'الهياكل ≥ 5، الأنواع ≥ 3، أقرب مسافة بينية ≤ 180م، القطر الأقصى ≤ 780م',
    criteriaTradingMetropolis: 'الهياكل ≥ 4، القرى ≥ 2، انتشار القرى ≤ 600م، القطر الأقصى ≤ 760م',
    criteriaAbyssalHub: 'الهياكل ≥ 4، المدن القديمة ≥ 1، اقتران بقرية/سفينة ضمن 450م/250م',
    criteriaSpawnOutpost: 'المسافة إلى الـ Spawn ≤ 1000م، الهياكل ≥ 3، اقتران وظيفي، القطر ≤ 720م',
    criteriaDenseMulti: 'الهياكل ≥ 4، أقرب مسافة بينية ≤ 100م، القطر ≤ 700م، كثافة مكانية عالية',

    // Documentation page
    docsTitle: 'دليل التوثيق وسجل التحديثات الرسمية',
    docsSubtitle: 'سجل شامل لكافة الميزات، محرك Cubiomes، والتحسينات المعمارية في منصة SeedLens',
    docsBackHome: 'العودة إلى المحلل الرئيسي',

    // Wishlist & Reverse Seed Finder
    tabAnalyzeSeed: 'فحص بذرة معينة',
    tabWishlistFinder: '✨ مكتشف البذور العكسي',
    tabCompareSeeds: '⚖️ مقارنة بذرتين',
    tabCommunityVault: '🏛️ بذور المجتمع والمفضلة',
    wishlistHeroBadge: 'توليد وبحث عكسي ذكي // الجيل الرابع',
    wishlistTitle: 'ابحث عن عالم أحلامك بمواصفاتك الخاصة',
    wishlistSubtitle: 'حدد رغباتك وتفضيلاتك التضاريسية والهيكلية، وسيقوم المحرك بفحص البذور والعثور على العالم المثالي لك فوراً!',
    playstylePresetsTitle: 'شخصيات وأساليب اللعب الجاهزة',
    playstylePresetsSubtitle: 'اختر هدفك من العالم بنقرة واحدة، أو اضبط الفلاتر يدوياً بالأسفل',
    presetMegaBuilderTitle: 'الملك البنّاء',
    presetMegaBuilderRole: 'بناء المدن والقواعد',
    presetMegaBuilderDesc: 'سهول فسيحة مستوية بجوار مياه وأخشاب، بأعلى درجات سهولة البناء لتشييد القواعد الضخمة.',
    presetDungeonRaiderTitle: 'صائد الأقبية',
    presetDungeonRaiderRole: 'قتال ومغامرات سريعة',
    presetDungeonRaiderDesc: 'غرف محاكمة (Trial Chambers) ومدينة قديمة قرب نقطة البداية لمغامرات قتالية ملحمية فورية.',
    presetAestheticCreatorTitle: 'صانع السينما',
    presetAestheticCreatorRole: 'لقطات وإطلالات ساحرة',
    presetAestheticCreatorDesc: 'فوهات كرز جبلية وقمم مسننة بإطلالات تفوق 90% لالتقاط أروع المشاهد وبناء القواعد السحابية.',
    presetCastawaySurvivorTitle: 'المحاصر المنعزل',
    presetCastawaySurvivorRole: 'تحدي نجاة شاق',
    presetCastawaySurvivorDesc: 'جزيرة نجاة معزولة محاطة بمحيط عميق لتحديات النجاة الحقيقية وبناء القلاع البحرية.',
    presetEconomyMogulTitle: 'التاجر الإمبراطوري',
    presetEconomyMogulRole: 'مقايضة ومزارع حديد',
    presetEconomyMogulDesc: 'عاصمة تجارية تضم قرى متعددة متقاربة لتأسيس مزارع الحديد وقاعات المقايضة فوراً.',
    customWishlistTitle: 'أو خصص مواصفات العالم بدقة',
    minScenicScore: 'الحد الأدنى لجمالية المشهد',
    minBuildingScore: 'الحد الأدنى لملاءمة البناء',
    desiredLandmark: 'المعلم الطبيعي المفضل',
    desiredCluster: 'العنقود الهيكلي المفضل',
    maxSpawnDistance: 'أقصى مسافة عن نقطة البداية (Spawn)',
    anyOption: 'أي نوع (بدون تفضيل)',
    distImmediate: 'فوري (≤ 500م)',
    distClose: 'قريب (≤ 1000م)',
    distMedium: 'متوسط (≤ 2000م)',
    distFar: 'عالم مفتوح (≤ 5000م)',
    findDreamSeedBtn: '🔍 ابحث عن البذرة المثالية الآن',
    searchingSeedsTitle: 'جاري فحص عوالم ماينكرافت...',
    searchingSeedsDesc: 'المحرك يفحص التضاريس والبيومات وعناقيد الهياكل في الخلفية...',
    matchFoundTitle: '🎉 تم العثور على البذرة المثالية لعالمك!',
    matchFoundDesc: 'حقق هذا العالم كافة المواصفات والمعايير المطلوبة بنجاح باهر.',
    matchedFeatureLabel: 'المعلم المطابق المميز',
    openFullAnalysisBtn: 'عرض التحليل الشامل والخريطة التفاعلية لهذا العالم',
    findAnotherSeedBtn: 'البحث عن بذرة أخرى بمواصفات جديدة',
    evaluationStats: 'تم فحص {count} بذرة في {ms} ملي ثانية',

    // Version Adaptive Strings
    selectedVersionLabel: 'إصدار ماينكرافت:',
    presetAestheticCreatorDescLegacy:
      'قمم جبلية مسننة وجروف بانورامية شاهقة بإطلالات ساحرة تفوق 90% (محدثة لتلائم تضاريس Caves & Cliffs في هذا الإصدار).',
    presetDungeonRaiderDesc119_120:
      'مدينة قديمة (Ancient City) وأعماق سحيقة Deep Dark قرب نقطة البداية للمغامرات والاستكشاف.',
    presetDungeonRaiderDesc118:
      'مخافر قتالية وحصون وأوكار بيلاجر لتحديات القتال الملحمية في 1.18.',
    requiresVersion120: '(يتطلب 1.20+)',
    requiresVersion121: '(يتطلب 1.21+)',
    requiresVersion119: '(يتطلب 1.19+)',
    versionNotice118:
      'ملاحظة: في إصدار 1.18.2، تم حجب أشجار الكرز (1.20+) وغرف المحاكمة (1.21+) والمدينة القديمة (1.19+) لعدم وجودها في هذا الإصدار.',
    versionNotice119:
      'ملاحظة: في إصدار 1.19.4، تتوفر المدينة القديمة، بينما تم حجب أشجار الكرز (1.20+) وغرف المحاكمة (1.21+) لعدم وجودها في هذا الإصدار.',
    versionNotice120:
      'ملاحظة: في إصدار 1.20.6، تتوفر بساتين الكرز والمدينة القديمة، بينما تتطلب غرف المحاكمة النحاسية التبديل إلى 1.21+.',

    // Phase 4: Waypoints & Postcard Exporters
    exportWaypointsBtn: 'تصدير نقاط الخريطة (Waypoints)',
    exportPostcardBtn: 'بطاقة بريدية سينمائية (Postcard)',
    waypointsModalTitle: 'تصدير نقاط العلام إلى اللعبة (Waypoints Exporter)',
    waypointsModalDesc: 'قم بتنزيل ملف النقاط وضعه في مجلد الخريطة لتظهر المعالم والعناقيد كدبابيس مشعة داخل اللعبة مباشرة!',
    tabXaero: "مود Xaero's Minimap (.txt)",
    tabJourneyMap: 'مود JourneyMap (.json)',
    downloadWaypointsFile: 'تنزيل ملف النقاط',
    copyWaypointsText: 'نسخ الكود للحافظة',
    copiedWaypointsText: 'تم النسخ بنجاح!',
    xaeroInstallGuide: 'ضع الملف المُنزل داخل المجلد: .minecraft/xaerominimap/',
    journeyMapInstallGuide: 'ضع الملف المُنزل داخل المجلد: .minecraft/journeymap/data/sp/<اسم_العالم>/waypoints/',
    postcardModalTitle: 'بطاقة ماينكرافت السينمائية (SeedLens Postcard)',
    postcardModalDesc: 'بطاقة بيكسلية أنيقة جاهزة للتحميل كصورة والمشاركة على ديسكورد وريديت وتويتر!',
    downloadPostcardImage: 'تحميل البطاقة كصورة (PNG)',
    copyDiscordMarkdown: 'نسخ نص ديسكورد / ريديت',
    copiedDiscordMarkdown: 'تم نسخ النص بنجاح!',
    shareOnX: 'مشاركة على X (تويتر)',

    // Bedrock & Edition
    editionJava: 'جافا (Java)',
    editionBedrock: 'بيدروك (Bedrock)',
    bedrockParity: 'توافق بيومي وتضاريسي مع Bedrock (1.18+)',
    bedrockParityBadge: 'توافق تضاريسي وبيومي',
    bedrockParityNotice: 'تنطبق مطابقة بذور Bedrock على التضاريس الكبرى والبيومات (1.18+).',
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
    statTaxonomyTitle: 'v4.2 Calibrated',
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
    errorOutOfRange: 'Seed value is out of 64-bit range (-9.22 to +9.22 quintillion). Click the dice to generate a valid seed!',
    generateRandomSeedBtn: 'Generate Valid Seed (🎲)',

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

    // Landmarks & Scenic/Building Spots
    tabUsefulClusters: 'Useful Clusters',
    tabLandmarks: 'Scenic & Building Spots',
    landmarksSectionTitle: 'Scenic Landscapes & Prime Building Locations',
    landmarksSectionDesc: 'Cherry blossom calderas, vast flat building basins, epic panoramic cliffs, and secluded survival islands.',
    landmarksCountLabel: 'Curated Spots Discovered',
    scenicScoreLabel: 'Scenic Score',
    buildingScoreLabel: 'Building Score',
    surroundingBiomesLabel: 'Surrounding Biomes',
    primaryBiomeLabel: 'Primary Biome',
    copyTpCommand: 'Copy Teleport Command',
    copiedTpCommand: 'Teleport Command Copied!',
    legendLandmarks: 'Natural & Building Landmarks',
    filterAllLandmarks: 'All Landmarks',
    tabAllResults: 'All Locations (Clusters & Landmarks)',
    allResultsBanner: 'Prime building locations and scenic landscapes discovered in this seed!',
    allResultsBannerAction: 'Explore Building Spots Now',
    navDocumentation: 'Documentation & Changelog',

    // Criteria translations
    criteriaStrategicMegaHub: 'Count ≥ 5, Types ≥ 3, Closest pair ≤ 180m, Diameter ≤ 780m',
    criteriaTradingMetropolis: 'Count ≥ 4, Villages ≥ 2, Village spread ≤ 600m, Diameter ≤ 760m',
    criteriaAbyssalHub: 'Count ≥ 4, Ancient Cities ≥ 1, Village/Shipwreck within 450m/250m',
    criteriaSpawnOutpost: 'Distance to spawn ≤ 1000m, Count ≥ 3, Functional pairing, Diameter ≤ 720m',
    criteriaDenseMulti: 'Count ≥ 4, Closest pair ≤ 100m, Diameter ≤ 700m, High density',

    // Documentation page
    docsTitle: 'Documentation & Official Changelog',
    docsSubtitle: 'Complete architectural reference, Cubiomes engine guide, and release history for SeedLens',
    docsBackHome: 'Back to SeedLens Analyzer',

    // Wishlist & Reverse Seed Finder
    tabAnalyzeSeed: 'Analyze Seed',
    tabWishlistFinder: '✨ Wishlist Seed Finder',
    tabCompareSeeds: '⚖️ Compare Seeds',
    tabCommunityVault: '🏛️ Community Vault & Bookmarks',
    wishlistHeroBadge: 'ACTIVE REVERSE SEARCH // V4 INTELLIGENCE',
    wishlistTitle: 'Find Your Dream World by Custom Specs',
    wishlistSubtitle: 'Specify your structural and scenic desires, and the engine will discover your perfect Minecraft seed instantly!',
    playstylePresetsTitle: 'Quick Playstyle Presets',
    playstylePresetsSubtitle: 'Select your world goal in one click, or fine-tune custom filters below',
    presetMegaBuilderTitle: 'The Mega-Builder',
    presetMegaBuilderRole: 'Base & City Builder',
    presetMegaBuilderDesc: 'Vast flat plains near water and timber with top building scores for grand bases and cities.',
    presetDungeonRaiderTitle: 'The Dungeon Raider',
    presetDungeonRaiderRole: 'Fast Action & Raids',
    presetDungeonRaiderDesc: 'Trial Chambers and Ancient Cities near spawn for instant dungeon delving and combat loot.',
    presetAestheticCreatorTitle: 'The Aesthetic Creator',
    presetAestheticCreatorRole: 'Cinematic & Screenshots',
    presetAestheticCreatorDesc: 'Cherry blossom calderas and jagged peaks with 90%+ scenic scores for breathtaking vistas.',
    presetCastawaySurvivorTitle: 'The Castaway Survivor',
    presetCastawaySurvivorRole: 'Hardcore Survival',
    presetCastawaySurvivorDesc: 'Isolated survival island surrounded by deep ocean for pure hardcore survival.',
    presetEconomyMogulTitle: 'The Economy Mogul',
    presetEconomyMogulRole: 'Trading & Iron Farms',
    presetEconomyMogulDesc: 'Trading metropolis with multiple close villages for rapid iron farming and villager trading.',
    customWishlistTitle: 'Or Fine-Tune Your Wishlist Manually',
    minScenicScore: 'Minimum Scenic Score',
    minBuildingScore: 'Minimum Building Score',
    desiredLandmark: 'Desired Landscape Feature',
    desiredCluster: 'Desired Structural Cluster',
    maxSpawnDistance: 'Maximum Distance to World Spawn',
    anyOption: 'Any Type (No Preference)',
    distImmediate: 'Immediate (≤ 500m)',
    distClose: 'Close (≤ 1000m)',
    distMedium: 'Medium (≤ 2000m)',
    distFar: 'Open World (≤ 5000m)',
    findDreamSeedBtn: '🔍 Discover Dream Seed Now',
    searchingSeedsTitle: 'Scanning Minecraft Worlds...',
    searchingSeedsDesc: 'Engine evaluating terrain, biomes, and structure viability in the background...',
    matchFoundTitle: '🎉 Dream Seed Discovered!',
    matchFoundDesc: 'This seed successfully meets all your requested world criteria.',
    matchedFeatureLabel: 'Highlighted Match',
    openFullAnalysisBtn: 'Open Full Analysis & Interactive Map',
    findAnotherSeedBtn: 'Find Another Seed',
    evaluationStats: 'Evaluated {count} seeds in {ms}ms',

    // Version Adaptive Strings
    selectedVersionLabel: 'Minecraft Version:',
    presetAestheticCreatorDescLegacy:
      'Jagged mountain peaks and epic panoramic cliffs with 90%+ scenic scores (calibrated for Caves & Cliffs terrain in this release).',
    presetDungeonRaiderDesc119_120:
      'Ancient City and Deep Dark abyss near spawn for underground raids and exploration.',
    presetDungeonRaiderDesc118:
      'Pillager outposts and battle strongholds for combat challenges in 1.18.',
    requiresVersion120: '(Requires 1.20+)',
    requiresVersion121: '(Requires 1.21+)',
    requiresVersion119: '(Requires 1.19+)',
    versionNotice118:
      'Note: In version 1.18.2, Cherry Groves (1.20+), Trial Chambers (1.21+), and Ancient Cities (1.19+) are omitted as they do not exist in this release.',
    versionNotice119:
      'Note: In version 1.19.4, Ancient Cities are available, while Cherry Groves (1.20+) and Trial Chambers (1.21+) are omitted as they do not exist in this release.',
    versionNotice120:
      'Note: In version 1.20.6, Cherry Groves and Ancient Cities are available, while Trial Chambers require switching to 1.21+.',

    // Phase 4: Waypoints & Postcard Exporters
    exportWaypointsBtn: 'Export Waypoints',
    exportPostcardBtn: 'Share Postcard',
    waypointsModalTitle: 'Export Waypoints to Minecraft Mods',
    waypointsModalDesc: 'Download the waypoints file and place it in your map mod directory to see clusters and landmarks inside Minecraft!',
    tabXaero: "Xaero's Minimap (.txt)",
    tabJourneyMap: 'JourneyMap (.json)',
    downloadWaypointsFile: 'Download File',
    copyWaypointsText: 'Copy to Clipboard',
    copiedWaypointsText: 'Copied to Clipboard!',
    xaeroInstallGuide: 'Place the downloaded file in: .minecraft/xaerominimap/',
    journeyMapInstallGuide: 'Place the downloaded file in: .minecraft/journeymap/data/sp/<world_name>/waypoints/',
    postcardModalTitle: 'SeedLens Postcard',
    postcardModalDesc: 'A pixel-art postcard ready for image download and sharing on Discord, Reddit, and X!',
    downloadPostcardImage: 'Download Postcard (PNG)',
    copyDiscordMarkdown: 'Copy Discord / Reddit Text',
    copiedDiscordMarkdown: 'Copied Markdown!',
    shareOnX: 'Share on X',

    // Bedrock & Edition
    editionJava: 'Java Edition',
    editionBedrock: 'Bedrock Edition',
    bedrockParity: 'Bedrock Terrain & Biome Parity (1.18+)',
    bedrockParityBadge: 'Biome & Terrain Parity',
    bedrockParityNotice: 'Bedrock 64-bit seed parity applies to macro-terrain and biomes (1.18+).',
  },
};
