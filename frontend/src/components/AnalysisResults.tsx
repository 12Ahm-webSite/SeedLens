'use client';

import React, { useState, useMemo } from 'react';
import type { AnalyzeSuccessResponse, Cluster } from '@/types/seedlens';
import ClusterCard from '@/components/ClusterCard';
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
} from 'lucide-react';

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
  const { t, translateCategory } = useLanguage();
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [modalCluster, setModalCluster] = useState<Cluster | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const { seed, minecraft_version, summary, clusters, search } = data;

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

  // Discover all distinct categories in the dataset
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    clusters.forEach((c) => {
      c.categories.forEach((cat) => cats.add(cat));
    });
    return Array.from(cats);
  }, [clusters]);

  // Filter & Sort clusters
  const filteredAndSortedClusters = useMemo(() => {
    let list = [...clusters];

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter((c) => c.categories.includes(activeCategory));
    }

    // Sort
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

  // If 0 useful clusters found, show the clean empty state
  if (summary.useful_clusters === 0 || clusters.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in">
      {/* Active Telemetry HUD Strip */}
      <div className="w-full mb-6">
        <div className="bg-[#BDBDBD] px-4 py-2.5 border-t-2 border-l-2 border-[#FFFFFF] border-b-2 border-r-2 border-[#555555] shadow-[1px_1px_0_rgba(0,0,0,0.2)] flex flex-wrap items-center justify-between gap-3 font-mc-mono">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#17B85E] shadow-[0_0_6px_#17B85E]"></span>
              <span className="text-[#555555] uppercase text-[10px]">
                {t.seedLabel}:
              </span>
              <span className="text-[#1E1E1E] font-bold" dir="ltr">
                {seed}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#555555] uppercase text-[10px]">
                Spawn:
              </span>
              <span className="text-[#5B8731] font-bold">
                X: 0 | Z: 0 (Y: 64)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#555555] uppercase text-[10px]">
                {t.usefulLocations}:
              </span>
              <span className="text-[#866043] font-bold">
                {summary.useful_clusters}
              </span>
              <span className="text-[#4E4E4E] font-normal">
                ({summary.total_clusters} Total)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#555555] uppercase text-[10px]">
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
              className="flex items-center gap-1 px-2.5 py-1 mc-button hover:bg-[#E0E0E0] text-[#222222] font-bold cursor-pointer"
            >
              {copiedSeed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#17B85E]" />
                  <span>{t.copySeed} OK</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#5E4325]" />
                  <span>{t.copySeed}</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1 mc-button hover:bg-[#E0E0E0] text-[#222222] font-bold cursor-pointer"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#17B85E]" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#5E4325]" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Discovered Structural Clusters Section Header & Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-4 bg-[#5B8731] inline-block shadow-[1px_1px_0_#2A4413]"></span>
          <h2 className="font-mc-heading text-lg sm:text-xl text-[#1E1E1E] uppercase font-bold tracking-tight">
            {t.discoveredClustersTitle || 'Discovered Structural Clusters'}
          </h2>
          <span className="font-mc-mono text-[11px] text-[#666666] font-bold ms-2 hidden sm:inline">
            {`// SORTED BY VIABILITY & DENSITY`}
          </span>
        </div>

        {/* Right side controls: Sorting & View Mode */}
        <div className="flex items-center gap-2 self-end md:self-auto font-mc-mono">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#555555] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="mc-button px-2 py-1 text-xs text-[#222222] font-bold focus:outline-none cursor-pointer"
            >
              <option value="default">{t.sortDefault}</option>
              <option value="spawn_asc">{t.sortSpawnAsc}</option>
              <option value="count_desc">{t.sortCountDesc}</option>
              <option value="diameter_asc">{t.sortDiameterAsc}</option>
              <option value="density_desc">{t.sortDensityDesc}</option>
            </select>
          </div>

          {/* View mode switcher */}
          <div className="flex items-center gap-1 bg-[#8B8B8B] p-0.5 border-t border-l border-[#373737] border-b border-r border-[#FFFFFF]">
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

      {/* Main Content Layout */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Cards Column */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-4 max-h-[850px] overflow-y-auto pe-1">
            <div className="text-xs text-[#555555] font-mc-mono font-bold flex items-center justify-between mb-1">
              <span>
                {t.showingLocationsCount.replace(
                  '{count}',
                  String(filteredAndSortedClusters.length)
                )}
              </span>
              <span className="hidden sm:inline">{t.clickCardToFocus}</span>
            </div>
            {filteredAndSortedClusters.map((cluster) => (
              <ClusterCard
                key={cluster.id}
                cluster={cluster}
                isSelected={selectedClusterId === cluster.id}
                onSelect={handleSelectCluster}
                onViewDetails={(c) => setModalCluster(c)}
              />
            ))}
          </div>

          {/* Map Column (Sticky on large screens) */}
          <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-20">
            <SeedMap
              seed={seed}
              clusters={filteredAndSortedClusters}
              searchBounds={search}
              selectedClusterId={selectedClusterId}
              onSelectCluster={(id) => {
                setSelectedClusterId(id);
                const el = document.getElementById(`cluster-card-${id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
              className="h-[550px] lg:h-[750px]"
            />
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedClusters.map((cluster) => (
            <ClusterCard
              key={cluster.id}
              cluster={cluster}
              isSelected={selectedClusterId === cluster.id}
              onSelect={handleSelectCluster}
              onViewDetails={(c) => setModalCluster(c)}
            />
          ))}
        </div>
      ) : (
        <div>
          <SeedMap
            seed={seed}
            clusters={filteredAndSortedClusters}
            searchBounds={search}
            selectedClusterId={selectedClusterId}
            onSelectCluster={(id) => setSelectedClusterId(id)}
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
    </section>
  );
}
