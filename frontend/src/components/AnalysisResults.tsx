'use client';

import React, { useState, useMemo } from 'react';
import type { AnalyzeSuccessResponse, Cluster, LandmarkSpot } from '@/types/seedlens';
import ClusterCard from '@/components/ClusterCard';
import LandmarkCard from '@/components/LandmarkCard';
import ClusterDetailsModal from '@/components/ClusterDetailsModal';
import SeedMap from '@/components/SeedMap';
import EmptyState from '@/components/EmptyState';
import { useLanguage } from '@/context/LanguageContext';
import {
  Copy,
  Check,
  ArrowUpDown,
  Filter,
  Map as MapIcon,
  LayoutGrid,
  Columns,
  Share2,
  Compass,
  Sparkles,
  Globe,
  Mountain,
  Trees,
  Castle,
  Camera,
  Waves,
  MapPin,
} from 'lucide-react';
import WaypointsModal from '@/components/WaypointsModal';
import PostcardModal from '@/components/PostcardModal';

interface AnalysisResultsProps {
  data: AnalyzeSuccessResponse;
  onTryAnotherSeed?: () => void;
}

type SortOption =
  | 'default'
  | 'spawn_asc'
  | 'count_desc'
  | 'diameter_asc'
  | 'density_desc';

type ViewMode = 'split' | 'cards' | 'map';

export default function AnalysisResults({
  data,
  onTryAnotherSeed,
}: AnalysisResultsProps) {
  const { t, locale, translateCategory } = useLanguage();
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<number | null>(null);

  const { seed, minecraft_version, summary, clusters, search, discovery, landmarks } = data;

  // Default to landmarks tab if clusters is empty but landmarks exist
  const [activeMainTab, setActiveMainTab] = useState<'clusters' | 'landmarks' | 'all'>(
    clusters.length > 0 ? 'clusters' : 'landmarks'
  );
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLandmarkCategory, setActiveLandmarkCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [modalCluster, setModalCluster] = useState<Cluster | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showWaypointsModal, setShowWaypointsModal] = useState(false);
  const [showPostcardModal, setShowPostcardModal] = useState(false);

  const copySeedToClipboard = () => {
    navigator.clipboard.writeText(String(seed));
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  const handleShare = () => {
    const url = `${window.location.origin}?seed=${encodeURIComponent(String(seed))}&version=${encodeURIComponent(minecraft_version)}`;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Discover all distinct cluster categories
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    clusters.forEach((c) => {
      c.categories.forEach((cat) => cats.add(cat));
    });
    return Array.from(cats);
  }, [clusters]);

  // Discover all distinct landmark categories
  const availableLandmarkCategories = useMemo(() => {
    if (!landmarks?.spots) return [];
    const cats = new Set<string>();
    landmarks.spots.forEach((l) => cats.add(l.category));
    return Array.from(cats);
  }, [landmarks]);

  // Filter & Sort clusters
  const filteredAndSortedClusters = useMemo(() => {
    let list = [...clusters];

    if (activeCategory !== 'All') {
      list = list.filter((c) => c.categories.includes(activeCategory));
    }

    switch (sortBy) {
      case 'spawn_asc':
        list.sort((a, b) => a.cluster.nearest_spawn - b.cluster.nearest_spawn);
        break;
      case 'count_desc':
        list.sort((a, b) => b.cluster.count - a.cluster.count);
        break;
      case 'diameter_asc':
        list.sort((a, b) => a.cluster.diameter - b.cluster.diameter);
        break;
      case 'density_desc':
        list.sort((a, b) => b.cluster.density - a.cluster.density);
        break;
      case 'default':
      default:
        break;
    }

    return list;
  }, [clusters, activeCategory, sortBy]);

  // Filter landmarks
  const filteredLandmarks = useMemo(() => {
    if (!landmarks?.spots) return [];
    let list = [...landmarks.spots];
    if (activeLandmarkCategory !== 'All') {
      list = list.filter((l) => l.category === activeLandmarkCategory);
    }
    return list;
  }, [landmarks, activeLandmarkCategory]);

  const hasNoContent =
    clusters.length === 0 && (!landmarks?.spots || landmarks.spots.length === 0);

  if (hasNoContent) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <EmptyState
          seed={seed}
          totalClusters={summary.total_clusters}
          onTryAnother={onTryAnotherSeed}
        />
      </section>
    );
  }

  const handleSelectCluster = (cluster: Cluster) => {
    setSelectedClusterId(cluster.id);
    const cardEl = document.getElementById(`cluster-card-${cluster.id}`);
    if (cardEl && viewMode !== 'map') {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleSelectLandmark = (landmarkId: number) => {
    setSelectedLandmarkId(landmarkId);
    const cardEl = document.getElementById(`landmark-card-${landmarkId}`);
    if (cardEl && viewMode !== 'map') {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const getLandmarkCategoryLabel = (category: string) => {
    switch (category) {
      case 'cherry_caldera':
        return locale === 'ar' ? 'فوهة كرز جبلية' : 'Cherry Caldera';
      case 'cherry_grove':
        return locale === 'ar' ? 'بستان كرز' : 'Cherry Grove';
      case 'mountain_crater':
        return locale === 'ar' ? 'فوهة جبلية' : 'Mountain Crater';
      case 'epic_clifftop':
        return locale === 'ar' ? 'جرف بانورامي' : 'Epic Clifftop';
      case 'prime_building_basin':
        return locale === 'ar' ? 'حوض بناء مستوٍ' : 'Building Basin';
      case 'isolated_island':
        return locale === 'ar' ? 'جزيرة نجاة' : 'Survival Island';
      case 'pale_garden':
        return locale === 'ar' ? 'حديقة شاحبة' : 'Pale Garden';
      default:
        return category.replace('_', ' ');
    }
  };

  const spX = data.world_spawn?.x ?? 0;
  const spZ = data.world_spawn?.z ?? 0;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in">
      {/* Active Telemetry HUD Strip */}
      <div className="w-full mb-6">
        <div className="bg-[#BDBDBD] dark:bg-[#1C1F26] px-4 py-2.5 border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#363B47] border-b-2 border-r-2 border-[#555555] dark:border-[#101216] shadow-[1px_1px_0_rgba(0,0,0,0.2)] flex flex-wrap items-center justify-between gap-3 font-mc-mono">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#17B85E] shadow-[0_0_6px_#17B85E]"></span>
              <span className="text-[#555555] dark:text-[#94A3B8] uppercase text-[10px]">
                {t.seedLabel}:
              </span>
              <span className="text-[#1E1E1E] dark:text-[#F1F5F9] font-bold" dir="ltr">
                {seed}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#555555] dark:text-[#94A3B8] uppercase text-[10px]">
                {locale === 'ar' ? 'نقطة البداية:' : 'Spawn:'}
              </span>
              <span className="text-[#5B8731] font-bold" dir="ltr">
                X: {spX} | Z: {spZ}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#555555] dark:text-[#94A3B8] uppercase text-[10px]">
                {t.usefulLocations}:
              </span>
              <span className="text-[#866043] dark:text-[#FADB44] font-bold">
                {summary.useful_clusters}
              </span>
              <span className="text-[#4E4E4E] dark:text-[#94A3B8] font-normal">
                ({summary.total_clusters} {locale === 'ar' ? 'إجمالي' : 'Total'})
              </span>
            </div>

            {landmarks?.spot_count ? (
              <button
                type="button"
                onClick={() => setActiveMainTab('landmarks')}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                title={locale === 'ar' ? 'اضغط لعرض أماكن البناء' : 'Click to view building spots'}
              >
                <span className="text-[#555555] dark:text-[#94A3B8] uppercase text-[10px]">
                  {t.tabLandmarks || (locale === 'ar' ? 'أماكن البناء والمناظر الخلابة' : 'Scenic Spots')}:
                </span>
                <span className="text-[#EC4899] font-bold underline decoration-[#EC4899]">
                  {landmarks.spot_count}
                </span>
              </button>
            ) : null}

            <div className="flex items-center gap-1.5">
              <span className="text-[#555555] dark:text-[#94A3B8] uppercase text-[10px]">
                {t.versionLabel}:
              </span>
              <span className="text-[#2CBAA8] font-bold">
                Java {minecraft_version}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={copySeedToClipboard}
              className="flex items-center gap-1 px-2.5 py-1 mc-button hover:bg-[#E0E0E0] dark:hover:bg-[#313745] text-[#222222] dark:text-[#E2E8F0] font-bold cursor-pointer"
            >
              {copiedSeed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#17B85E]" />
                  <span>{t.copySeed} OK</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#5E4325] dark:text-[#FADB44]" />
                  <span>{t.copySeed}</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1 mc-button hover:bg-[#E0E0E0] dark:hover:bg-[#313745] text-[#222222] dark:text-[#E2E8F0] font-bold cursor-pointer"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#17B85E]" />
                  <span>{locale === 'ar' ? 'تم نسخ الرابط' : 'Link Copied'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#5E4325] dark:text-[#FADB44]" />
                  <span>{locale === 'ar' ? 'مشاركة' : 'Share'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowWaypointsModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 mc-button hover:bg-[#E0E0E0] dark:hover:bg-[#313745] text-[#222222] dark:text-[#E2E8F0] font-bold cursor-pointer"
              title={t.exportWaypointsBtn}
            >
              <MapPin className="w-3.5 h-3.5 text-[#5B8731]" />
              <span>{t.exportWaypointsBtn}</span>
            </button>

            <button
              onClick={() => setShowPostcardModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 mc-button hover:bg-[#E0E0E0] dark:hover:bg-[#313745] text-[#222222] dark:text-[#E2E8F0] font-bold cursor-pointer"
              title={t.exportPostcardBtn}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FADB44]" />
              <span>{t.exportPostcardBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Callout Banner for Scenic & Building Spots */}
      {landmarks && landmarks.spot_count > 0 && (
        <div className="mb-5 p-3.5 bg-gradient-to-r from-[#2A4413]/30 via-[#5B8731]/15 to-[#EC4899]/25 border-2 border-[#5B8731] dark:border-[#89BD44] shadow-[2px_2px_0_rgba(0,0,0,0.3)] flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EC4899] border-2 border-[#F472B6] border-b-[#831843] border-r-[#831843] flex items-center justify-center text-white shadow-[1px_1px_0_#000] shrink-0">
              <Sparkles className="w-5 h-5 text-[#FDE047]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mc-heading text-sm sm:text-base text-[#1E1E1E] dark:text-[#F1F5F9] font-bold">
                  {locale === 'ar'
                    ? `✨ تم اكتشاف ${landmarks.spot_count} موقعاً استثنائياً للبناء والمناظر الطبيعية الخلابة!`
                    : `✨ Found ${landmarks.spot_count} exceptional prime building spots & scenic landscapes!`}
                </span>
                <span className="bg-[#EC4899] text-white text-[10px] font-mc-mono px-1.5 py-0.5 font-bold uppercase shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
                  v4.1
                </span>
              </div>
              <p className="text-xs text-[#444444] dark:text-[#CBD5E1] mt-0.5 font-medium">
                {locale === 'ar'
                  ? 'فوهات كرز جبلية، أحواض بناء مستوية، جبال محصنة طبيعياً، وجزر نجاة جاهزة لاستقرارك مع أوامر انتقال /tp مباشرة.'
                  : 'Cherry calderas, flat building basins, fortified mountain crater rings, and survival islands with direct /tp commands.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveMainTab('landmarks')}
              className={`px-3.5 py-1.5 font-mc-heading text-xs uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMainTab === 'landmarks'
                  ? 'bg-[#EC4899] text-white shadow-[1px_1px_0_#831843]'
                  : 'mc-btn-green'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
              <span>
                {activeMainTab === 'landmarks'
                  ? (locale === 'ar' ? 'أنت تستعرضها حالياً' : 'Currently Viewing')
                  : (locale === 'ar' ? 'استعراض أماكن البناء الآن' : 'Explore Building Spots Now')}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4 border-b-2 border-[#8B8B8B] dark:border-[#333842] pb-1 font-mc-heading text-sm">
        <button
          onClick={() => setActiveMainTab('clusters')}
          className={`px-4 py-2 flex items-center gap-2 font-bold transition-all cursor-pointer ${
            activeMainTab === 'clusters'
              ? 'bg-[#5B8731] text-white shadow-[2px_2px_0_#2A4413] -mb-1.5'
              : 'mc-button text-[#333333] dark:text-[#E2E8F0] hover:text-[#111111]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{t.tabUsefulClusters || 'Useful Clusters'}</span>
          <span className="px-1.5 py-0.5 bg-black/30 text-xs font-mono font-bold rounded">
            {clusters.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('landmarks')}
          className={`px-4 py-2 flex items-center gap-2 font-bold transition-all cursor-pointer ${
            activeMainTab === 'landmarks'
              ? 'bg-[#EC4899] text-white shadow-[2px_2px_0_#831843] -mb-1.5'
              : 'mc-button text-[#333333] dark:text-[#E2E8F0] hover:text-[#111111]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FDE047]" />
          <span>{t.tabLandmarks || 'Scenic & Building Spots'}</span>
          <span className="px-1.5 py-0.5 bg-black/30 text-xs font-mono font-bold rounded">
            {landmarks?.spot_count ?? 0}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('all')}
          className={`px-4 py-2 flex items-center gap-2 font-bold transition-all cursor-pointer ${
            activeMainTab === 'all'
              ? 'bg-[#2563EB] text-white shadow-[2px_2px_0_#1E40AF] -mb-1.5'
              : 'mc-button text-[#333333] dark:text-[#E2E8F0] hover:text-[#111111]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{t.tabAllResults || (locale === 'ar' ? 'عرض الكل معاً (عناقيد + بناء)' : 'All Locations')}</span>
          <span className="px-1.5 py-0.5 bg-black/30 text-xs font-mono font-bold rounded">
            {clusters.length + (landmarks?.spot_count ?? 0)}
          </span>
        </button>
      </div>

      {/* Section Header & Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-4 inline-block shadow-[1px_1px_0_#2A4413] ${
              activeMainTab === 'clusters'
                ? 'bg-[#5B8731]'
                : activeMainTab === 'landmarks'
                ? 'bg-[#EC4899]'
                : 'bg-[#2563EB]'
            }`}
          ></span>
          <h2 className="font-mc-heading text-lg sm:text-xl text-[#1E1E1E] dark:text-[#F1F5F9] uppercase font-bold tracking-tight">
            {activeMainTab === 'clusters'
              ? t.discoveredClustersTitle || 'Discovered Structural Clusters'
              : activeMainTab === 'landmarks'
              ? t.landmarksSectionTitle || 'Scenic Landscapes & Prime Building Locations'
              : (locale === 'ar' ? 'كافة المواقع والعناقيد المكتشفة' : 'All Discovered Locations & Clusters')}
          </h2>
          <span className="font-mc-mono text-[11px] text-[#666666] dark:text-[#94A3B8] font-bold ms-2 hidden sm:inline">
            {activeMainTab === 'clusters'
              ? (locale === 'ar' ? '// مرتبة حسب الكثافة والأهمية' : '// SORTED BY VIABILITY & DENSITY')
              : activeMainTab === 'landmarks'
              ? (locale === 'ar' ? '// أفضل الفوهات الجبلية والأحواض المستوية' : '// TOP CURATED SCENIC CALDERAS & BASINS')
              : (locale === 'ar' ? '// استعراض شامل لكافة المعالم والعناقيد' : '// UNIFIED OVERVIEW OF ALL SITES')}
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 self-end md:self-auto font-mc-mono">
          {activeMainTab === 'clusters' && (
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#555555] dark:text-[#94A3B8] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="mc-button px-2 py-1 text-xs text-[#222222] dark:text-[#E2E8F0] font-bold focus:outline-none cursor-pointer"
              >
                <option value="default">{t.sortDefault}</option>
                <option value="spawn_asc">{t.sortSpawnAsc}</option>
                <option value="count_desc">{t.sortCountDesc}</option>
                <option value="diameter_asc">{t.sortDiameterAsc}</option>
                <option value="density_desc">{t.sortDensityDesc}</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-1 bg-[#8B8B8B] dark:bg-[#181A22] p-0.5 border-t border-l border-[#373737] dark:border-[#2E3440] border-b border-r border-[#FFFFFF] dark:border-[#0E1014]">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2 py-1 text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-[#5B8731] text-[#FFFFFF]'
                  : 'text-[#FFFFFF] hover:bg-[#737373]'
              }`}
              title={t.viewSplit}
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2 py-1 text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#5B8731] text-[#FFFFFF]'
                  : 'text-[#FFFFFF] hover:bg-[#737373]'
              }`}
              title={t.viewCards}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-2 py-1 text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#5B8731] text-[#FFFFFF]'
                  : 'text-[#FFFFFF] hover:bg-[#737373]'
              }`}
              title={t.viewMap}
            >
              <MapIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      {activeMainTab === 'clusters' ? (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none font-mc-mono mb-4">
          <span className="text-xs text-[#555555] font-bold px-1 flex items-center gap-1 shrink-0 uppercase">
            <Filter className="w-3 h-3 text-[#5B8731]" />
            {t.filterLabel}:
          </span>
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'All'
                ? 'mc-btn-green'
                : 'mc-button text-[#333333] hover:text-[#111111]'
            }`}
          >
            {t.filterAll} ({clusters.length})
          </button>
          {availableCategories.map((cat) => {
            const count = clusters.filter((c) => c.categories.includes(cat)).length;
            const catTranslated = translateCategory(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'mc-btn-green'
                    : 'mc-button text-[#333333] hover:text-[#111111]'
                }`}
              >
                {catTranslated} ({count})
              </button>
            );
          })}
        </div>
      ) : activeMainTab === 'landmarks' ? (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none font-mc-mono mb-4">
          <span className="text-xs text-[#555555] font-bold px-1 flex items-center gap-1 shrink-0 uppercase">
            <Filter className="w-3 h-3 text-[#EC4899]" />
            {t.filterLabel}:
          </span>
          <button
            onClick={() => setActiveLandmarkCategory('All')}
            className={`px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeLandmarkCategory === 'All'
                ? 'bg-[#EC4899] text-white shadow-[1px_1px_0_#831843]'
                : 'mc-button text-[#333333] hover:text-[#111111]'
            }`}
          >
            {t.filterAllLandmarks || 'All Spots'} ({landmarks?.spot_count ?? 0})
          </button>
          {availableLandmarkCategories.map((cat) => {
            const count = landmarks?.spots.filter((l) => l.category === cat).length ?? 0;
            const catLabel = getLandmarkCategoryLabel(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveLandmarkCategory(cat)}
                className={`px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeLandmarkCategory === cat
                    ? 'bg-[#EC4899] text-white shadow-[1px_1px_0_#831843]'
                    : 'mc-button text-[#333333] hover:text-[#111111]'
                }`}
              >
                {catLabel} ({count})
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Main Content Layout */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (Cards List) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-4 max-h-[850px] overflow-y-auto pe-1">
            <div className="text-xs text-[#555555] font-mc-mono font-bold flex items-center justify-between mb-1">
              <span>
                {activeMainTab === 'clusters'
                  ? t.showingLocationsCount.replace(
                      '{count}',
                      String(filteredAndSortedClusters.length)
                    )
                  : activeMainTab === 'landmarks'
                  ? `${filteredLandmarks.length} ${t.landmarksCountLabel || 'Curated Spots'}`
                  : `${filteredLandmarks.length + filteredAndSortedClusters.length} ${locale === 'ar' ? 'مواقع مكتشفة إجمالاً' : 'Total Locations'}`}
              </span>
              <span className="hidden sm:inline">{t.clickCardToFocus}</span>
            </div>

            {activeMainTab === 'clusters' ? (
              filteredAndSortedClusters.map((cluster) => (
                <div key={cluster.id} id={`cluster-card-${cluster.id}`}>
                  <ClusterCard
                    cluster={cluster}
                    isSelected={selectedClusterId === cluster.id}
                    onSelect={handleSelectCluster}
                    onViewDetails={(c) => setModalCluster(c)}
                  />
                </div>
              ))
            ) : activeMainTab === 'landmarks' ? (
              filteredLandmarks.map((landmark) => (
                <div key={landmark.id} id={`landmark-card-${landmark.id}`}>
                  <LandmarkCard
                    landmark={landmark}
                    isSelected={selectedLandmarkId === landmark.id}
                    onSelect={handleSelectLandmark}
                  />
                </div>
              ))
            ) : (
              <div className="space-y-6">
                {filteredLandmarks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#EC4899]">
                      <Sparkles className="w-4 h-4 text-[#EC4899]" />
                      <h3 className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9] uppercase">
                        {locale === 'ar' ? 'أماكن البناء والمناظر الطبيعية الخلابة' : 'Scenic & Building Spots'} ({filteredLandmarks.length})
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {filteredLandmarks.map((landmark) => (
                        <div key={landmark.id} id={`landmark-card-${landmark.id}`}>
                          <LandmarkCard
                            landmark={landmark}
                            isSelected={selectedLandmarkId === landmark.id}
                            onSelect={handleSelectLandmark}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredAndSortedClusters.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#5B8731]">
                      <Compass className="w-4 h-4 text-[#5B8731]" />
                      <h3 className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9] uppercase">
                        {locale === 'ar' ? 'العناقيد والمراكز الهيكلية' : 'Structural Clusters'} ({filteredAndSortedClusters.length})
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {filteredAndSortedClusters.map((cluster) => (
                        <div key={cluster.id} id={`cluster-card-${cluster.id}`}>
                          <ClusterCard
                            cluster={cluster}
                            isSelected={selectedClusterId === cluster.id}
                            onSelect={handleSelectCluster}
                            onViewDetails={(c) => setModalCluster(c)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Map Column (Sticky on large screens) */}
          <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-20">
            <SeedMap
              seed={seed}
              clusters={filteredAndSortedClusters}
              searchBounds={search}
              worldSpawn={data.world_spawn}
              discovery={discovery}
              landmarks={landmarks}
              selectedClusterId={selectedClusterId}
              onSelectCluster={(id) => {
                setSelectedClusterId(id);
                const el = document.getElementById(`cluster-card-${id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
              selectedLandmarkId={selectedLandmarkId}
              onSelectLandmark={(id) => {
                setSelectedLandmarkId(id);
                if (activeMainTab !== 'all') {
                  setActiveMainTab('landmarks');
                }
                const el = document.getElementById(`landmark-card-${id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
              className="h-[550px] lg:h-[750px]"
            />
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeMainTab === 'clusters' ? (
            filteredAndSortedClusters.map((cluster) => (
              <div key={cluster.id} id={`cluster-card-${cluster.id}`}>
                <ClusterCard
                  cluster={cluster}
                  isSelected={selectedClusterId === cluster.id}
                  onSelect={handleSelectCluster}
                  onViewDetails={(c) => setModalCluster(c)}
                />
              </div>
            ))
          ) : activeMainTab === 'landmarks' ? (
            filteredLandmarks.map((landmark) => (
              <div key={landmark.id} id={`landmark-card-${landmark.id}`}>
                <LandmarkCard
                  landmark={landmark}
                  isSelected={selectedLandmarkId === landmark.id}
                  onSelect={handleSelectLandmark}
                />
              </div>
            ))
          ) : (
            <>
              {filteredLandmarks.length > 0 && (
                <>
                  <div className="col-span-full flex items-center gap-2 pt-2 pb-1 border-b-2 border-[#EC4899]">
                    <Sparkles className="w-4 h-4 text-[#EC4899]" />
                    <h3 className="font-mc-heading text-base font-bold text-[#1E1E1E] dark:text-[#F1F5F9] uppercase">
                      {locale === 'ar' ? 'أماكن البناء والمناظر الطبيعية الخلابة' : 'Scenic & Building Spots'} ({filteredLandmarks.length})
                    </h3>
                  </div>
                  {filteredLandmarks.map((landmark) => (
                    <div key={landmark.id} id={`landmark-card-${landmark.id}`}>
                      <LandmarkCard
                        landmark={landmark}
                        isSelected={selectedLandmarkId === landmark.id}
                        onSelect={handleSelectLandmark}
                      />
                    </div>
                  ))}
                </>
              )}

              {filteredAndSortedClusters.length > 0 && (
                <>
                  <div className="col-span-full flex items-center gap-2 pt-4 pb-1 border-b-2 border-[#5B8731]">
                    <Compass className="w-4 h-4 text-[#5B8731]" />
                    <h3 className="font-mc-heading text-base font-bold text-[#1E1E1E] dark:text-[#F1F5F9] uppercase">
                      {locale === 'ar' ? 'العناقيد والمراكز الهيكلية' : 'Structural Clusters'} ({filteredAndSortedClusters.length})
                    </h3>
                  </div>
                  {filteredAndSortedClusters.map((cluster) => (
                    <div key={cluster.id} id={`cluster-card-${cluster.id}`}>
                      <ClusterCard
                        cluster={cluster}
                        isSelected={selectedClusterId === cluster.id}
                        onSelect={handleSelectCluster}
                        onViewDetails={(c) => setModalCluster(c)}
                      />
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div>
          <SeedMap
            seed={seed}
            clusters={filteredAndSortedClusters}
            searchBounds={search}
            worldSpawn={data.world_spawn}
            discovery={discovery}
            landmarks={landmarks}
            selectedClusterId={selectedClusterId}
            onSelectCluster={(id) => setSelectedClusterId(id)}
            selectedLandmarkId={selectedLandmarkId}
            onSelectLandmark={(id) => {
              setSelectedLandmarkId(id);
              if (activeMainTab !== 'all') {
                setActiveMainTab('landmarks');
              }
            }}
            className="h-[750px]"
          />
        </div>
      )}

      {/* Structure Details Modal */}
      <ClusterDetailsModal
        cluster={modalCluster}
        onClose={() => setModalCluster(null)}
        onLocateOnMap={(cluster) => {
          setSelectedClusterId(cluster.id);
          if (viewMode === 'cards') setViewMode('split');
        }}
      />

      {/* Phase 4: Waypoints Exporter Modal */}
      <WaypointsModal
        isOpen={showWaypointsModal}
        onClose={() => setShowWaypointsModal(false)}
        data={data}
      />

      {/* Phase 4: Postcard & Social Share Modal */}
      <PostcardModal
        isOpen={showPostcardModal}
        onClose={() => setShowPostcardModal(false)}
        data={data}
      />
    </section>
  );
}
