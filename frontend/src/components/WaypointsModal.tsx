'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  MapPin,
  FileText,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { SeedLensResult } from '@/types/seedlens';

interface WaypointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SeedLensResult;
}

export default function WaypointsModal({
  isOpen,
  onClose,
  data,
}: WaypointsModalProps) {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'xaero' | 'journeymap'>('xaero');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const seedStr = String(data.seed);
  const versionStr = data.minecraft_version;

  // 1. Build list of all noteworthy waypoints
  interface WaypointEntry {
    name: string;
    initial: string;
    x: number;
    y: number;
    z: number;
    colorIndex: number; // 0-15 for Xaero
    rgb: [number, number, number]; // For JourneyMap
  }

  const entries: WaypointEntry[] = [];

  // Spawn
  if (data.world_spawn) {
    entries.push({
      name: 'World Spawn',
      initial: 'S',
      x: data.world_spawn.x,
      y: 64,
      z: data.world_spawn.z,
      colorIndex: 10, // Green
      rgb: [91, 135, 49],
    });
  }

  // Landmarks
  (data.landmarks?.spots || []).forEach((lm, idx) => {
    const isCherry = lm.category.includes('cherry');
    const isIsland = lm.category.includes('island');
    const isBasin = lm.category.includes('basin');
    const isPeak = lm.category.includes('crater') || lm.category.includes('clifftop');

    let colorIdx = 6; // Gold/Orange
    let rgb: [number, number, number] = [250, 219, 68];

    if (isCherry) {
      colorIdx = 13; // Light Purple / Pink
      rgb = [255, 183, 197];
    } else if (isIsland) {
      colorIdx = 3; // Cyan/Aqua
      rgb = [44, 186, 168];
    } else if (isBasin) {
      colorIdx = 2; // Dark Green
      rgb = [137, 189, 68];
    } else if (isPeak) {
      colorIdx = 15; // White
      rgb = [240, 240, 240];
    }

    const cleanName = locale === 'ar' && lm.name_ar ? lm.name_ar : lm.name_en;
    entries.push({
      name: cleanName || `Landmark #${idx + 1}`,
      initial: isCherry ? 'C' : isIsland ? 'I' : isBasin ? 'B' : 'L',
      x: lm.x,
      y: lm.y || 70,
      z: lm.z,
      colorIndex: colorIdx,
      rgb,
    });
  });

  // Clusters
  (data.clusters || []).forEach((cl) => {
    let colorIdx = 14; // Yellow
    let rgb: [number, number, number] = [255, 215, 0];

    if (cl.primary_category.includes('Abyssal')) {
      colorIdx = 1; // Dark Blue
      rgb = [15, 98, 120];
    } else if (cl.primary_category.includes('Trading')) {
      colorIdx = 2; // Green
      rgb = [50, 168, 82];
    } else if (cl.primary_category.includes('Mega-Hub')) {
      colorIdx = 5; // Dark Purple
      rgb = [155, 89, 182];
    }

    entries.push({
      name: cl.primary_category,
      initial: cl.primary_category[0] || 'C',
      x: Math.round(cl.center.x),
      y: 70,
      z: Math.round(cl.center.z),
      colorIndex: colorIdx,
      rgb,
    });
  });

  // Discovered special structures (Trial Chambers, Woodland Mansion, etc.)
  (data.discovery?.structures || []).forEach((st) => {
    if (st.type === 'Trial Chambers') {
      entries.push({
        name: 'Trial Chambers',
        initial: 'T',
        x: st.x,
        y: -20,
        z: st.z,
        colorIndex: 6, // Copper/Orange
        rgb: [211, 91, 46],
      });
    } else if (st.type === 'Woodland Mansion') {
      entries.push({
        name: 'Woodland Mansion',
        initial: 'M',
        x: st.x,
        y: 75,
        z: st.z,
        colorIndex: 4, // Dark Red
        rgb: [139, 44, 44],
      });
    }
  });

  // Generate Xaero's Minimap text format
  const generateXaeroText = (): string => {
    const lines = [
      `# SeedLens Waypoints Export`,
      `# Seed: ${seedStr} | Minecraft Java ${versionStr}`,
      `# Total Points: ${entries.length}`,
      ``,
    ];
    entries.forEach((e) => {
      // Format: waypoint:name:initial:x:y:z:color:disabled:type:set:rotate_on_tp:tp_yaw:visibility_type
      lines.push(
        `waypoint:${e.name.replace(/:/g, '_')}:${e.initial}:${e.x}:${e.y}:${e.z}:${e.colorIndex}:false:0:gui.xaero_default:false:0:0`
      );
    });
    return lines.join('\n');
  };

  // Generate JourneyMap JSON format
  const generateJourneyMapJson = (): string => {
    const jmObjects = entries.map((e, idx) => ({
      id: `seedlens_${idx}_${e.x}_${e.z}`,
      name: e.name,
      icon: 'waypoint-normal.png',
      x: e.x,
      y: e.y,
      z: e.z,
      r: e.rgb[0],
      g: e.rgb[1],
      b: e.rgb[2],
      enable: true,
      type: 'Normal',
      origin: 'SeedLens',
      dimensions: [0],
    }));

    return JSON.stringify(jmObjects, null, 2);
  };

  const currentContent =
    activeTab === 'xaero' ? generateXaeroText() : generateJourneyMapJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'xaero' ? 'txt' : 'json';
    const filename = `SeedLens_${seedStr}_${activeTab}_waypoints.${ext}`;
    const blob = new Blob([currentContent], {
      type: activeTab === 'xaero' ? 'text/plain;charset=utf-8' : 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#D0D0D0] dark:bg-[#1E1F22] border-t-4 border-l-4 border-white/30 border-b-4 border-r-4 border-black/40 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-[#866043] text-white border-b-2 border-[#4E3523]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FADB44]" />
            <h2 className="font-mc-heading text-sm md:text-base uppercase tracking-wider font-bold">
              {t.waypointsModalTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white hover:bg-black/20 rounded cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <p className="text-xs sm:text-sm text-[#444] dark:text-[#94A3B8]">
            {t.waypointsModalDesc}
          </p>

          {/* Mod Switcher Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('xaero')}
              className={`flex-1 py-2 px-3 text-xs font-mc-heading uppercase rounded border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'xaero'
                  ? 'bg-[#5B8731] text-white border-b-4 border-[#3D5A20] shadow'
                  : 'bg-black/10 dark:bg-white/10 text-[#555] dark:text-[#94A3B8] border-transparent hover:bg-black/15'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.tabXaero}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('journeymap')}
              className={`flex-1 py-2 px-3 text-xs font-mc-heading uppercase rounded border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'journeymap'
                  ? 'bg-[#866043] text-white border-b-4 border-[#4E3523] shadow'
                  : 'bg-black/10 dark:bg-white/10 text-[#555] dark:text-[#94A3B8] border-transparent hover:bg-black/15'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.tabJourneyMap}</span>
            </button>
          </div>

          {/* Waypoints Count & Info */}
          <div className="flex items-center justify-between text-xs text-[#555] dark:text-[#94A3B8] font-mc-mono">
            <span>Points included: {entries.length}</span>
            <span>Seed: {seedStr}</span>
          </div>

          {/* Raw Text Preview */}
          <div className="relative">
            <pre className="p-3 bg-black/90 text-[#89BD44] font-mc-mono text-[11px] leading-relaxed rounded border border-white/10 max-h-48 overflow-y-auto select-all">
              {currentContent}
            </pre>
          </div>

          {/* Installation Path Guide */}
          <div className="p-3 bg-[#866043]/15 dark:bg-[#866043]/25 border-l-4 border-[#866043] text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#866043] dark:text-[#FADB44]">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Installation Guide</span>
            </div>
            <p className="text-[11px] text-[#444] dark:text-[#CBD5E1] font-mono break-all">
              {activeTab === 'xaero'
                ? t.xaeroInstallGuide
                : t.journeyMapInstallGuide}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-black/5 dark:bg-black/20 border-t border-black/10 dark:border-white/10 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-mc-heading uppercase rounded border-2 border-[#866043] bg-white dark:bg-[#2A2B2F] text-[#1E1E1E] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#5B8731]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#866043]" />
            )}
            <span>{copied ? t.copiedWaypointsText : t.copyWaypointsText}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 text-xs font-mc-heading uppercase rounded bg-[#5B8731] text-white border-t-2 border-l-2 border-[#89BD44] border-b-4 border-r-2 border-[#3D5A20] hover:bg-[#6CA03B] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadWaypointsFile}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
