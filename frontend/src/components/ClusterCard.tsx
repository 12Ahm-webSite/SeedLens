'use client';

import React, { useState } from 'react';
import {
  MapPin,
  ChevronRight,
  ChevronLeft,
  Check,
  Terminal,
} from 'lucide-react';
import type { Cluster } from '@/types/seedlens';
import CategoryBadge from '@/components/CategoryBadge';
import StructureBadge from '@/components/StructureBadge';
import { useLanguage } from '@/context/LanguageContext';

interface ClusterCardProps {
  cluster: Cluster;
  isSelected?: boolean;
  onSelect?: (cluster: Cluster) => void;
  onViewDetails?: (cluster: Cluster) => void;
}

export default function ClusterCard({
  cluster,
  isSelected = false,
  onSelect,
  onViewDetails,
}: ClusterCardProps) {
  const { t, dir, locale, translateCategory } = useLanguage();
  const [copiedTp, setCopiedTp] = useState(false);
  const ChevronIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const primaryCatName = translateCategory(cluster.primary_category);

  const tpCommand = `/tp ${Math.round(cluster.center.x)} ~ ${Math.round(cluster.center.z)}`;

  const copyTpCommand = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tpCommand);
    setCopiedTp(true);
    setTimeout(() => setCopiedTp(false), 1500);
  };

  const getLocalizedExplanation = (cl: Cluster): string => {
    if (locale !== 'ar') {
      return cl.explanation;
    }
    const primary = cl.primary_category;
    if (primary === 'Strategic Mega-Hub') {
      return `يضم هذا التجمع ${cl.cluster.count} هياكل استراتيجية عبر ${cl.cluster.type_count} أنواع مختلفة، مع أقرب زوج بمسافة ${cl.cluster.closest_pair.toFixed(0)} بلوكاً وقطر إجمالي ${cl.cluster.diameter.toFixed(0)} بلوكاً؛ مما يجعله مركزاً مثالياً لسرعة التقدم في اللعبة.`;
    }
    if (primary === 'Trading Metropolis') {
      return `يحتوي هذا العنقود على قرى متعددة بانتشار أقصى ${cl.cluster.diameter.toFixed(0)} بلوكاً، مما يجعله مثالياً لتأسيس عاصمة تجارية ضخمة ومزارع حديد ومقايضة القرويين.`;
    }
    if (primary === 'Abyssal Hub') {
      return `يربط هذا العنقود بين معالم السطح ومدينة قديمة (Ancient City) في الأعماق السحيقة على بعد أقل من 450 بلوكاً، مما يوفر وصولاً سريعاً ومباشراً لأثمن غنائم ماينكرافت السفلية.`;
    }
    if (primary === 'Spawn Outpost') {
      return `يقع هذا التجمع بالقرب من نقطة الـ Spawn على مسافة ${cl.cluster.nearest_spawn.toFixed(0)} بلوكاً وبقطر ${cl.cluster.diameter.toFixed(0)} بلوكاً؛ مما يجعله بؤرة انطلاق استراتيجية مثالية للبدء الفوري دون عناء السفر.`;
    }
    if (primary === 'Dense Multi') {
      return `تجمع فائق الكثافة يضم ${cl.cluster.count} هياكل تفصل بين أقربها مسافة ${cl.cluster.closest_pair.toFixed(0)} بلوكاً فقط وبقطر ${cl.cluster.diameter.toFixed(0)} بلوكاً، موفراً عدة نقاط اهتمام متلاصقة في مساحة سير ضيقة جداً.`;
    }
    return `عنقود هيكلي متكامل يضم ${cl.cluster.count} هياكل بنطاق جغرافي قدره ${cl.cluster.diameter.toFixed(0)} بلوكاً.`;
  };

  return (
    <div
      id={`cluster-card-${cluster.id}`}
      onClick={() => onSelect && onSelect(cluster)}
      className={`relative p-4 flex flex-col justify-between group cursor-pointer transition-all ${
        isSelected
          ? 'bg-[#C6C6C6] dark:bg-[#282C37] border-2 border-[#5B8731] shadow-[inset_2px_2px_0_#FFFFFF,inset_-2px_-2px_0_#2A4413,2px_2px_0_rgba(0,0,0,0.3)] dark:shadow-[inset_2px_2px_0_#3A404F,inset_-2px_-2px_0_#14161C,2px_2px_0_rgba(0,0,0,0.6)]'
          : 'mc-gui-panel hover:bg-[#D0D0D0] dark:hover:bg-[#262A34]'
      }`}
    >
      {/* Active Selection Badge */}
      {isSelected && (
        <div className="absolute -top-2.5 end-3 bg-[#5B8731] text-[#FFFFFF] font-mc-mono text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold border-t border-l border-[#89BD44] border-b border-r border-[#2A4413] shadow-[1px_1px_0_#000]">
          {locale === 'ar' ? 'الموقع المحدد' : 'Active Selection'}
        </div>
      )}

      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 bg-[#866043] text-[#FADB44] font-mc-mono text-[10px] font-bold border border-[#4E3523] shadow-[1px_1px_0_rgba(0,0,0,0.3)]">
              {locale === 'ar' ? `المجموعة #${cluster.id < 10 ? `0${cluster.id}` : cluster.id}` : `CLUSTER #${cluster.id < 10 ? `0${cluster.id}` : cluster.id}`}
            </span>
            <CategoryBadge category={cluster.primary_category} isPrimary size="sm" />
            {cluster.categories
              .filter((c) => c !== cluster.primary_category)
              .map((c) => (
                <CategoryBadge key={c} category={c} size="sm" />
              ))}
          </div>

          <div
            className="flex items-center gap-1 font-mc-mono text-[11px] font-bold text-[#1E1E1E] dark:text-[#E2E8F0] bg-[#E2E2E2] dark:bg-[#181B22] px-2 py-0.5 border-t border-l border-[#FFFFFF] dark:border-[#333844] border-b border-r border-[#737373] dark:border-[#0E1015]"
            dir="ltr"
          >
            <MapPin className="w-3 h-3 text-[#5B8731] shrink-0" />
            <span>
              {cluster.center.x.toFixed(0)}, {cluster.center.z.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Title & Structure List */}
        <div className="mb-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="font-mc-heading text-base text-[#1E1E1E] dark:text-[#F1F5F9] uppercase font-bold tracking-tight">
              {primaryCatName}
            </h3>
            <span className="text-xs text-[#555555] dark:text-[#94A3B8] font-mc-mono font-bold">
              {locale === 'ar'
                ? `(${cluster.cluster.count} معالم · ${cluster.cluster.type_count} أنواع)`
                : `(${cluster.cluster.count} POIs · ${cluster.cluster.type_count} Types)`}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {cluster.structures_summary.map((sum) => (
              <StructureBadge
                key={sum.type}
                type={sum.type}
                count={sum.count}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Tactile Inset Metrics Grid (mc-slot) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2.5 mc-slot p-2.5 text-[#FFFFFF] font-mc-mono">
          <div>
            <span className="text-[10px] text-[#D8D8D8] block font-bold uppercase">
              {t.diameterLabel}
            </span>
            <span className="text-xs text-[#FFFFFF] font-bold">
              {cluster.cluster.diameter.toFixed(0)}m
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#D8D8D8] block font-bold uppercase">
              {t.nearestPairLabel}
            </span>
            <span className="text-xs text-[#4DEDF4] font-bold">
              {cluster.cluster.closest_pair.toFixed(0)}m
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#D8D8D8] block font-bold uppercase">
              {t.fromSpawnLabel}
            </span>
            <span className="text-xs text-[#17B85E] font-bold">
              {cluster.cluster.nearest_spawn.toFixed(0)}m
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#D8D8D8] block font-bold uppercase">
              {t.densityLabel || (locale === 'ar' ? 'الكثافة' : 'Density')}
            </span>
            <span className="text-xs text-[#FADB44] font-bold">
              {cluster.cluster.density.toFixed(6)}
            </span>
          </div>
        </div>

        {/* Engine Natural Language Explanation */}
        <div className="bg-[#DFDFDF] dark:bg-[#161820] p-2.5 text-[#222222] dark:text-[#CBD5E1] font-medium text-xs border-t border-l border-[#FFFFFF] dark:border-[#2D3340] border-b border-r border-[#999999] dark:border-[#0E1014] leading-relaxed mb-3">
          &ldquo;{getLocalizedExplanation(cluster)}&rdquo;
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-2 border-t border-[#A8A8A8] dark:border-[#2E3342] flex items-center justify-between gap-2">
        {/* Copy /tp Command */}
        <button
          type="button"
          onClick={copyTpCommand}
          className="mc-button px-2.5 py-1 text-xs text-[#222222] dark:text-[#E2E8F0] font-bold flex items-center gap-1 hover:text-[#5B8731] cursor-pointer"
          title={locale === 'ar' ? 'نسخ أمر الانتقال /tp' : 'Copy Teleport Command'}
        >
          {copiedTp ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#17B85E]" />
              <span className="font-mc-mono">{locale === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
            </>
          ) : (
            <>
              <Terminal className="w-3.5 h-3.5 text-[#5E4325]" />
              <span className="font-mc-mono">{tpCommand}</span>
            </>
          )}
        </button>

        {/* Inspect / View Details Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onViewDetails) onViewDetails(cluster);
          }}
          className="mc-btn-green px-3 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>{t.viewStructures}</span>
          <ChevronIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
