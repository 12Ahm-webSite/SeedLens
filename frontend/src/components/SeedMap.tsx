'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { Cluster, SearchBounds } from '@/types/seedlens';
import { Compass } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SeedMapProps {
  seed?: string | number;
  clusters: Cluster[];
  searchBounds?: SearchBounds;
  selectedClusterId?: number | null;
  onSelectCluster?: (clusterId: number) => void;
  className?: string;
}

const SeedMapInner = dynamic(() => import('@/components/SeedMapInner'), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
});

function MapLoadingPlaceholder() {
  const { t } = useLanguage();
  return (
    <div className="w-full h-[520px] mc-wood-frame p-2 flex flex-col items-center justify-center text-[#222222]">
      <div className="mc-gui-panel p-6 flex flex-col items-center justify-center">
        <div className="w-10 h-10 bg-[#5B8731] border-2 border-[#89BD44] border-b-[#2A4413] border-r-[#2A4413] flex items-center justify-center shadow-[1px_1px_0_#000] mb-3">
          <Compass className="w-6 h-6 text-[#FFFFFF] animate-spin" />
        </div>
        <span className="font-mc-heading text-sm font-bold text-[#1E1E1E] uppercase">
          {t.mapLoading}
        </span>
        <span className="text-xs text-[#555555] font-mc-mono mt-1 font-bold">
          {t.mapProjecting}
        </span>
      </div>
    </div>
  );
}

export default function SeedMap(props: SeedMapProps) {
  return <SeedMapInner {...props} />;
}
