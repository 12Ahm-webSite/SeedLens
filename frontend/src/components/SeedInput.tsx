'use client';

import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  AlertCircle,
  Sparkles,
  Dices,
  Copy,
  Check,
} from 'lucide-react';
import { SUPPORTED_VERSIONS, validateAndResolveSeed } from '@/lib/validation';
import { useLanguage } from '@/context/LanguageContext';

interface SeedInputProps {
  onAnalyze: (seed: string, version: string) => void;
  isLoading: boolean;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  initialSeed?: string;
  errorMessage?: string | null;
}

export default function SeedInput({
  onAnalyze,
  isLoading,
  selectedVersion,
  onVersionChange,
  initialSeed = '',
  errorMessage,
}: SeedInputProps) {
  const { t, dir, locale } = useLanguage();
  const [seed, setSeed] = useState(initialSeed);
  const [prevInitialSeed, setPrevInitialSeed] = useState(initialSeed);
  const [clientError, setClientError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [textConversionNote, setTextConversionNote] = useState<string | null>(
    null
  );

  const presetSeeds = [
    { label: t.presetTrading, seed: '123456789' },
    { label: t.presetSpawn, seed: '42' },
    { label: t.presetStrategic, seed: '2026' },
    { label: t.presetNegative, seed: '-123456789' },
    { label: t.presetEmpty, seed: '1040' },
  ];

  if (initialSeed !== prevInitialSeed) {
    setPrevInitialSeed(initialSeed);
    setSeed(initialSeed);
  }

  const handleInputChange = (val: string) => {
    setSeed(val);
    if (clientError) setClientError(null);

    const trimmed = val.trim();
    if (!trimmed) {
      setTextConversionNote(null);
      return;
    }

    if (!/^-?\d+$/.test(trimmed)) {
      const res = validateAndResolveSeed(trimmed);
      if (res.valid && res.seedString) {
        setTextConversionNote(
          `${t.textSeedNotePrefix}${trimmed}${t.textSeedNoteSuffix}${res.seedString}`
        );
      } else {
        setTextConversionNote(null);
      }
    } else {
      setTextConversionNote(null);
    }
  };

  const handleRandomize = () => {
    // Generate a random 64-bit integer formatted as string
    const high = Math.floor(Math.random() * 0xffffffff);
    const low = Math.floor(Math.random() * 0xffffffff);
    const sign = Math.random() > 0.5 ? '' : '-';
    const randSeed = `${sign}${((BigInt(high) << BigInt(32)) | BigInt(low)).toString()}`;
    setSeed(randSeed);
    setTextConversionNote(null);
    if (clientError) setClientError(null);
  };

  const handleCopy = () => {
    if (!seed) return;
    navigator.clipboard.writeText(seed);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const trimmed = seed.trim();
    if (!trimmed) {
      setClientError(t.errorEmptySeed);
      return;
    }

    const validation = validateAndResolveSeed(trimmed);
    if (!validation.valid) {
      setClientError(validation.error || t.errorInvalidSeed);
      return;
    }

    setClientError(null);
    onAnalyze(trimmed, selectedVersion);
  };

  const handleSelectPreset = (presetSeed: string) => {
    setSeed(presetSeed);
    setClientError(null);
    setTextConversionNote(null);
    onAnalyze(presetSeed, selectedVersion);
  };

  const displayError = clientError || errorMessage;
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full">
      {/* Quick Action Badges */}
      <div className="flex items-center gap-2 font-mc-mono text-xs flex-wrap mb-3">
        <span className="text-[#555555] dark:text-[#94A3B8] font-bold uppercase text-[11px] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#5B8731]" />
          <span>{t.trySampleSeeds}:</span>
        </span>
        {presetSeeds.map((preset) => (
          <button
            key={preset.seed}
            type="button"
            onClick={() => handleSelectPreset(preset.seed)}
            disabled={isLoading}
            className="px-2.5 py-1 mc-button hover:bg-[#E0E0E0] dark:hover:bg-[#313745] text-[#222222] dark:text-[#E2E8F0] font-bold hover:text-[#5B8731] transition-colors cursor-pointer"
          >
            <span>#{preset.seed}</span>{' '}
            <span className="text-[10px] text-[#555555] dark:text-[#94A3B8] font-normal">
              ({preset.label})
            </span>
          </button>
        ))}
      </div>

      {/* Crafting Cartography Table Console */}
      <form onSubmit={handleSubmit} className="w-full mc-gui-panel p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Input Well: Seed Value */}
          <div className="lg:col-span-6 flex flex-col gap-1">
            <label className="font-mc-mono text-[11px] text-[#333333] dark:text-[#CBD5E1] font-bold uppercase flex items-center justify-between">
              <span>{t.seedLabel} / {locale === 'ar' ? 'كلمة مفتاحية' : 'Keyphrase'}</span>
              <span className="text-[#5B8731] font-bold">
                {locale === 'ar' ? 'جاهز لمعالجة 64-بت جافا' : 'JAVA 64-BIT HASH READY'}
              </span>
            </label>
            <div className="relative flex items-center mc-slot px-3 py-2">
              <span className="font-mc-mono text-[#FADB44] font-bold me-2 select-none text-base">
                #
              </span>
              <input
                type="text"
                value={seed}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={isLoading}
                placeholder={t.inputPlaceholder}
                className="w-full bg-transparent text-[#FFFFFF] font-mc-mono text-sm font-semibold focus:outline-none placeholder-[#B0B0B0]"
                dir="ltr"
              />
              <div className="flex items-center gap-1">
                {seed && !isLoading && (
                  <button
                    type="button"
                    onClick={() => {
                      setSeed('');
                      setTextConversionNote(null);
                      setClientError(null);
                    }}
                    className="p-1 text-[#E0E0E0] hover:text-[#E03B24] cursor-pointer"
                    title={t.clearInput}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRandomize}
                  disabled={isLoading}
                  className="p-1 text-[#E0E0E0] hover:text-[#FADB44] transition-colors cursor-pointer"
                  title={locale === 'ar' ? 'بذرة عشوائية' : 'Random Seed'}
                >
                  <Dices className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-[#E0E0E0] hover:text-[#17B85E] transition-colors cursor-pointer"
                  title={locale === 'ar' ? 'نسخ البذرة' : 'Copy Seed'}
                >
                  {copied ? <Check className="w-4 h-4 text-[#17B85E]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Version Selector */}
          <div className="lg:col-span-3 flex flex-col gap-1">
            <label className="font-mc-mono text-[11px] text-[#333333] dark:text-[#CBD5E1] font-bold uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#5B8731]"></span>
              <span>{t.versionLabel} {locale === 'ar' ? 'المولّد' : 'Generator'}</span>
            </label>
            <div className="relative mc-slot px-3 py-2">
              <select
                value={selectedVersion}
                onChange={(e) => onVersionChange(e.target.value)}
                disabled={isLoading}
                className="w-full bg-transparent text-[#FFFFFF] font-mc-mono text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {SUPPORTED_VERSIONS.map((v) => (
                  <option key={v} value={v} className="bg-[#4A4A4A] dark:bg-[#1E2128] text-[#FFFFFF]">
                    Minecraft Java {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Emerald Action Button */}
          <div className="lg:col-span-3 flex flex-col justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mc-btn-green font-mc-heading text-base uppercase px-4 py-2.5 flex items-center justify-center gap-2 transition-all font-bold cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#FFFFFF]/30 border-t-[#FFFFFF] rounded-full animate-spin" />
                  <span>{t.analyzingButton}</span>
                </>
              ) : (
                <>
                  <Compass className="w-5 h-5 shrink-0" />
                  <span>{t.analyzeButton}</span>
                  <ArrowIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Text Conversion Preview */}
        {textConversionNote && (
          <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-[#4A4A4A] border-t-2 border-l-2 border-[#1A1C20] border-b-2 border-r-2 border-[#555555] text-xs text-[#4DEDF4] font-mc-mono">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#FADB44]" />
            <span>{textConversionNote}</span>
          </div>
        )}

        {/* Error message */}
        {displayError && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#7A1E11] text-[#FFFFFF] font-mc-mono text-xs border-t-2 border-l-2 border-[#A83222] border-b-2 border-r-2 border-[#3D0A04]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FADB44]" />
            <span className="font-bold">{displayError}</span>
          </div>
        )}
      </form>
    </div>
  );
}
