'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface MinecraftClockToggleProps {
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function MinecraftClockToggle({
  showLabel = false,
  className = '',
  size = 'md',
}: MinecraftClockToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const { locale } = useLanguage();
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    toggleTheme();
    setTimeout(() => setIsRotating(false), 800);
  };

  const isAr = locale === 'ar';
  const currentModeText = isDark
    ? isAr
      ? 'الوضع الليلي'
      : 'Night Mode'
    : isAr
      ? 'الوضع النهاري'
      : 'Day Mode';

  const nextModeText = isDark
    ? isAr
      ? 'التبديل إلى النهاري'
      : 'Switch to Day'
    : isAr
      ? 'التبديل إلى الليلي'
      : 'Switch to Night';

  // Dimension scaling
  const pixelSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${currentModeText} — ${nextModeText}`}
      title={`${currentModeText} (${nextModeText})`}
      className={`group relative flex items-center gap-2 p-1.5 mc-button hover:bg-[#D5D5D5] dark:hover:bg-[#2C313E] cursor-pointer select-none transition-all duration-150 ${className}`}
    >
      {/* Authentic Minecraft Clock Canvas / SVG */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <svg
          viewBox="0 0 32 32"
          width={pixelSize}
          height={pixelSize}
          className="overflow-visible drop-shadow-[1px_1px_0_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(250,219,68,0.7)]"
          style={{ imageRendering: 'pixelated' }}
        >
          <defs>
            {/* The arched window clipPath where the celestial dial appears */}
            <clipPath id="mc-clock-window-clip">
              {/* Arched dome: top half of a circle centered at (16, 16) with radius 9 */}
              <path d="M 7 16 A 9 9 0 0 1 25 16 L 25 18 L 7 18 Z" />
            </clipPath>

            {/* Gradient for Day Sky */}
            <linearGradient id="mc-day-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4886E8" />
              <stop offset="70%" stopColor="#6FA8F8" />
              <stop offset="100%" stopColor="#89BDF8" />
            </linearGradient>

            {/* Gradient for Night Sky */}
            <linearGradient id="mc-night-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#080B18" />
              <stop offset="60%" stopColor="#101428" />
              <stop offset="100%" stopColor="#1A213D" />
            </linearGradient>

            {/* Gold casing gradients */}
            <linearGradient id="mc-gold-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="40%" stopColor="#E5AD2C" />
              <stop offset="80%" stopColor="#BA871B" />
              <stop offset="100%" stopColor="#6C4906" />
            </linearGradient>
          </defs>

          {/* ========================================================= */}
          {/* 1. TOP HANGER LOOP (Pocket watch ring)                     */}
          {/* ========================================================= */}
          <rect x="13" y="1" width="6" height="3" fill="#3D2603" />
          <rect x="14" y="2" width="4" height="1" fill="#BA871B" />
          <rect x="15" y="0" width="2" height="1" fill="#FFF275" />

          {/* ========================================================= */}
          {/* 2. OUTER GOLD CASING BASE                                 */}
          {/* ========================================================= */}
          {/* Dark outline */}
          <rect x="6" y="5" width="20" height="23" fill="#3D2603" rx="4" />
          <rect x="5" y="7" width="22" height="19" fill="#3D2603" rx="3" />

          {/* Gold casing fill */}
          <rect x="7" y="6" width="18" height="21" fill="url(#mc-gold-rim)" rx="3" />

          {/* Outer casing highlight bevels (Top and Left) */}
          <path
            d="M 8 6 L 24 6 L 23 7 L 9 7 L 8 26 L 7 26 Z"
            fill="#FFF799"
            opacity="0.9"
          />
          {/* Outer casing shadow bevels (Bottom and Right) */}
          <path
            d="M 24 7 L 25 8 L 25 26 L 8 26 L 9 25 L 24 25 Z"
            fill="#5E3E04"
            opacity="0.9"
          />

          {/* ========================================================= */}
          {/* 3. INNER WINDOW BEZEL & SHADOW                            */}
          {/* ========================================================= */}
          {/* Recessed bezel frame behind dial */}
          <path
            d="M 6 16 A 10 10 0 0 1 26 16 L 26 19 L 6 19 Z"
            fill="#231702"
          />

          {/* ========================================================= */}
          {/* 4. ROTATING CELESTIAL DIAL (180° rotation between Day/Night)*/}
          {/* ========================================================= */}
          <g clipPath="url(#mc-clock-window-clip)">
            {/* The Dial disk that rotates around center (16, 16) */}
            <g
              style={{
                transformOrigin: '16px 16px',
                transform: `rotate(${isDark ? 180 : 0}deg)`,
                transition: 'transform 0.75s cubic-bezier(0.34, 1.35, 0.64, 1)',
              }}
            >
              {/* Dial Disc Background: Circle with radius 11 at (16, 16) */}
              {/* Day Half (Top, y <= 16) */}
              <circle cx="16" cy="16" r="11" fill="url(#mc-day-sky)" />

              {/* Night Half (Bottom, y >= 16) */}
              <path
                d="M 5 16 A 11 11 0 0 0 27 16 Z"
                fill="url(#mc-night-sky)"
              />

              {/* Horizon Blend Line between Day & Night */}
              <line
                x1="5"
                y1="16"
                x2="27"
                y2="16"
                stroke="#E2943B"
                strokeWidth="0.8"
                opacity="0.75"
              />

              {/* ---------------- DAY SKY ELEMENTS ---------------- */}
              {/* White Pixel Clouds */}
              <rect x="7" y="11" width="4" height="2" fill="#FFFFFF" opacity="0.6" />
              <rect x="8" y="10" width="2" height="1" fill="#FFFFFF" opacity="0.4" />
              <rect x="21" y="12" width="4" height="2" fill="#FFFFFF" opacity="0.6" />
              <rect x="22" y="11" width="2" height="1" fill="#FFFFFF" opacity="0.4" />

              {/* Pixel Art Golden Sun (At top zenith: y=7) */}
              {/* Outer sun glow */}
              <rect x="12" y="7" width="8" height="8" fill="#FF9A00" opacity="0.8" />
              {/* Main golden sun body */}
              <rect x="13" y="8" width="6" height="6" fill="#FFD000" />
              {/* Bright inner core */}
              <rect x="14" y="9" width="4" height="4" fill="#FFF885" />
              <rect x="15" y="10" width="2" height="2" fill="#FFFFFF" />

              {/* ---------------- NIGHT SKY ELEMENTS ---------------- */}
              {/* Stars in the Night Sky */}
              {/* Star 1 */}
              <rect x="8" y="21" width="1" height="1" fill="#FFF9A0" />
              {/* Star 2 */}
              <rect x="10" y="24" width="1" height="1" fill="#FFFFFF" />
              {/* Star 3 */}
              <rect x="22" y="20" width="1" height="1" fill="#FFF9A0" />
              {/* Star 4 */}
              <rect x="23" y="24" width="1" height="1" fill="#FFFFFF" />
              {/* Star 5 (subtle cyan star) */}
              <rect x="15" y="26" width="1" height="1" fill="#8CE4F5" opacity="0.9" />

              {/* Pixel Art Pale Moon (At bottom nadir: y=17 when rotated) */}
              {/* Outer moon rim */}
              <rect x="12" y="17" width="8" height="8" fill="#4B5675" opacity="0.6" />
              {/* Main moon body */}
              <rect x="13" y="18" width="6" height="6" fill="#DDE4F0" />
              {/* Moon bright face */}
              <rect x="14" y="19" width="4" height="4" fill="#F4F7FC" />
              {/* Moon craters (classic Minecraft details) */}
              <rect x="14" y="19" width="1.5" height="1.5" fill="#9BA8C2" />
              <rect x="16" y="21" width="1.5" height="1.5" fill="#9BA8C2" />
            </g>
          </g>

          {/* ========================================================= */}
          {/* 5. CLOCK LOWER FACEPLATE & TICK MARKS                      */}
          {/* ========================================================= */}
          {/* Lower gold faceplate covering bottom half */}
          <path
            d="M 6 18 L 26 18 L 26 26 C 26 27.5 24.5 29 23 29 L 9 29 C 7.5 29 6 27.5 6 26 Z"
            fill="#BA871B"
          />

          {/* Lower faceplate highlight & shadow bevel */}
          <line x1="7" y1="18" x2="25" y2="18" stroke="#3D2603" strokeWidth="1" />
          <line x1="7" y1="19" x2="25" y2="19" stroke="#FFF275" strokeWidth="1" />
          <rect x="9" y="21" width="14" height="6" fill="#A87713" />

          {/* Dial center decorative rivet / tick indicator */}
          <rect x="15" y="17" width="2" height="3" fill="#3D2603" />
          <rect x="15.5" y="17.5" width="1" height="1" fill="#FFF275" />
          <rect x="13" y="23" width="6" height="2" fill="#755106" />
          <rect x="14" y="23.5" width="4" height="1" fill="#FFDF6D" />
        </svg>

        {/* Rotation Sparkle Particle when clicked */}
        {isRotating && (
          <span
            className="absolute inset-0 pointer-events-none rounded-full animate-ping opacity-60"
            style={{
              backgroundColor: isDark ? '#4DEDF4' : '#FADB44',
            }}
          />
        )}
      </div>

      {/* Optional Mode Label & State text */}
      {showLabel && (
        <div className="flex flex-col text-start leading-none pe-1">
          <span className="font-mc-heading text-xs font-bold text-[#1E1E1E] dark:text-[#E2E8F0] tracking-wide">
            {currentModeText}
          </span>
          <span className="font-mc-mono text-[9px] text-[#555555] dark:text-[#94A3B8] font-semibold">
            {isDark ? '00:00 (MIDNIGHT)' : '12:00 (NOON)'}
          </span>
        </div>
      )}
    </button>
  );
}
