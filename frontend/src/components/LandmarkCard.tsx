'use client';

import React, { useState } from 'react';
import type { LandmarkSpot } from '@/types/seedlens';
import { useLanguage } from '@/context/LanguageContext';
import {
  Mountain,
  Trees,
  Camera,
  Castle,
  Compass,
  Copy,
  Check,
  MapPin,
  Sparkles,
  Waves,
} from 'lucide-react';

interface LandmarkCardProps {
  landmark: LandmarkSpot;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

export default function LandmarkCard({
  landmark,
  isSelected = false,
  onSelect,
}: LandmarkCardProps) {
  const { locale, t } = useLanguage();
  const [copiedTp, setCopiedTp] = useState(false);

  const isAr = locale === 'ar';
  const name = isAr ? landmark.name_ar : landmark.name_en;
  const description = isAr ? landmark.description_ar : landmark.description_en;

  const handleCopyTp = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(landmark.teleport_command);
    setCopiedTp(true);
    setTimeout(() => setCopiedTp(false), 2000);
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'cherry_caldera':
      case 'cherry_grove':
        return {
          icon: <Trees className="w-4 h-4 text-[#F472B6]" />,
          border: 'border-[#F472B6]',
          badgeBg: 'bg-[#FDF2F8] dark:bg-[#500724]',
          badgeText: 'text-[#BE185D] dark:text-[#F472B6]',
          badgeBorder: 'border-[#FBCFE8] dark:border-[#831843]',
          accent: '#EC4899',
        };
      case 'mountain_crater':
        return {
          icon: <Mountain className="w-4 h-4 text-[#34D399]" />,
          border: 'border-[#10B981]',
          badgeBg: 'bg-[#ECFDF5] dark:bg-[#064E3B]',
          badgeText: 'text-[#047857] dark:text-[#34D399]',
          badgeBorder: 'border-[#A7F3D0] dark:border-[#065F46]',
          accent: '#10B981',
        };
      case 'epic_clifftop':
        return {
          icon: <Camera className="w-4 h-4 text-[#C084FC]" />,
          border: 'border-[#A855F7]',
          badgeBg: 'bg-[#FAF5FF] dark:bg-[#3B0764]',
          badgeText: 'text-[#7E22CE] dark:text-[#C084FC]',
          badgeBorder: 'border-[#E9D5FF] dark:border-[#581C87]',
          accent: '#A855F7',
        };
      case 'prime_building_basin':
        return {
          icon: <Castle className="w-4 h-4 text-[#FBBF24]" />,
          border: 'border-[#F59E0B]',
          badgeBg: 'bg-[#FFFBEB] dark:bg-[#451A03]',
          badgeText: 'text-[#B45309] dark:text-[#FBBF24]',
          badgeBorder: 'border-[#FDE68A] dark:border-[#78350F]',
          accent: '#F59E0B',
        };
      case 'isolated_island':
        return {
          icon: <Waves className="w-4 h-4 text-[#38BDF8]" />,
          border: 'border-[#0284C7]',
          badgeBg: 'bg-[#F0F9FF] dark:bg-[#082F49]',
          badgeText: 'text-[#0369A1] dark:text-[#38BDF8]',
          badgeBorder: 'border-[#BAE6FD] dark:border-[#075985]',
          accent: '#0284C7',
        };
      case 'pale_garden':
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-[#94A3B8]" />,
          border: 'border-[#64748B]',
          badgeBg: 'bg-[#F8FAFC] dark:bg-[#1E293B]',
          badgeText: 'text-[#475569] dark:text-[#94A3B8]',
          badgeBorder: 'border-[#E2E8F0] dark:border-[#334155]',
          accent: '#64748B',
        };
    }
  };

  const theme = getCategoryTheme(landmark.category);

  return (
    <div
      onClick={() => onSelect && onSelect(landmark.id)}
      className={`relative mc-gui-panel p-4 transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'ring-2 ring-[#5B8731] shadow-[2px_2px_0_#2A4413] bg-[#EAEAEA] dark:bg-[#252830]'
          : 'hover:bg-[#E2E2E2] dark:hover:bg-[#22252C]'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#BDBDBD] dark:bg-[#15171C] border border-[#7B7B7B] dark:border-[#333842] flex items-center justify-center shrink-0 shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
            {theme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9] leading-tight">
                {name}
              </span>
              <span className="font-mc-mono text-[10px] text-[#777777] dark:text-[#94A3B8] font-bold">
                #{landmark.id}
              </span>
            </div>
            <div className="font-mc-mono text-[11px] text-[#555555] dark:text-[#94A3B8] flex items-center gap-2 mt-0.5">
              <span className="text-[#5B8731] font-bold">
                X: {landmark.x} | Y: {landmark.y} | Z: {landmark.z}
              </span>
              <span>•</span>
              <span>
                {Math.round(landmark.distance_to_spawn)} {t.blocksUnit || 'm'} {isAr ? 'من الـ Spawn' : 'from spawn'}
              </span>
            </div>
          </div>
        </div>

        {/* Category Pill */}
        <span
          className={`font-mc-mono text-[10px] uppercase font-bold px-2 py-0.5 border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} shrink-0`}
        >
          {landmark.category.replace('_', ' ')}
        </span>
      </div>

      {/* Description */}
      <p className="font-mc-body text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed mb-3">
        {description}
      </p>

      {/* Biomes & Tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3.5 font-mc-mono text-[10px]">
        <span className="px-1.5 py-0.5 bg-[#5B8731]/15 text-[#3E651E] dark:text-[#84CC16] border border-[#5B8731]/30 font-bold">
          📍 {landmark.primary_biome}
        </span>
        {landmark.surrounding_biomes.map((b, idx) => (
          <span
            key={idx}
            className="px-1.5 py-0.5 bg-[#8B8B8B]/10 dark:bg-[#333842]/40 text-[#4E4E4E] dark:text-[#94A3B8] border border-[#7B7B7B]/20"
          >
            {b}
          </span>
        ))}
      </div>

      {/* Score Bars */}
      <div className="grid grid-cols-2 gap-3 mb-3 font-mc-mono text-[11px]">
        {/* Scenic Score */}
        <div className="bg-[#BDBDBD]/30 dark:bg-[#15171C]/60 p-2 border border-[#7B7B7B]/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[#555555] dark:text-[#94A3B8] flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-[#EC4899]" />
              {isAr ? 'الجمالية والمنظر' : 'Scenic Score'}
            </span>
            <span className="font-bold text-[#EC4899]">{landmark.scenic_score}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#8B8B8B]/40 dark:bg-[#252830] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#EC4899] to-[#A855F7]"
              style={{ width: `${landmark.scenic_score}%` }}
            />
          </div>
        </div>

        {/* Building Score */}
        <div className="bg-[#BDBDBD]/30 dark:bg-[#15171C]/60 p-2 border border-[#7B7B7B]/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[#555555] dark:text-[#94A3B8] flex items-center gap-1 font-bold">
              <Castle className="w-3 h-3 text-[#10B981]" />
              {isAr ? 'ملاءمة البناء' : 'Building Score'}
            </span>
            <span className="font-bold text-[#10B981]">{landmark.building_score}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#8B8B8B]/40 dark:bg-[#252830] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] to-[#F59E0B]"
              style={{ width: `${landmark.building_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#7B7B7B]/20 font-mc-mono text-xs">
        <button
          onClick={handleCopyTp}
          className="mc-button px-2.5 py-1 text-[11px] font-bold text-[#222222] dark:text-[#E2E8F0] flex items-center gap-1.5 cursor-pointer hover:bg-[#E0E0E0] dark:hover:bg-[#313745]"
        >
          {copiedTp ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#17B85E]" />
              <span>{isAr ? 'تم نسخ الأمر!' : 'Copied!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#5E4325] dark:text-[#FADB44]" />
              <span dir="ltr">{landmark.teleport_command}</span>
            </>
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(landmark.id);
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-[#5B8731] hover:text-[#456A23] cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{isAr ? 'عرض على الخريطة' : 'View on Map'}</span>
        </button>
      </div>
    </div>
  );
}
