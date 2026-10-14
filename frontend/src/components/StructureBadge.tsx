'use client';

import React from 'react';
import {
  Home,
  Anchor,
  Skull,
  Pyramid,
  Trees,
  MapPin,
  ShieldAlert,
  Compass,
  Castle,
  Landmark,
  Swords,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface StructureBadgeProps {
  type: string;
  count?: number;
  size?: 'sm' | 'md';
}

export function getStructureMetadata(type: string): {
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
} {
  switch (type) {
    case 'Village':
      return {
        label: 'Village',
        icon: Home,
        color: '#5B8731',
        bgClass: 'bg-[#C6C6C6]',
        borderClass: 'border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]',
        textClass: 'text-[#2A4413] font-bold',
      };
    case 'Shipwreck':
      return {
        label: 'Shipwreck',
        icon: Anchor,
        color: '#2CBAA8',
        bgClass: 'bg-[#C6C6C6]',
        borderClass: 'border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]',
        textClass: 'text-[#166E63] font-bold',
      };
    case 'Ancient City':
      return {
        label: 'Ancient City',
        icon: Skull,
        color: '#00F0FF',
        bgClass: 'bg-[#4A4A4A]',
        borderClass: 'border-t border-l border-[#6A6A6A] border-b border-r border-[#222222]',
        textClass: 'text-[#4DEDF4] font-bold',
      };
    case 'Desert Pyramid':
      return {
        label: 'Desert Pyramid',
        icon: Pyramid,
        color: '#D49B1E',
        bgClass: 'bg-[#C6C6C6]',
        borderClass: 'border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]',
        textClass: 'text-[#7D571B] font-bold',
      };
    case 'Jungle Temple':
      return {
        label: 'Jungle Temple',
        icon: Trees,
        color: '#729E38',
        bgClass: 'bg-[#C6C6C6]',
        borderClass: 'border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]',
        textClass: 'text-[#3B5A1C] font-bold',
      };
    case 'Pillager Outpost':
      return {
        label: 'Pillager Outpost',
        icon: ShieldAlert,
        color: '#DC2626',
        bgClass: 'bg-[#C6C6C6]',
        borderClass: 'border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]',
        textClass: 'text-[#991B1B] font-bold',
      };
    case 'Ocean Monument':
      return {
        label: 'Ocean Monument',
        icon: Compass,
        color: '#0284C7',
        bgClass: 'bg-[#C6C6C6]',
        borderClass: 'border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]',
        textClass: 'text-[#0369A1] font-bold',
      };
    case 'Woodland Mansion':
      return {
        label: 'Woodland Mansion',
        icon: Castle,
        color: '#78350F',
        bgClass: 'bg-[#C6C6C6]',
        borderClass: 'border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]',
        textClass: 'text-[#451A03] font-bold',
      };
    case 'Trail Ruins':
      return {
        label: 'Trail Ruins',
        icon: Landmark,
        color: '#D97706',
        bgClass: 'bg-[#C6C6C6]',
        borderClass: 'border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]',
        textClass: 'text-[#92400E] font-bold',
      };
    case 'Trial Chambers':
      return {
        label: 'Trial Chambers',
        icon: Swords,
        color: '#EA580C',
        bgClass: 'bg-[#C6C6C6]',
        borderClass: 'border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]',
        textClass: 'text-[#C2410C] font-bold',
      };
    default:
      return {
        label: type,
        icon: MapPin,
        color: '#8B8B8B',
        bgClass: 'bg-[#C6C6C6]',
        borderClass: 'border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]',
        textClass: 'text-[#333333] font-bold',
      };
  }
}

export default function StructureBadge({
  type,
  count,
  size = 'md',
}: StructureBadgeProps) {
  const { translateStructure } = useLanguage();
  const meta = getStructureMetadata(type);
  const Icon = meta.icon;
  const label = translateStructure(type);

  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center shadow-[1px_1px_0_rgba(0,0,0,0.2)] font-mc-mono select-none ${meta.bgClass} ${meta.borderClass} ${meta.textClass} ${sizeClasses[size]}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: meta.color }} />
      <span>{label}</span>
      {typeof count === 'number' && (
        <span className="ms-1 px-1 py-0.2 mc-slot text-[#FADB44] text-[10px] font-mc-mono font-bold leading-none">
          ×{count}
        </span>
      )}
    </span>
  );
}
