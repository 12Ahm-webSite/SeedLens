'use client';

import React from 'react';
import CategoryBadge from '@/components/CategoryBadge';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoriesInfo() {
  const { t } = useLanguage();

  const categories = [
    {
      name: 'Strategic Mega-Hub',
      criteria: 'Count ≥ 5, Types ≥ 3, Closest pair ≤ 180m, Diameter ≤ 780m',
      desc: t.catStrategicMegaHubDesc,
    },
    {
      name: 'Trading Metropolis',
      criteria: 'Count ≥ 4, Villages ≥ 2, Village spread ≤ 600m, Diameter ≤ 760m',
      desc: t.catTradingMetropolisDesc,
    },
    {
      name: 'Abyssal Hub',
      criteria: 'Count ≥ 4, Ancient Cities ≥ 1, Village/Shipwreck within 450m/250m',
      desc: t.catAbyssalHubDesc,
    },
    {
      name: 'Spawn Outpost',
      criteria: 'Distance to spawn ≤ 1000m, Count ≥ 3, Functional pairing, Diameter ≤ 720m',
      desc: t.catSpawnOutpostDesc,
    },
    {
      name: 'Dense Multi',
      criteria: 'Count ≥ 4, Closest pair ≤ 100m, Diameter ≤ 700m, High density',
      desc: t.catDenseMultiDesc,
    },
  ];

  return (
    <section id="categories-info" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t-2 border-[#A8A8A8]">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#866043] text-[#FADB44] font-mc-mono text-[11px] font-bold mb-2 border-t border-l border-[#A87954] border-b border-r border-[#4E3523] shadow-[1px_1px_0_rgba(0,0,0,0.3)]">
          <span className="w-2 h-2 bg-[#FADB44]"></span>
          <span>{t.categoriesSectionBadge}</span>
        </div>
        <h2 className="font-mc-heading text-2xl sm:text-3xl font-bold text-[#1E1E1E] uppercase tracking-tight drop-shadow-[1px_1px_0_#FFF]">
          {t.categoriesSectionTitle}
        </h2>
        <p className="text-[#4E4E4E] text-xs sm:text-sm font-medium mt-1">
          {t.categoriesSectionDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="mc-gui-panel p-5 flex flex-col justify-between hover:bg-[#D0D0D0] transition-colors"
          >
            <div>
              <div className="mb-2.5">
                <CategoryBadge category={cat.name} isPrimary size="md" />
              </div>
              <p className="text-xs text-[#333333] font-medium leading-relaxed mb-3">
                {cat.desc}
              </p>
            </div>
            <div className="pt-2.5 border-t border-[#A8A8A8]">
              <span className="font-mc-mono text-[10px] text-[#555555] uppercase font-bold block mb-1">
                {t.criteriaLabel}
              </span>
              <p className="text-[11px] font-mc-mono font-bold text-[#5B8731] bg-[#B8B8B8] px-2 py-1 border-t border-l border-[#FFFFFF] border-b border-r border-[#555555]" dir="ltr">
                {cat.criteria}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
