'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  MapPin,
  Compass,
  Layers,
  ArrowUpRight,
  Terminal,
} from 'lucide-react';
import type { Cluster } from '@/types/seedlens';
import CategoryBadge from '@/components/CategoryBadge';
import StructureBadge from '@/components/StructureBadge';
import { useLanguage } from '@/context/LanguageContext';

interface ClusterDetailsModalProps {
  cluster: Cluster | null;
  onClose: () => void;
  onLocateOnMap?: (cluster: Cluster) => void;
}

export default function ClusterDetailsModal({
  cluster,
  onClose,
  onLocateOnMap,
}: ClusterDetailsModalProps) {
  const { t, locale, translateCategory } = useLanguage();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!cluster) return null;

  const copyCoords = (x: number, z: number, idx: number) => {
    navigator.clipboard.writeText(`/tp @s ${x} ~ ${z}`);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const primaryCatName = translateCategory(cluster.primary_category);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col mc-gui-panel shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-4 border-b border-[#A8A8A8] dark:border-[#2E3342] bg-[#BDBDBD] dark:bg-[#1A1D24]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 bg-[#866043] text-[#FADB44] font-mc-mono text-[10px] font-bold border border-[#4E3523]">
                {locale === 'ar' ? `المجموعة #${cluster.id < 10 ? `0${cluster.id}` : cluster.id}` : `CLUSTER #${cluster.id < 10 ? `0${cluster.id}` : cluster.id}`}
              </span>
              <CategoryBadge category={cluster.primary_category} isPrimary size="sm" />
            </div>
            <h3 className="font-mc-heading text-lg font-bold text-[#1E1E1E] dark:text-[#F1F5F9] uppercase">
              {primaryCatName} — {t.clusterDetailsTitle}
            </h3>
            <p className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8] font-bold mt-0.5" dir="ltr">
              {locale === 'ar' ? 'الإحداثيات:' : 'Anchor:'} X: {cluster.center.x.toFixed(0)}, Z: {cluster.center.z.toFixed(0)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="mc-button p-1.5 text-[#222222] dark:text-[#E2E8F0] hover:text-[#E03B24] cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Engine Explanation */}
          <div className="bg-[#DFDFDF] dark:bg-[#161820] p-3 text-[#222222] dark:text-[#CBD5E1] border-t border-l border-[#FFFFFF] dark:border-[#2D3340] border-b border-r border-[#999999] dark:border-[#0E1014]">
            <h4 className="font-mc-mono text-xs font-bold uppercase tracking-wider text-[#5B8731] mb-1 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>{t.engineAnalysis}</span>
            </h4>
            <p className="text-xs text-[#333333] dark:text-[#E2E8F0] leading-relaxed">
              &ldquo;{getLocalizedExplanation(cluster)}&rdquo;
            </p>
          </div>

          {/* Quick Metrics in Minecraft Inset Slot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mc-slot p-2.5 text-[#FFFFFF] font-mc-mono text-center">
            <div>
              <span className="text-[10px] text-[#D8D8D8] uppercase tracking-wider block font-bold">
                {t.totalStructuresModal}
              </span>
              <span className="text-base font-bold text-[#FADB44]">
                {cluster.cluster.count}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#D8D8D8] uppercase tracking-wider block font-bold">
                {t.diameterLabel}
              </span>
              <span className="text-base font-bold text-[#FFFFFF]">
                {cluster.cluster.diameter.toFixed(0)}m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#D8D8D8] uppercase tracking-wider block font-bold">
                {t.nearestPairLabel}
              </span>
              <span className="text-base font-bold text-[#4DEDF4]">
                {cluster.cluster.closest_pair.toFixed(0)}m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#D8D8D8] uppercase tracking-wider block font-bold">
                {t.fromSpawnLabel}
              </span>
              <span className="text-base font-bold text-[#17B85E]">
                {cluster.cluster.nearest_spawn.toFixed(0)}m
              </span>
            </div>
          </div>

          {/* Structures List (POI Node Telemetry) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9] flex items-center gap-1.5 uppercase">
                <Layers className="w-4 h-4 text-[#5B8731]" />
                <span>
                  {t.structuresInCluster.replace(
                    '{count}',
                    String(cluster.structures.length)
                  )}
                </span>
              </h4>
              <span className="font-mc-mono text-[11px] text-[#666666] dark:text-[#94A3B8] font-bold">
                {t.clickToCopyTp}
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pe-1">
              {cluster.structures.map((s, idx) => (
                <div
                  key={`${s.type}-${s.x}-${s.z}-${idx}`}
                  className="flex items-center justify-between p-2 mc-slot text-[#FFFFFF] font-mc-mono text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <StructureBadge type={s.type} size="sm" />
                    <span className="text-xs text-[#4DEDF4] font-bold" dir="ltr">
                      [X: {s.x}, Z: {s.z}]
                    </span>
                    <span className="text-[#A8A8A8] text-[10px] hidden sm:inline">
                      ({s.distance_to_spawn.toFixed(0)}{locale === 'ar' ? 'م عن البداية' : 'm from spawn'})
                    </span>
                  </div>

                  <button
                    onClick={() => copyCoords(s.x, s.z, idx)}
                    className="mc-button px-2 py-0.5 text-[#1E1E1E] dark:text-[#E2E8F0] font-bold flex items-center gap-1 cursor-pointer"
                    title={t.tpCommand}
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#17B85E]" />
                        <span className="text-[10px] text-[#17B85E]">OK</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="w-3.5 h-3.5 text-[#5E4325] dark:text-[#FADB44]" />
                        <span className="text-[10px]">/tp</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-3.5 border-t border-[#A8A8A8] dark:border-[#2E3342] bg-[#BDBDBD] dark:bg-[#1A1D24]">
          <button
            onClick={onClose}
            className="mc-button px-4 py-1.5 text-xs text-[#1E1E1E] dark:text-[#E2E8F0] font-bold cursor-pointer"
          >
            {t.close}
          </button>

          {onLocateOnMap && (
            <button
              onClick={() => {
                onLocateOnMap(cluster);
                onClose();
              }}
              className="mc-btn-green px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.locateOnMap}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
