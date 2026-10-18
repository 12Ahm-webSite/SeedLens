'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  Hammer,
  Swords,
  Flower2,
  Anchor,
  Coins,
  Sliders,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Flame,
  Search,
  Mountain,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { findDreamSeed } from '@/lib/api';
import { SUPPORTED_VERSIONS, getVersionFeatures } from '@/lib/validation';
import type {
  PlaystylePresetId,
  WishlistQuery,
  WishlistMatchResult,
  SeedLensResult,
} from '@/types/seedlens';
import WaypointsModal from '@/components/WaypointsModal';
import PostcardModal from '@/components/PostcardModal';

interface WishlistFinderProps {
  selectedVersion: string;
  onVersionChange?: (version: string) => void;
  onSelectSeed: (seed: string, version: string) => void;
}

export default function WishlistFinder({
  selectedVersion,
  onVersionChange,
  onSelectSeed,
}: WishlistFinderProps) {
  const { t, dir, locale } = useLanguage();

  const [activePreset, setActivePreset] = useState<PlaystylePresetId | null>(
    'mega_builder'
  );
  const [minScenicScore, setMinScenicScore] = useState<number>(70);
  const [minBuildingScore, setMinBuildingScore] = useState<number>(80);
  const [landmarkType, setLandmarkType] = useState<string>('any');
  const [clusterCategory, setClusterCategory] = useState<string>('any');
  const [maxDistance, setMaxDistance] = useState<number>(2000);

  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<WishlistMatchResult | null>(
    null
  );
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [copiedTp, setCopiedTp] = useState(false);
  const [showWaypointsModal, setShowWaypointsModal] = useState(false);
  const [showPostcardModal, setShowPostcardModal] = useState(false);

  const synthesizedResult: SeedLensResult | null = matchResult
    ? {
        seed: matchResult.seed,
        minecraft_version: matchResult.version,
        world_spawn: { x: 0, z: 0 },
        search: { min_x: -5000, max_x: 5000, min_z: -5000, max_z: 5000 },
        summary: { total_clusters: 1, useful_clusters: 1 },
        clusters:
          matchResult.highlightType === 'cluster'
            ? [
                {
                  id: 1,
                  primary_category: matchResult.highlight.category,
                  categories: [matchResult.highlight.category],
                  center: { x: matchResult.highlight.x, z: matchResult.highlight.z },
                  cluster: {
                    count: 3,
                    type_count: 2,
                    diameter: 450,
                    closest_pair: 120,
                    nearest_spawn: matchResult.highlight.distance,
                    density: 0.00002,
                  },
                  structures_summary: [],
                  structures: [],
                  explanation: matchResult.highlight.description,
                },
              ]
            : [],
        landmarks:
          matchResult.highlightType === 'landmark'
            ? {
                total_found: 1,
                spot_count: 1,
                spots: [
                  {
                    id: 1,
                    category: matchResult.highlight.category,
                    name_ar: matchResult.highlight.name,
                    name_en: matchResult.highlight.name,
                    x: matchResult.highlight.x,
                    y: matchResult.highlight.y || 64,
                    z: matchResult.highlight.z,
                    distance_to_spawn: matchResult.highlight.distance,
                    primary_biome: matchResult.highlight.primaryBiome || 'Plains',
                    surrounding_biomes: [],
                    scenic_score: matchResult.highlight.scenicScore ?? 80,
                    building_score: matchResult.highlight.buildingScore ?? 80,
                    tags: [],
                    teleport_command: matchResult.highlight.tpCommand,
                    description_ar: matchResult.highlight.description,
                    description_en: matchResult.highlight.description,
                  },
                ],
              }
            : undefined,
        discovery:
          matchResult.highlightType === 'discovery'
            ? {
                total_discovered: 1,
                by_type: { [matchResult.highlight.category]: 1 },
                structures: [
                  {
                    type: matchResult.highlight.category,
                    x: matchResult.highlight.x,
                    z: matchResult.highlight.z,
                    distance_to_spawn: matchResult.highlight.distance,
                    viability_status: 'biome_viable',
                  },
                ],
              }
            : undefined,
      }
    : null;

  // Version features
  const features = getVersionFeatures(selectedVersion);

  // Automatically adapt selected filters when user switches Minecraft version
  useEffect(() => {
    // If user selected cherry caldera on 1.18 or 1.19, adapt to mountain crater
    if (!features.hasCherryGroves && landmarkType === 'cherry_caldera') {
      setLandmarkType('mountain_crater');
    }
    // If user selected abyssal hub on 1.18, adapt to trading metropolis
    if (!features.hasAncientCity && clusterCategory === 'abyssal_hub') {
      setClusterCategory('trading_metropolis');
    }
  }, [selectedVersion, features.hasCherryGroves, features.hasAncientCity, landmarkType, clusterCategory]);

  // Apply playstyle presets dynamically based on the active version
  const handleSelectPreset = (preset: PlaystylePresetId) => {
    setActivePreset(preset);
    setSearchError(null);

    switch (preset) {
      case 'mega_builder':
        setLandmarkType('prime_building_basin');
        setMinBuildingScore(85);
        setMinScenicScore(60);
        setClusterCategory('any');
        setMaxDistance(1500);
        break;
      case 'dungeon_raider':
        setLandmarkType('any');
        setMinBuildingScore(40);
        setMinScenicScore(50);
        if (features.hasTrialChambers) {
          setClusterCategory('trial_or_abyssal');
        } else if (features.hasAncientCity) {
          setClusterCategory('abyssal_hub');
        } else {
          setClusterCategory('strategic_mega_hub');
        }
        setMaxDistance(2000);
        break;
      case 'aesthetic_creator':
        if (features.hasCherryGroves) {
          setLandmarkType('cherry_caldera');
        } else {
          setLandmarkType('mountain_crater');
        }
        setMinScenicScore(90);
        setMinBuildingScore(60);
        setClusterCategory('any');
        setMaxDistance(2500);
        break;
      case 'castaway_survivor':
        setLandmarkType('isolated_island');
        setMinScenicScore(70);
        setMinBuildingScore(50);
        setClusterCategory('any');
        setMaxDistance(1000);
        break;
      case 'economy_mogul':
        setLandmarkType('any');
        setMinScenicScore(50);
        setMinBuildingScore(75);
        setClusterCategory('trading_metropolis');
        setMaxDistance(2000);
        break;
    }
  };

  const handleCustomChange = () => {
    setActivePreset(null);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchError(null);
    setMatchResult(null);

    try {
      const query: WishlistQuery = {
        playstylePreset: activePreset || undefined,
        landmarkType: landmarkType !== 'any' ? landmarkType : undefined,
        minScenicScore,
        minBuildingScore,
        clusterCategory: clusterCategory !== 'any' ? clusterCategory : undefined,
        maxSpawnDistance: maxDistance,
        version: selectedVersion,
      };

      const result = await findDreamSeed(query);
      setMatchResult(result);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to discover matching seed.';
      setSearchError(msg);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopySeed = (seedStr: string) => {
    navigator.clipboard.writeText(seedStr);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 1800);
  };

  const handleCopyTp = (tpStr: string) => {
    navigator.clipboard.writeText(tpStr);
    setCopiedTp(true);
    setTimeout(() => setCopiedTp(false), 1800);
  };

  // Configure dynamic presets adapting to the version
  const presetsConfig = [
    {
      id: 'mega_builder' as PlaystylePresetId,
      title: t.presetMegaBuilderTitle,
      role: t.presetMegaBuilderRole,
      desc: t.presetMegaBuilderDesc,
      icon: Hammer,
      badge: 'Building ≥ 85%',
      colorClass: 'border-[#5B8731] hover:border-[#89BD44] bg-[#5B8731]/10',
      activeClass:
        'border-[#89BD44] bg-[#5B8731]/20 shadow-[0_0_15px_rgba(91,135,49,0.35)]',
      iconColor: 'text-[#89BD44]',
    },
    {
      id: 'dungeon_raider' as PlaystylePresetId,
      title: t.presetDungeonRaiderTitle,
      role: t.presetDungeonRaiderRole,
      desc: features.hasTrialChambers
        ? t.presetDungeonRaiderDesc
        : features.hasAncientCity
        ? t.presetDungeonRaiderDesc119_120
        : t.presetDungeonRaiderDesc118,
      icon: Swords,
      badge: features.hasTrialChambers
        ? 'Trial & Deep City'
        : features.hasAncientCity
        ? 'Ancient City (1.19+)'
        : 'Outpost & Forts (1.18)',
      colorClass: 'border-[#C86432] hover:border-[#E87E48] bg-[#C86432]/10',
      activeClass:
        'border-[#E87E48] bg-[#C86432]/20 shadow-[0_0_15px_rgba(200,100,50,0.35)]',
      iconColor: 'text-[#E87E48]',
    },
    {
      id: 'aesthetic_creator' as PlaystylePresetId,
      title: t.presetAestheticCreatorTitle,
      role: t.presetAestheticCreatorRole,
      desc: features.hasCherryGroves
        ? t.presetAestheticCreatorDesc
        : t.presetAestheticCreatorDescLegacy,
      icon: features.hasCherryGroves ? Flower2 : Mountain,
      badge: features.hasCherryGroves ? 'Cherry & Peaks ≥ 90%' : 'C&C Peaks ≥ 90%',
      colorClass: 'border-[#EC4899] hover:border-[#F472B6] bg-[#EC4899]/10',
      activeClass:
        'border-[#F472B6] bg-[#EC4899]/20 shadow-[0_0_15px_rgba(236,72,153,0.35)]',
      iconColor: 'text-[#F472B6]',
    },
    {
      id: 'castaway_survivor' as PlaystylePresetId,
      title: t.presetCastawaySurvivorTitle,
      role: t.presetCastawaySurvivorRole,
      desc: t.presetCastawaySurvivorDesc,
      icon: Anchor,
      badge: 'Deep Ocean Island',
      colorClass: 'border-[#0EA5E9] hover:border-[#38BDF8] bg-[#0EA5E9]/10',
      activeClass:
        'border-[#38BDF8] bg-[#0EA5E9]/20 shadow-[0_0_15px_rgba(14,165,233,0.35)]',
      iconColor: 'text-[#38BDF8]',
    },
    {
      id: 'economy_mogul' as PlaystylePresetId,
      title: t.presetEconomyMogulTitle,
      role: t.presetEconomyMogulRole,
      desc: t.presetEconomyMogulDesc,
      icon: Coins,
      badge: 'Metropolis (4+ Villages)',
      colorClass: 'border-[#D49B1E] hover:border-[#FADB44] bg-[#D49B1E]/10',
      activeClass:
        'border-[#FADB44] bg-[#D49B1E]/20 shadow-[0_0_15px_rgba(212,155,30,0.35)]',
      iconColor: 'text-[#FADB44]',
    },
  ];

  return (
    <div className="mc-panel p-5 sm:p-7 relative overflow-hidden transition-all duration-300">
      {/* Background Decorative Grid */}
      <div className="absolute -top-24 -end-24 w-72 h-72 bg-gradient-to-br from-[#89BD44]/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Banner with Dynamic Version Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#866043] text-[#FADB44] font-mc-mono text-xs font-bold mb-2 border-t-2 border-l-2 border-[#A87954] border-b-2 border-r-2 border-[#4E3523] shadow-[1px_1px_0_rgba(0,0,0,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-[#FADB44] animate-pulse" />
            <span>{t.wishlistHeroBadge}</span>
          </div>
          <h2 className="font-mc-heading text-2xl sm:text-3xl text-[#1E1E1E] dark:text-[#F1F5F9] font-bold">
            {t.wishlistTitle}
          </h2>
          <p className="text-sm text-[#4A4A4A] dark:text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            {t.wishlistSubtitle}
          </p>
        </div>

        {/* Prominent Version Switcher directly inside Wishlist Finder */}
        <div className="p-2.5 rounded bg-black/10 dark:bg-black/40 border border-[#9E9E9E] dark:border-[#444] shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-1.5">
            <Layers className="w-3.5 h-3.5 text-[#5B8731] shrink-0" />
            <span>{t.selectedVersionLabel}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_VERSIONS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onVersionChange && onVersionChange(v)}
                className={`text-xs px-2.5 py-1 rounded font-mc-mono font-bold transition-all cursor-pointer ${
                  selectedVersion === v
                    ? 'bg-[#5B8731] text-white border-b-2 border-[#3D5A20] shadow-sm scale-105'
                    : 'bg-black/5 dark:bg-white/5 text-[#555] dark:text-[#94A3B8] hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Version Compatibility Notice Banner */}
      {selectedVersion.startsWith('1.18') && (
        <div className="mb-6 p-3 rounded bg-[#D49B1E]/15 border-l-4 border-[#D49B1E] text-xs text-[#866043] dark:text-[#FADB44] flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#D49B1E]" />
          <span>{t.versionNotice118}</span>
        </div>
      )}
      {selectedVersion.startsWith('1.19') && (
        <div className="mb-6 p-3 rounded bg-[#0EA5E9]/15 border-l-4 border-[#0EA5E9] text-xs text-[#0284C7] dark:text-[#38BDF8] flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#0EA5E9]" />
          <span>{t.versionNotice119}</span>
        </div>
      )}
      {selectedVersion.startsWith('1.20') && (
        <div className="mb-6 p-3 rounded bg-[#EC4899]/15 border-l-4 border-[#EC4899] text-xs text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 text-[#EC4899]" />
          <span>{t.versionNotice120}</span>
        </div>
      )}

      {/* Step 1: RPG Playstyle Presets */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
            <Flame className="w-4 h-4 text-[#C86432]" />
            <span className="font-mc-heading uppercase tracking-wide">
              {t.playstylePresetsTitle}
            </span>
          </div>
          <span className="text-xs text-[#555] dark:text-[#94A3B8]">
            {t.playstylePresetsSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {presetsConfig.map((p) => {
            const Icon = p.icon;
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`text-start p-3.5 rounded border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isSelected ? p.activeClass : p.colorClass
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded bg-black/20 ${p.iconColor} shadow-inner`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold font-mc-mono px-1.5 py-0.5 bg-[#5B8731] text-white rounded">
                        ✓ {locale === 'ar' ? 'محدد' : 'Active'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-[#1E1E1E] dark:text-[#F1F5F9]">
                    {p.title}
                  </h3>
                  <p className="text-[11px] font-medium text-[#5B8731] dark:text-[#89BD44] mb-1.5">
                    {p.role}
                  </p>
                  <p className="text-[11px] text-[#4A4A4A] dark:text-[#94A3B8] leading-tight line-clamp-2">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10">
                  <span className="text-[10px] font-mc-mono font-bold text-[#1E1E1E] dark:text-[#E2E8F0] opacity-80">
                    {p.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Custom Fine-Tuning Sliders & Selectors */}
      <div className="mb-8 p-4 sm:p-5 rounded bg-black/5 dark:bg-black/30 border border-[#9E9E9E] dark:border-[#333]">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
          <Sliders className="w-4 h-4 text-[#866043]" />
          <span className="font-mc-heading uppercase">
            {t.customWishlistTitle}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Scenic Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[#333] dark:text-[#CBD5E1]">
                {t.minScenicScore}
              </span>
              <span className="font-mc-mono font-bold px-2 py-0.5 rounded bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30">
                {minScenicScore}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minScenicScore}
              onChange={(e) => {
                setMinScenicScore(Number(e.target.value));
                handleCustomChange();
              }}
              className="w-full accent-[#EC4899] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#777] font-mc-mono">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Building Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[#333] dark:text-[#CBD5E1]">
                {t.minBuildingScore}
              </span>
              <span className="font-mc-mono font-bold px-2 py-0.5 rounded bg-[#5B8731]/20 text-[#5B8731] dark:text-[#89BD44] border border-[#5B8731]/30">
                {minBuildingScore}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minBuildingScore}
              onChange={(e) => {
                setMinBuildingScore(Number(e.target.value));
                handleCustomChange();
              }}
              className="w-full accent-[#5B8731] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#777] font-mc-mono">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Desired Landmark Type */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#333] dark:text-[#CBD5E1] font-medium block">
              {t.desiredLandmark}
            </label>
            <select
              value={landmarkType}
              onChange={(e) => {
                setLandmarkType(e.target.value);
                handleCustomChange();
              }}
              className="w-full bg-[#E5E5E5] dark:bg-[#1E1F24] border border-[#9E9E9E] dark:border-[#444] text-[#1E1E1E] dark:text-[#F1F5F9] text-xs rounded px-3 py-2 font-medium focus:outline-none focus:border-[#5B8731]"
            >
              <option value="any">{t.anyOption}</option>

              {/* Version Gated: Cherry Blossom Caldera (1.20+) */}
              {features.hasCherryGroves ? (
                <option value="cherry_caldera">
                  🌸 {locale === 'ar' ? 'فوهة كرز جبلية' : 'Cherry Caldera'}
                </option>
              ) : (
                <option value="cherry_caldera" disabled>
                  🌸 {locale === 'ar' ? 'فوهة كرز جبلية' : 'Cherry Caldera'}{' '}
                  {t.requiresVersion120}
                </option>
              )}

              <option value="prime_building_basin">
                🏰 {locale === 'ar' ? 'حوض بناء مستوٍ' : 'Prime Building Basin'}
              </option>
              <option value="mountain_crater">
                🏔️ {locale === 'ar' ? 'فوهة جبلية محاطة بقمم' : 'Mountain Crater'}
              </option>
              <option value="epic_clifftop">
                📷 {locale === 'ar' ? 'جرف بانورامي شاهق' : 'Epic Clifftop'}
              </option>
              <option value="isolated_island">
                🏝️ {locale === 'ar' ? 'جزيرة نجاة معزولة' : 'Survival Island'}
              </option>
            </select>
          </div>

          {/* Desired Cluster Type */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#333] dark:text-[#CBD5E1] font-medium block">
              {t.desiredCluster}
            </label>
            <select
              value={clusterCategory}
              onChange={(e) => {
                setClusterCategory(e.target.value);
                handleCustomChange();
              }}
              className="w-full bg-[#E5E5E5] dark:bg-[#1E1F24] border border-[#9E9E9E] dark:border-[#444] text-[#1E1E1E] dark:text-[#F1F5F9] text-xs rounded px-3 py-2 font-medium focus:outline-none focus:border-[#5B8731]"
            >
              <option value="any">{t.anyOption}</option>
              <option value="trading_metropolis">
                🏛️ {locale === 'ar' ? 'عاصمة تجارية (قرى متعددة)' : 'Trading Metropolis'}
              </option>

              {/* Version Gated: Trial Chambers / Ancient City */}
              {features.hasTrialChambers ? (
                <option value="trial_or_abyssal">
                  ⚔️ {locale === 'ar' ? 'غرف محاكمة أو مدينة قديمة (1.21+)' : 'Trial / Abyssal (1.21+)'}
                </option>
              ) : features.hasAncientCity ? (
                <option value="trial_or_abyssal">
                  🌌 {locale === 'ar' ? 'مدينة قديمة في الأعماق (1.19+)' : 'Ancient City in Deep (1.19+)'}
                </option>
              ) : (
                <option value="trial_or_abyssal" disabled>
                  ⚔️ {locale === 'ar' ? 'غرف محاكمة وأعماق' : 'Trial & Abyssal'}{' '}
                  {t.requiresVersion119}
                </option>
              )}

              {/* Abyssal Hub (Ancient City) */}
              {features.hasAncientCity ? (
                <option value="abyssal_hub">
                  🌌 {locale === 'ar' ? 'مركز أعماق سحيق (1.19+)' : 'Abyssal Hub (1.19+)'}
                </option>
              ) : (
                <option value="abyssal_hub" disabled>
                  🌌 {locale === 'ar' ? 'مركز أعماق سحيق' : 'Abyssal Hub'}{' '}
                  {t.requiresVersion119}
                </option>
              )}

              <option value="spawn_outpost">
                🚀 {locale === 'ar' ? 'بؤرة Spawn استراتيجية' : 'Spawn Outpost'}
              </option>
              <option value="strategic_mega_hub">
                💎 {locale === 'ar' ? 'مركز استراتيجي فائق' : 'Strategic Mega-Hub'}
              </option>
            </select>
          </div>
        </div>

        {/* Max Proximity from Spawn */}
        <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-medium text-[#333] dark:text-[#CBD5E1]">
            {t.maxSpawnDistance}:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { val: 500, label: t.distImmediate },
              { val: 1000, label: t.distClose },
              { val: 2000, label: t.distMedium },
              { val: 5000, label: t.distFar },
            ].map((dist) => (
              <button
                key={dist.val}
                type="button"
                onClick={() => {
                  setMaxDistance(dist.val);
                  handleCustomChange();
                }}
                className={`text-xs px-3 py-1 rounded font-mc-mono font-bold transition-all cursor-pointer ${
                  maxDistance === dist.val
                    ? 'bg-[#866043] text-white border-b-2 border-[#4E3523] shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 text-[#555] dark:text-[#94A3B8] hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {dist.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button: Find Seed */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full sm:w-auto px-8 py-3.5 mc-btn-green font-mc-heading text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t.searchingSeedsTitle}</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5 text-white animate-bounce" />
              <span>{t.findDreamSeedBtn}</span>
            </>
          )}
        </button>

        {isSearching && (
          <div className="flex items-center gap-2 text-xs text-[#5B8731] dark:text-[#89BD44] font-medium animate-pulse">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{t.searchingSeedsDesc}</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {searchError && (
        <div className="mt-6 p-4 rounded bg-[#E57373]/15 border-2 border-[#E57373] text-[#D32F2F] dark:text-[#EF5350] text-sm">
          {searchError}
        </div>
      )}

      {/* Matched Result Presentation Card */}
      {matchResult && (
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-[#5B8731] shadow-[0_0_25px_rgba(91,135,49,0.25)] text-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Top Decorative Bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#5B8731] via-[#FADB44] to-[#2CBAA8]"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Seed & Highlight details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mc-mono bg-[#5B8731] text-white flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#FADB44]" />
                  {t.matchFoundTitle}
                </span>
                <span className="text-xs text-[#94A3B8] font-mc-mono">
                  {t.evaluationStats
                    .replace('{count}', String(matchResult.seedsEvaluatedCount))
                    .replace('{ms}', String(matchResult.searchTimeMs))}
                </span>
                <span className="text-[11px] font-mc-mono px-2 py-0.5 rounded bg-white/10 text-[#FADB44] border border-white/20">
                  MC {matchResult.version}
                </span>
              </div>

              {/* Seed Display with One-Click Copy */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-[#94A3B8] font-bold">
                  {t.seedLabel}:
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-white/20">
                  <span className="font-mc-mono text-xl sm:text-2xl text-[#FADB44] font-bold tracking-wider select-all">
                    {matchResult.seed}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopySeed(matchResult.seed)}
                    className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title={t.copySeed}
                  >
                    {copiedSeed ? (
                      <Check className="w-4 h-4 text-[#89BD44]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {copiedSeed && (
                  <span className="text-xs text-[#89BD44] font-bold animate-in fade-in">
                    {t.copiedSeed}
                  </span>
                )}
              </div>

              {/* Highlight Feature Card */}
              <div className="p-3.5 rounded bg-white/5 border border-white/10 max-w-2xl space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#F1F5F9]">
                    <MapPin className="w-4 h-4 text-[#E57373] shrink-0" />
                    <span>{matchResult.highlight.name}</span>
                  </div>
                  {matchResult.highlight.scenicScore !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mc-mono px-2 py-0.5 rounded bg-[#EC4899]/20 text-[#F472B6] border border-[#EC4899]/40">
                        {t.scenicScoreLabel}: {matchResult.highlight.scenicScore}%
                      </span>
                      <span className="text-[11px] font-mc-mono px-2 py-0.5 rounded bg-[#5B8731]/20 text-[#89BD44] border border-[#5B8731]/40">
                        {t.buildingScoreLabel}:{' '}
                        {matchResult.highlight.buildingScore}%
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  {matchResult.highlight.description}
                </p>

                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/10 text-xs">
                  <span className="text-[#94A3B8] font-mc-mono">
                    {t.fromSpawnLabel}:{' '}
                    <strong className="text-white">
                      {Math.round(matchResult.highlight.distance)} {t.blocksUnit}
                    </strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopyTp(matchResult.highlight.tpCommand)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/40 hover:bg-black/60 border border-white/20 text-[#FADB44] font-mc-mono text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedTp ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#89BD44]" />
                        <span>{t.copiedTpCommand}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{matchResult.highlight.tpCommand}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onSelectSeed(matchResult.seed, matchResult.version)
                }
                className="px-6 py-4 rounded mc-btn-green font-mc-heading text-sm text-center uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>{t.openFullAnalysisBtn}</span>
                {dir === 'rtl' ? (
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                ) : (
                  <ArrowRight className="w-4 h-4 shrink-0" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowWaypointsModal(true)}
                  className="flex-1 px-3 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-center font-medium text-[#CBD5E1] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  title={t.exportWaypointsBtn}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#89BD44]" />
                  <span>{t.exportWaypointsBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPostcardModal(true)}
                  className="flex-1 px-3 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-center font-medium text-[#CBD5E1] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  title={t.exportPostcardBtn}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FADB44]" />
                  <span>{t.exportPostcardBtn}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="px-4 py-2.5 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-center font-medium text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
              >
                {t.findAnotherSeedBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 4: Waypoints Modal */}
      {synthesizedResult && (
        <WaypointsModal
          isOpen={showWaypointsModal}
          onClose={() => setShowWaypointsModal(false)}
          data={synthesizedResult}
        />
      )}

      {/* Phase 4: Postcard Modal */}
      {synthesizedResult && (
        <PostcardModal
          isOpen={showPostcardModal}
          onClose={() => setShowPostcardModal(false)}
          data={synthesizedResult}
        />
      )}
    </div>
  );
}
