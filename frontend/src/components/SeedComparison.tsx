'use client';

import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Crown,
  Dices,
  RefreshCw,
  Castle,
  Camera,
  Trees,
  Swords,
  Coins,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Trophy,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_VERSIONS } from '@/lib/validation';
import { analyzeSeed } from '@/lib/api';
import type { AnalyzeSuccessResponse, Cluster, LandmarkSpot } from '@/types/seedlens';

interface SeedComparisonProps {
  onLoadSeedInAnalyzer: (seed: string, version: string) => void;
}

export default function SeedComparison({ onLoadSeedInAnalyzer }: SeedComparisonProps) {
  const { locale, t, dir } = useLanguage();
  const isAr = locale === 'ar';

  const [seedA, setSeedA] = useState('123456789');
  const [versionA, setVersionA] = useState('1.21.1');
  const [seedB, setSeedB] = useState('202620262026202626');
  const [versionB, setVersionB] = useState('1.21.1');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultA, setResultA] = useState<AnalyzeSuccessResponse | null>(null);
  const [resultB, setResultB] = useState<AnalyzeSuccessResponse | null>(null);

  const getRandomSeed = () => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const buf = new BigInt64Array(1);
      window.crypto.getRandomValues(buf);
      return buf[0].toString();
    }
    return Math.floor(Math.random() * 1000000000).toString();
  };

  const handleCompare = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!seedA.trim() || !seedB.trim()) {
      setError(isAr ? 'يرجى إدخال رقمي البذرتين للبدء' : 'Please provide both seeds to compare');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [resA, resB] = await Promise.all([
        analyzeSeed({ seed: seedA.trim(), version: versionA }),
        analyzeSeed({ seed: seedB.trim(), version: versionB }),
      ]);
      setResultA(resA);
      setResultB(resB);
    } catch (err: unknown) {
      console.error('Comparison error:', err);
      const msg = err instanceof Error ? err.message : 'Unknown error during comparison';
      setError(isAr ? `فشل فحص البذور: ${msg}` : `Failed to compare seeds: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Metric extraction
  const getMetrics = (res: AnalyzeSuccessResponse | null) => {
    if (!res) return null;
    const usefulCount = res.summary?.useful_clusters ?? res.clusters?.length ?? 0;
    const landmarks: LandmarkSpot[] = res.landmarks?.spots ?? [];
    const maxScenic = landmarks.length > 0 ? Math.max(...landmarks.map((l: LandmarkSpot) => l.scenic_score)) : 0;
    const maxBuilding = landmarks.length > 0 ? Math.max(...landmarks.map((l: LandmarkSpot) => l.building_score)) : 0;
    const byType = res.discovery?.by_type ?? {};
    const trialCount = (byType['trial_chambers'] || byType['Trial_Chamber'] || byType['trial_chamber']) ?? 0;
    const outpostCount = (byType['pillager_outpost'] || byType['outpost']) ?? 0;
    const mansionCount = (byType['woodland_mansion'] || byType['mansion']) ?? 0;

    // Nearest structure to spawn
    let nearestSpawnDist = 9999;
    if (res.clusters && res.clusters.length > 0) {
      nearestSpawnDist = Math.min(...res.clusters.map((c: Cluster) => c.cluster?.nearest_spawn ?? 9999));
    }

    return {
      usefulCount,
      landmarkCount: res.landmarks?.total_found ?? landmarks.length,
      maxScenic,
      maxBuilding,
      trialCount,
      outpostCount,
      mansionCount,
      nearestSpawnDist: Math.round(nearestSpawnDist),
      worldSpawn: res.world_spawn,
    };
  };

  const mA = getMetrics(resultA);
  const mB = getMetrics(resultB);

  // Recommendations
  const getRecommendation = () => {
    if (!mA || !mB) return null;
    const recs: { winner: 'A' | 'B' | 'TIE'; title_ar: string; title_en: string; reason_ar: string; reason_en: string }[] = [];

    // 1. Mega-Builder
    if (mA.maxBuilding > mB.maxBuilding) {
      recs.push({
        winner: 'A',
        title_ar: 'الملك البنّاء (Mega-Builder)',
        title_en: 'Mega-Builder Choice',
        reason_ar: `البذرة A توفر تضاريس بناء متفوقة بنسبة (${mA.maxBuilding}% مقابل ${mB.maxBuilding}%) مع سهول منبسطة شاسعة.`,
        reason_en: `Seed A offers superior building terrain (${mA.maxBuilding}% vs ${mB.maxBuilding}%) with prime flat basins.`,
      });
    } else if (mB.maxBuilding > mA.maxBuilding) {
      recs.push({
        winner: 'B',
        title_ar: 'الملك البنّاء (Mega-Builder)',
        title_en: 'Mega-Builder Choice',
        reason_ar: `البذرة B توفر تضاريس بناء أسهل بنسبة (${mB.maxBuilding}% مقابل ${mA.maxBuilding}%) للمدن والممالك.`,
        reason_en: `Seed B offers superior building terrain (${mB.maxBuilding}% vs ${mA.maxBuilding}%) for mega bases.`,
      });
    }

    // 2. Cinematics / Scenic
    if (mA.maxScenic > mB.maxScenic) {
      recs.push({
        winner: 'A',
        title_ar: 'صانع السينما واللقطات (Aesthetic Creator)',
        title_en: 'Cinematic & Scenic Choice',
        reason_ar: `البذرة A تضم فوهات ومشاهد طبيعية أكثر سحراً وإبهاراً (${mA.maxScenic}% مقابل ${mB.maxScenic}%).`,
        reason_en: `Seed A contains more majestic scenic caldera vistas (${mA.maxScenic}% vs ${mB.maxScenic}%).`,
      });
    } else if (mB.maxScenic > mA.maxScenic) {
      recs.push({
        winner: 'B',
        title_ar: 'صانع السينما واللقطات (Aesthetic Creator)',
        title_en: 'Cinematic & Scenic Choice',
        reason_ar: `البذرة B تضم مشاهد طبيعية أعلى تقييماً بنسبة (${mB.maxScenic}% مقابل ${mA.maxScenic}%).`,
        reason_en: `Seed B contains higher-rated scenic vistas (${mB.maxScenic}% vs ${mA.maxScenic}%).`,
      });
    }

    // 3. Combat & Raid
    const combatA = mA.trialCount + mA.outpostCount;
    const combatB = mB.trialCount + mB.outpostCount;
    if (combatA > combatB) {
      recs.push({
        winner: 'A',
        title_ar: 'المغامرة القتالية (Dungeon Raider)',
        title_en: 'Dungeon Raider Choice',
        reason_ar: `البذرة A أكثر كثافة في غرف المحاكمة ومخافر البيلاجر (${combatA} مقابل ${combatB}).`,
        reason_en: `Seed A features denser Trial Chambers and outposts (${combatA} vs ${combatB}).`,
      });
    } else if (combatB > combatA) {
      recs.push({
        winner: 'B',
        title_ar: 'المغامرة القتالية (Dungeon Raider)',
        title_en: 'Dungeon Raider Choice',
        reason_ar: `البذرة B تتفوق في وفرة غرف المحاكمة والمخافر (${combatB} مقابل ${combatA}).`,
        reason_en: `Seed B features denser Trial Chambers and outposts (${combatB} vs ${combatA}).`,
      });
    }

    return recs;
  };

  const recommendations = getRecommendation();

  return (
    <div className="w-full space-y-6">
      {/* Console Input Header */}
      <form onSubmit={handleCompare} className="mc-gui-panel p-5 border-2 border-[#FFFFFF] dark:border-[#363B47] shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#7B7B7B]/30">
          <div className="w-8 h-8 bg-[#2563EB] flex items-center justify-center border-t border-l border-[#60A5FA] border-b border-r border-[#1E40AF]">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-mc-heading text-base font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
              {isAr ? 'مقارنة البذور جنباً إلى جنب (Dual Seed Comparison)' : 'Side-by-Side Dual Seed Comparison'}
            </h2>
            <p className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8]">
              {isAr
                ? 'قارن بين عالمين في نفس اللحظة واكتشف أيهما يتفوق في البناء، كثافة الهياكل، أو الجماليات'
                : 'Compare two worlds concurrently and determine which best fits your playstyle'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box Seed A */}
          <div className="bg-[#DFDFDF] dark:bg-[#161820] p-3.5 border-t border-l border-[#555555] dark:border-[#0E1014] border-b border-r border-[#FFFFFF] dark:border-[#2D333F]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mc-heading text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#2563EB]"></span>
                <span>{isAr ? 'البذرة الأولى (Seed A)' : 'First Seed (Seed A)'}</span>
              </span>
              <button
                type="button"
                onClick={() => setSeedA(getRandomSeed())}
                className="text-[#555555] hover:text-[#2563EB] p-1 cursor-pointer"
                title={isAr ? 'بذرة عشوائية' : 'Random seed'}
              >
                <Dices className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center mc-slot px-2.5 py-1.5 mb-2">
              <span className="font-mc-mono text-[#FADB44] font-bold me-2">#</span>
              <input
                type="text"
                value={seedA}
                onChange={(e) => setSeedA(e.target.value)}
                placeholder="123456789"
                className="w-full bg-transparent font-mc-mono text-xs font-semibold text-[#FFFFFF] focus:outline-none"
                dir="ltr"
              />
            </div>

            <select
              value={versionA}
              onChange={(e) => setVersionA(e.target.value)}
              className="w-full mc-button py-1 px-2 font-mc-mono text-xs text-[#333333] dark:text-[#CBD5E1]"
            >
              {SUPPORTED_VERSIONS.map((v) => (
                <option key={v} value={v}>
                  Java {v}
                </option>
              ))}
            </select>
          </div>

          {/* Box Seed B */}
          <div className="bg-[#DFDFDF] dark:bg-[#161820] p-3.5 border-t border-l border-[#555555] dark:border-[#0E1014] border-b border-r border-[#FFFFFF] dark:border-[#2D333F]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mc-heading text-xs font-bold text-[#EC4899] dark:text-[#F472B6] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#EC4899]"></span>
                <span>{isAr ? 'البذرة الثانية (Seed B)' : 'Second Seed (Seed B)'}</span>
              </span>
              <button
                type="button"
                onClick={() => setSeedB(getRandomSeed())}
                className="text-[#555555] hover:text-[#EC4899] p-1 cursor-pointer"
                title={isAr ? 'بذرة عشوائية' : 'Random seed'}
              >
                <Dices className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center mc-slot px-2.5 py-1.5 mb-2">
              <span className="font-mc-mono text-[#FADB44] font-bold me-2">#</span>
              <input
                type="text"
                value={seedB}
                onChange={(e) => setSeedB(e.target.value)}
                placeholder="20262026202626"
                className="w-full bg-transparent font-mc-mono text-xs font-semibold text-[#FFFFFF] focus:outline-none"
                dir="ltr"
              />
            </div>

            <select
              value={versionB}
              onChange={(e) => setVersionB(e.target.value)}
              className="w-full mc-button py-1 px-2 font-mc-mono text-xs text-[#333333] dark:text-[#CBD5E1]"
            >
              {SUPPORTED_VERSIONS.map((v) => (
                <option key={v} value={v}>
                  Java {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-2 bg-[#7A1E11] text-white font-mc-mono text-xs flex items-center gap-2 border-t border-l border-[#A83222] border-b border-r border-[#3D0A04]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FADB44]" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="mc-button py-2 px-6 font-mc-heading text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] flex items-center gap-2 cursor-pointer hover:bg-[#EAEAEA] dark:hover:bg-[#252830]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#2563EB]" />
                <span>{isAr ? 'جاري التحليل المتزامن للبذرتين...' : 'Analyzing Both Seeds Concurrently...'}</span>
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 text-[#FADB44]" />
                <span>{isAr ? '⚖️ مقارنة العالمين مباشرة' : '⚖️ Run Head-to-Head Comparison'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comparison Results Table */}
      {mA && mB && resultA && resultB && (
        <div className="space-y-5 animate-fade-in">
          {/* Recommendations Header */}
          {recommendations && recommendations.length > 0 && (
            <div className="mc-gui-panel p-4 border-l-4 border-l-[#FADB44]">
              <h3 className="font-mc-heading text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-2.5 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#FADB44]" />
                <span>{isAr ? 'توصيات أسلوب اللعب الأنسب (Playstyle Recommendations):' : 'Playstyle Recommendations:'}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {recommendations.map((rec, i) => (
                  <div key={i} className="mc-slot p-2.5 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#FADB44]">{isAr ? rec.title_ar : rec.title_en}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 ${rec.winner === 'A' ? 'bg-[#2563EB] text-white' : 'bg-[#EC4899] text-white'}`}>
                        {rec.winner === 'A' ? (isAr ? 'البذرة A تتفوق' : 'Seed A Wins') : (isAr ? 'البذرة B تتفوق' : 'Seed B Wins')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                      {isAr ? rec.reason_ar : rec.reason_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side-by-Side Metrics Matrix */}
          <div className="mc-gui-panel p-4">
            <h3 className="font-mc-heading text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-3 flex items-center justify-between">
              <span>{isAr ? 'مصفوفة المؤشرات التنافسية (Competitive Metrics Matrix)' : 'Head-to-Head Metrics Matrix'}</span>
              <div className="flex items-center gap-3 text-[11px] font-mc-mono">
                <span className="text-[#2563EB] font-bold">● Seed A (#{seedA})</span>
                <span className="text-[#EC4899] font-bold">● Seed B (#{seedB})</span>
              </div>
            </h3>

            <div className="space-y-3 font-mc-mono text-xs">
              {/* Metric 1: Useful Clusters */}
              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-2.5 border border-[#7B7B7B]/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#333333] dark:text-[#CBD5E1]">
                    🏰 {isAr ? 'العناقيد الاستراتيجية المفيدة (Useful Clusters):' : 'Useful Clusters Count:'}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${mA.usefulCount >= mB.usefulCount ? 'text-[#2563EB]' : 'text-[#888888]'}`}>
                      A: {mA.usefulCount} {mA.usefulCount > mB.usefulCount ? '👑' : ''}
                    </span>
                    <span className={`font-bold ${mB.usefulCount >= mA.usefulCount ? 'text-[#EC4899]' : 'text-[#888888]'}`}>
                      B: {mB.usefulCount} {mB.usefulCount > mA.usefulCount ? '👑' : ''}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-black/20 h-2 flex overflow-hidden">
                  <div style={{ width: `${(mA.usefulCount / Math.max(1, mA.usefulCount + mB.usefulCount)) * 100}%` }} className="bg-[#2563EB]" />
                  <div style={{ width: `${(mB.usefulCount / Math.max(1, mA.usefulCount + mB.usefulCount)) * 100}%` }} className="bg-[#EC4899]" />
                </div>
              </div>

              {/* Metric 2: Building Score */}
              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-2.5 border border-[#7B7B7B]/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#333333] dark:text-[#CBD5E1]">
                    🔨 {isAr ? 'أعلى تقييم سهولة بناء واستواء (Peak Building Score):' : 'Peak Building Score:'}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${mA.maxBuilding >= mB.maxBuilding ? 'text-[#2563EB]' : 'text-[#888888]'}`}>
                      A: {mA.maxBuilding}% {mA.maxBuilding > mB.maxBuilding ? '👑' : ''}
                    </span>
                    <span className={`font-bold ${mB.maxBuilding >= mA.maxBuilding ? 'text-[#EC4899]' : 'text-[#888888]'}`}>
                      B: {mB.maxBuilding}% {mB.maxBuilding > mA.maxBuilding ? '👑' : ''}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-black/20 h-2 flex overflow-hidden">
                  <div style={{ width: `${(mA.maxBuilding / Math.max(1, mA.maxBuilding + mB.maxBuilding)) * 100}%` }} className="bg-[#2563EB]" />
                  <div style={{ width: `${(mB.maxBuilding / Math.max(1, mA.maxBuilding + mB.maxBuilding)) * 100}%` }} className="bg-[#EC4899]" />
                </div>
              </div>

              {/* Metric 3: Scenic Score */}
              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-2.5 border border-[#7B7B7B]/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#333333] dark:text-[#CBD5E1]">
                    🏔️ {isAr ? 'أعلى تقييم جمالي وتضاريسي (Peak Scenic Score):' : 'Peak Scenic Score:'}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${mA.maxScenic >= mB.maxScenic ? 'text-[#2563EB]' : 'text-[#888888]'}`}>
                      A: {mA.maxScenic}% {mA.maxScenic > mB.maxScenic ? '👑' : ''}
                    </span>
                    <span className={`font-bold ${mB.maxScenic >= mA.maxScenic ? 'text-[#EC4899]' : 'text-[#888888]'}`}>
                      B: {mB.maxScenic}% {mB.maxScenic > mA.maxScenic ? '👑' : ''}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-black/20 h-2 flex overflow-hidden">
                  <div style={{ width: `${(mA.maxScenic / Math.max(1, mA.maxScenic + mB.maxScenic)) * 100}%` }} className="bg-[#2563EB]" />
                  <div style={{ width: `${(mB.maxScenic / Math.max(1, mA.maxScenic + mB.maxScenic)) * 100}%` }} className="bg-[#EC4899]" />
                </div>
              </div>

              {/* Metric 4: Trial Chambers & Combat */}
              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-2.5 border border-[#7B7B7B]/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#333333] dark:text-[#CBD5E1]">
                    ⚔️ {isAr ? 'غرف المحاكمة النحاسية (Trial Chambers):' : 'Trial Chambers Count:'}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${mA.trialCount >= mB.trialCount ? 'text-[#2563EB]' : 'text-[#888888]'}`}>
                      A: {mA.trialCount} {mA.trialCount > mB.trialCount ? '👑' : ''}
                    </span>
                    <span className={`font-bold ${mB.trialCount >= mA.trialCount ? 'text-[#EC4899]' : 'text-[#888888]'}`}>
                      B: {mB.trialCount} {mB.trialCount > mA.trialCount ? '👑' : ''}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-black/20 h-2 flex overflow-hidden">
                  <div style={{ width: `${(mA.trialCount / Math.max(1, mA.trialCount + mB.trialCount)) * 100}%` }} className="bg-[#2563EB]" />
                  <div style={{ width: `${(mB.trialCount / Math.max(1, mA.trialCount + mB.trialCount)) * 100}%` }} className="bg-[#EC4899]" />
                </div>
              </div>

              {/* Metric 5: Nearest Structure to Spawn */}
              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-2.5 border border-[#7B7B7B]/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#333333] dark:text-[#CBD5E1]">
                    🚀 {isAr ? 'أقرب تجمع لهياكل البداية من الـ Spawn (الأقصر يفوز):' : 'Nearest Cluster from Spawn (Shorter Wins):'}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${mA.nearestSpawnDist <= mB.nearestSpawnDist ? 'text-[#2563EB]' : 'text-[#888888]'}`}>
                      A: {mA.nearestSpawnDist}m {mA.nearestSpawnDist < mB.nearestSpawnDist ? '👑' : ''}
                    </span>
                    <span className={`font-bold ${mB.nearestSpawnDist <= mA.nearestSpawnDist ? 'text-[#EC4899]' : 'text-[#888888]'}`}>
                      B: {mB.nearestSpawnDist}m {mB.nearestSpawnDist < mA.nearestSpawnDist ? '👑' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Load Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mc-gui-panel p-3.5 border-t-2 border-l-2 border-[#2563EB] flex items-center justify-between">
              <div>
                <span className="font-mc-heading text-xs font-bold text-[#2563EB] block">
                  {isAr ? 'عالم البذرة A' : 'Seed A World'}
                </span>
                <span className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8]">
                  #{seedA} ({versionA})
                </span>
              </div>
              <button
                onClick={() => onLoadSeedInAnalyzer(seedA, versionA)}
                className="mc-button px-3 py-1.5 font-mc-heading text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isAr ? 'فتح في المحلل والخريطة' : 'Open in Map Analyzer'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mc-gui-panel p-3.5 border-t-2 border-l-2 border-[#EC4899] flex items-center justify-between">
              <div>
                <span className="font-mc-heading text-xs font-bold text-[#EC4899] block">
                  {isAr ? 'عالم البذرة B' : 'Seed B World'}
                </span>
                <span className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8]">
                  #{seedB} ({versionB})
                </span>
              </div>
              <button
                onClick={() => onLoadSeedInAnalyzer(seedB, versionB)}
                className="mc-button px-3 py-1.5 font-mc-heading text-xs font-bold text-[#EC4899] hover:text-[#BE185D] flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isAr ? 'فتح في المحلل والخريطة' : 'Open in Map Analyzer'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
