'use client';

import React, { useState } from 'react';
import type { AnomaliesSummary, WorldgenAnomaly } from '@/types/seedlens';
import { useLanguage } from '@/context/LanguageContext';
import { Zap, Copy, Check, MapPin, Compass } from 'lucide-react';

interface AnomalyBannerProps {
  anomalies?: AnomaliesSummary;
  onFocusCoordinates?: (x: number, z: number) => void;
}

function formatAxis(axis: string, isAr: boolean) {
  if (axis === 'x_axis') return isAr ? 'محور الشرق والغرب (المحور X)' : 'East-West Axis (X-Axis)';
  if (axis === 'z_axis') return isAr ? 'محور الشمال والجنوب (المحور Z)' : 'North-South Axis (Z-Axis)';
  if (axis === 'dimension_end') return isAr ? 'بُعد الإند (The End)' : 'The End Dimension';
  return axis;
}

function formatTag(tag: string, isAr: boolean) {
  const map: Record<string, { ar: string; en: string }> = {
    infinite_mineshaft: { ar: 'مناجم_لانهائية', en: 'Infinite Mineshaft' },
    axis_glitch: { ar: 'قلتش_محوري', en: 'Axis Glitch' },
    legendary_glitch: { ar: 'قلتش_أسطوري', en: 'Legendary Glitch' },
    unlimited_loot: { ar: 'موارد_بلا_نهاية', en: 'Unlimited Loot' },
    void_end: { ar: 'إند_فارغ', en: 'Void End' },
    empty_island: { ar: 'جزيرة_فارغة', en: 'Empty Island' },
    floating_dragon: { ar: 'تنين_في_الفويد', en: 'Floating Dragon' },
    mc_267423: { ar: 'MC-267423', en: 'MC-267423' },
    repeating_terrain: { ar: 'تضاريس_مستنسخة', en: 'Repeating Terrain' },
    chunk_loop: { ar: 'عالم_متكرر', en: 'Chunk Loop' },
    anomaly: { ar: 'ظاهرة_خارقة', en: 'Anomaly' },
    monolith_glitch: { ar: 'مرايا_التوليد', en: 'Monolith Glitch' },
  };
  if (map[tag]) {
    return isAr ? map[tag].ar : map[tag].en;
  }
  return tag.replace(/_/g, ' ');
}

export default function AnomalyBanner({
  anomalies,
  onFocusCoordinates,
}: AnomalyBannerProps) {
  const { locale, t } = useLanguage();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!anomalies || anomalies.anomaly_count === 0) {
    return null;
  }

  const isAr = locale === 'ar';

  const handleCopy = (id: number, cmd: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="mb-6 space-y-3">
      {anomalies.items.map((an: WorldgenAnomaly) => {
        const title = isAr ? an.name_ar : an.name_en;
        const desc = isAr ? an.description_ar : an.description_en;
        const isCopied = copiedId === an.id;

        return (
          <div
            key={an.id}
            className="relative overflow-hidden bg-gradient-to-r from-[#1E112A] via-[#161224] to-[#0E1726] border-2 border-[#9333EA] shadow-[0_0_20px_rgba(147,51,234,0.35)] p-4 sm:p-5 text-white"
          >
            {/* Top accent glow line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EC4899] via-[#A855F7] to-[#06B6D4] animate-pulse"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                {/* Badges Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#9333EA] text-[#F3E8FF] font-mc-heading text-xs font-bold uppercase tracking-wider shadow-[1px_1px_0_#581C87]">
                    <Zap className="w-3.5 h-3.5 text-[#FDE047] fill-current animate-bounce" />
                    <span>{t.anomalyBannerTitle}</span>
                  </span>

                  <span className="inline-flex items-center px-2 py-0.5 bg-[#06B6D4]/20 border border-[#06B6D4] text-[#67E8F9] font-mc-mono text-[11px] font-bold">
                    {an.severity === 'legendary'
                      ? t.anomalyBadgeLegendary
                      : an.severity === 'extreme'
                      ? t.anomalyBadgeExtreme
                      : t.anomalyBadgeRare}
                  </span>

                  <span className="font-mc-mono text-[11px] text-[#A855F7] font-bold">
                    // {t.anomalyConfidenceLabel}: {an.confidence_score}%
                  </span>
                </div>

                {/* Anomaly Title */}
                <h3 className="font-mc-heading text-lg sm:text-xl font-bold text-[#F3E8FF] tracking-tight">
                  {title}
                </h3>

                {/* Description */}
                <p className="font-mc-body text-xs sm:text-sm text-[#D8B4FE] leading-relaxed">
                  {desc}
                </p>

                {/* Tags and Location */}
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mc-mono text-xs text-[#CBD5E1]">
                  <span className="flex items-center gap-1 text-[#FDE047] font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    X: {an.x} | Y: {an.y} | Z: {an.z}
                  </span>
                  <span>•</span>
                  <span>{t.anomalyAxisLabel}: <strong className="text-[#67E8F9] bg-black/40 px-2 py-0.5">{formatAxis(an.axis, isAr)}</strong></span>

                  {an.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-black/40 text-[#D8B4FE] px-2 py-0.5 text-[11px] font-bold border border-[#A855F7]/40 shadow-[1px_1px_0_rgba(0,0,0,0.3)]"
                    >
                      #{formatTag(tag, isAr)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                {onFocusCoordinates && (
                  <button
                    type="button"
                    onClick={() => onFocusCoordinates(an.x, an.z)}
                    className="mc-button px-3 py-2 flex items-center gap-1.5 font-mc-mono text-xs font-bold text-[#67E8F9] hover:text-white cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[#06B6D4]" />
                    <span>{isAr ? 'تركيز على الخريطة' : 'Locate on Map'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => handleCopy(an.id, an.teleport_command, e)}
                  className="px-3.5 py-2 bg-[#9333EA] hover:bg-[#A855F7] text-white font-mc-mono text-xs font-bold shadow-[2px_2px_0_#581C87] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-[#4ADE80]" />
                      <span>{isAr ? 'تم نسخ الأمر!' : 'Copied /tp!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#FDE047]" />
                      <span>{an.teleport_command}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

