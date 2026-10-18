'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Share2,
  Compass,
  Sparkles,
  Mountain,
  Hammer,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { SeedLensResult } from '@/types/seedlens';

interface PostcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SeedLensResult;
}

export default function PostcardModal({
  isOpen,
  onClose,
  data,
}: PostcardModalProps) {
  const { t, locale } = useLanguage();
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  if (!isOpen) return null;

  const seedStr = String(data.seed);
  const versionStr = data.minecraft_version;
  const spawnX = data.world_spawn?.x ?? 0;
  const spawnZ = data.world_spawn?.z ?? 0;

  // Best landmark
  const topLandmark = data.landmarks?.spots?.[0];
  const landmarkName =
    locale === 'ar' && topLandmark?.name_ar
      ? topLandmark.name_ar
      : topLandmark?.name_en || 'Scenic Panorama';

  // Best cluster
  const topCluster = data.clusters?.[0];
  const clusterName = topCluster?.primary_category || 'Strategic Outpost';

  // Discord / Reddit formatted text
  const generateMarkdownText = (): string => {
    const lines = [
      `🌲 **SeedLens Minecraft World Discovery**`,
      `• **Seed:** \`${seedStr}\` (Java ${versionStr})`,
      `• **World Spawn:** \`X: ${spawnX}, Z: ${spawnZ}\``,
    ];

    if (topLandmark) {
      lines.push(
        `• **Featured Landmark:** ${landmarkName} (Scenic: ${topLandmark.scenic_score}% | Building: ${topLandmark.building_score}%)`
      );
      lines.push(`• **Teleport:** \`${topLandmark.teleport_command}\``);
    }

    if (topCluster) {
      lines.push(
        `• **Top Cluster:** ${clusterName} (${topCluster.cluster.count} structures, ~${Math.round(topCluster.cluster.nearest_spawn)}m from spawn)`
      );
    }

    lines.push(`• *Discovered with SeedLens Cartography Engine* 🔍`);
    return lines.join('\n');
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownText());
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleShareX = () => {
    const tweetText = `Just discovered an amazing Minecraft world on SeedLens!\nSeed: ${seedStr} (${versionStr})\n${landmarkName} at spawn!\n#Minecraft #SeedLens #MinecraftSeeds`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Render postcard to HTML5 Canvas and trigger PNG download
  const handleDownloadImage = () => {
    setIsRendering(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 560;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsRendering(false);
      return;
    }

    // Background: Dark obsidian / deep slate gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1000, 560);
    bgGrad.addColorStop(0, '#15161A');
    bgGrad.addColorStop(1, '#0C0D0F');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1000, 560);

    // Stone border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#866043';
    ctx.strokeRect(7, 7, 986, 546);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#A87954';
    ctx.strokeRect(14, 14, 972, 532);

    // Header banner
    ctx.fillStyle = '#866043';
    ctx.fillRect(20, 20, 960, 75);
    ctx.fillStyle = '#4E3523';
    ctx.fillRect(20, 90, 960, 6);

    // Title & Logo
    ctx.fillStyle = '#FADB44';
    ctx.font = 'bold 32px monospace';
    ctx.fillText('SEEDLENS DISCOVERY POSTCARD', 45, 68);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`JAVA ${versionStr.toUpperCase()}`, 780, 68);

    // Seed Box
    ctx.fillStyle = '#222328';
    ctx.fillRect(45, 120, 910, 80);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#5B8731';
    ctx.strokeRect(45, 120, 910, 80);

    ctx.fillStyle = '#89BD44';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('WORLD SEED:', 70, 150);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px monospace';
    ctx.fillText(seedStr, 70, 185);

    // Coordinates pill on right
    ctx.fillStyle = '#111215';
    ctx.fillRect(720, 135, 210, 50);
    ctx.fillStyle = '#FADB44';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`SPAWN: ${spawnX}, ${spawnZ}`, 735, 166);

    // Landmark Box (Left)
    ctx.fillStyle = '#1A1B20';
    ctx.fillRect(45, 220, 440, 210);
    ctx.strokeStyle = '#3D404A';
    ctx.strokeRect(45, 220, 440, 210);

    ctx.fillStyle = '#FADB44';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('FEATURED LANDMARK', 70, 255);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(landmarkName.slice(0, 30), 70, 290);

    if (topLandmark) {
      ctx.fillStyle = '#2CBAA8';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`Scenic Score: ${topLandmark.scenic_score}%`, 70, 330);

      ctx.fillStyle = '#89BD44';
      ctx.fillText(`Building Score: ${topLandmark.building_score}%`, 70, 360);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '14px monospace';
      ctx.fillText(`Teleport: ${topLandmark.teleport_command}`, 70, 400);
    }

    // Cluster Box (Right)
    ctx.fillStyle = '#1A1B20';
    ctx.fillRect(515, 220, 440, 210);
    ctx.strokeStyle = '#3D404A';
    ctx.strokeRect(515, 220, 440, 210);

    ctx.fillStyle = '#89BD44';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('KEY STRUCTURAL CLUSTER', 540, 255);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(clusterName.slice(0, 30), 540, 290);

    if (topCluster) {
      ctx.fillStyle = '#FADB44';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`Structures Count: ${topCluster.cluster.count}`, 540, 330);

      ctx.fillStyle = '#CBD5E1';
      ctx.fillText(`Distance to Spawn: ~${Math.round(topCluster.cluster.nearest_spawn)}m`, 540, 360);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '14px monospace';
      ctx.fillText(
        `Teleport: /tp ${Math.round(topCluster.center.x)} ~ ${Math.round(topCluster.center.z)}`,
        540,
        400
      );
    }

    // Footer
    ctx.fillStyle = '#866043';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Generated by SeedLens • Verified with Cubiomes C Engine', 45, 480);

    ctx.fillStyle = '#64748B';
    ctx.fillText('Share your world seed with the community', 45, 505);

    // Convert to PNG and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SeedLens_Postcard_${seedStr}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setIsRendering(false);
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#D0D0D0] dark:bg-[#1E1F22] border-t-4 border-l-4 border-white/30 border-b-4 border-r-4 border-black/40 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#866043] text-white border-b-2 border-[#4E3523]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FADB44]" />
            <h2 className="font-mc-heading text-sm md:text-base uppercase tracking-wider font-bold">
              {t.postcardModalTitle}
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

        {/* Postcard Live Visual Preview */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <p className="text-xs sm:text-sm text-[#444] dark:text-[#94A3B8]">
            {t.postcardModalDesc}
          </p>

          {/* Visual Card */}
          <div className="p-4 sm:p-5 rounded bg-[#15161A] border-4 border-[#866043] shadow-inner text-white space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#866043]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#FADB44] animate-pulse"></span>
                <span className="font-mc-heading text-sm text-[#FADB44] uppercase tracking-wider">
                  SeedLens Postcard
                </span>
              </div>
              <span className="px-2 py-0.5 bg-[#866043] text-[11px] font-mc-mono text-white rounded">
                Java {versionStr}
              </span>
            </div>

            {/* Seed Highlight */}
            <div className="p-3 bg-black/60 rounded border border-[#5B8731]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-[#89BD44] font-mc-mono uppercase block">
                  World Seed
                </span>
                <span className="text-lg sm:text-xl font-bold font-mc-mono text-white tracking-wider select-all">
                  {seedStr}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#94A3B8] font-mc-mono block">
                  Spawn Point
                </span>
                <span className="text-xs font-mc-mono text-[#FADB44]">
                  X: {spawnX}, Z: {spawnZ}
                </span>
              </div>
            </div>

            {/* Landmarks & Cluster Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {topLandmark && (
                <div className="p-3 bg-white/5 rounded border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#FADB44] font-bold">
                    <Mountain className="w-3.5 h-3.5" />
                    <span>{landmarkName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#CBD5E1]">
                    <span>Scenic: {topLandmark.scenic_score}%</span>
                    <span>Building: {topLandmark.building_score}%</span>
                  </div>
                  <div className="text-[10px] text-[#89BD44] font-mc-mono pt-1">
                    {topLandmark.teleport_command}
                  </div>
                </div>
              )}

              {topCluster && (
                <div className="p-3 bg-white/5 rounded border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#89BD44] font-bold">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{clusterName}</span>
                  </div>
                  <div className="text-[11px] text-[#CBD5E1]">
                    <span>{topCluster.cluster.count} Structures Cluster</span>
                  </div>
                  <div className="text-[10px] text-[#FADB44] font-mc-mono pt-1">
                    /tp {Math.round(topCluster.center.x)} ~ {Math.round(topCluster.center.z)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-black/5 dark:bg-black/20 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleShareX}
            className="px-3.5 py-2 text-xs font-mc-heading uppercase rounded border-2 border-sky-600/40 bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t.shareOnX}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 text-xs font-mc-heading uppercase rounded border-2 border-[#866043] bg-white dark:bg-[#2A2B2F] text-[#1E1E1E] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copiedMarkdown ? (
              <Check className="w-3.5 h-3.5 text-[#5B8731]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#866043]" />
            )}
            <span>
              {copiedMarkdown ? t.copiedDiscordMarkdown : t.copyDiscordMarkdown}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isRendering}
            className="px-4 py-2 text-xs font-mc-heading uppercase rounded bg-[#5B8731] text-white border-t-2 border-l-2 border-[#89BD44] border-b-4 border-r-2 border-[#3D5A20] hover:bg-[#6CA03B] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isRendering ? 'Rendering...' : t.downloadPostcardImage}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
