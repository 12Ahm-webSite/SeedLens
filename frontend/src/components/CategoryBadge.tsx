'use client';

import React from 'react';
import {
  Sparkles,
  Store,
  Compass,
  Flag,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  isPrimary?: boolean;
}

interface CategoryStyle {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeClass: string;
  textClass: string;
}

export function getCategoryStyle(category: string): CategoryStyle {
  switch (category) {
    case 'Strategic Mega-Hub':
      return {
        label: category,
        icon: Sparkles,
        badgeClass:
          'bg-[#5C3278] border-t border-l border-[#8F55B5] border-b border-r border-[#321744] text-[#FFFFFF] shadow-[1px_1px_0_#000]',
        textClass: 'text-[#DDA0DD]',
      };
    case 'Trading Metropolis':
      return {
        label: category,
        icon: Store,
        badgeClass:
          'bg-[#5B8731] border-t border-l border-[#89BD44] border-b border-r border-[#2A4413] text-[#FFFFFF] shadow-[1px_1px_0_#000]',
        textClass: 'text-[#17B85E]',
      };
    case 'Abyssal Hub':
      return {
        label: category,
        icon: Compass,
        badgeClass:
          'bg-[#2CBAA8] border-t border-l border-[#5EE2D0] border-b border-r border-[#166E63] text-[#FFFFFF] shadow-[1px_1px_0_#000]',
        textClass: 'text-[#2CBAA8]',
      };
    case 'Spawn Outpost':
      return {
        label: category,
        icon: Flag,
        badgeClass:
          'bg-[#E03B24] border-t border-l border-[#F06C59] border-b border-r border-[#7A1E11] text-[#FFFFFF] shadow-[1px_1px_0_#000]',
        textClass: 'text-[#E03B24]',
      };
    case 'Dense Multi':
      return {
        label: category,
        icon: Layers,
        badgeClass:
          'bg-[#866043] border-t border-l border-[#A87954] border-b border-r border-[#4E3523] text-[#FADB44] shadow-[1px_1px_0_#000]',
        textClass: 'text-[#D49B1E]',
      };
    default:
      return {
        label: category,
        icon: HelpCircle,
        badgeClass:
          'bg-[#8B8B8B] border-t border-l border-[#FFFFFF] border-b border-r border-[#555555] text-[#222222] shadow-[1px_1px_0_#000]',
        textClass: 'text-[#555555]',
      };
  }
}

export default function CategoryBadge({
  category,
  size = 'md',
  isPrimary = false,
}: CategoryBadgeProps) {
  const { translateCategory } = useLanguage();
  const style = getCategoryStyle(category);
  const Icon = style.icon;
  const label = translateCategory(category);

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1 font-bold',
    md: 'text-xs px-2 py-0.5 gap-1.5 font-bold',
    lg: 'text-sm px-2.5 py-1 gap-2 font-bold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center font-mc-mono uppercase tracking-wider select-none ${
        sizeClasses[size]
      } ${style.badgeClass} ${
        isPrimary ? 'ring-1 ring-[#FFFFFF]' : ''
      }`}
    >
      <Icon className={`${iconSizes[size]} shrink-0`} />
      <span>{label}</span>
    </span>
  );
}
