'use client';

import React, { useState } from 'react';
import CategoryBadge from '@/components/CategoryBadge';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Compass, Trees, Mountain, Camera, Castle, Waves } from 'lucide-react';

export default function CategoriesInfo() {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'clusters' | 'landmarks'>('clusters');
  const isAr = locale === 'ar';

  const clusterCategories = [
    {
      name: 'Strategic Mega-Hub',
      criteria: t.criteriaStrategicMegaHub,
      desc: t.catStrategicMegaHubDesc,
    },
    {
      name: 'Trading Metropolis',
      criteria: t.criteriaTradingMetropolis,
      desc: t.catTradingMetropolisDesc,
    },
    {
      name: 'Abyssal Hub',
      criteria: t.criteriaAbyssalHub,
      desc: t.catAbyssalHubDesc,
    },
    {
      name: 'Spawn Outpost',
      criteria: t.criteriaSpawnOutpost,
      desc: t.catSpawnOutpostDesc,
    },
    {
      name: 'Dense Multi',
      criteria: t.criteriaDenseMulti,
      desc: t.catDenseMultiDesc,
    },
  ];

  const landmarkCategories = [
    {
      name: isAr ? 'فوهة كرز جبلية' : 'Cherry Blossom Caldera',
      tag: 'CHERRY CALDERA',
      icon: <Trees className="w-5 h-5 text-[#F472B6]" />,
      criteria: isAr
        ? 'بستان كرز أو مرج في المركز، حلقة قمم مثلجة محيطة ≥ 60%، ارتفاع Y ≈ 135'
        : 'Cherry grove/meadow center, ring of snowy peaks ≥ 60%, elevation Y ≈ 135',
      desc: isAr
        ? 'وادٍ دائري خلاب تحيط به القمم الجبلية الشاهقة وتزينه أزهار الكرز، من أندر التضاريس السينمائية لبناء القلاع وأخذ لقطات شاشة.'
        : 'Breathtaking circular valley enclosed by snowy peaks and covered in cherry blossoms, perfect for scenic screenshots and mountain bases.',
    },
    {
      name: isAr ? 'فوهة جبلية محاطة بقمم' : 'Mountain Crater Ring',
      tag: 'CRATER RING',
      icon: <Mountain className="w-5 h-5 text-[#10B981]" />,
      criteria: isAr
        ? 'مرج/سهول محاطة بقمم مسننة ومثلجة ≥ 4 اتجاهات، تضاريس محمية'
        : 'Meadow/plains enclosed by jagged & snowy peaks in ≥ 4 directions, secluded fortress',
      desc: isAr
        ? 'وادٍ فسيح محمي بسلاسل جبلية شاهقة من كل اتجاه، يمنح حماية طبيعية للممالك والقواعد الضخمة دون وحوش متسللة.'
        : 'Hidden alpine crater enclosed by towering jagged peaks. Offers natural fortification and awe-inspiring landscape for megabases.',
    },
    {
      name: isAr ? 'جرف بانورامي شاهق' : 'Epic Clifftop Vista',
      tag: 'CLIFFTOP VISTA',
      icon: <Camera className="w-5 h-5 text-[#A855F7]" />,
      criteria: isAr
        ? 'سافانا معلقة أو قمم صخرية، فارق ارتفاع عمودي > 80 بلوكاً مطل على محيط أو سهول'
        : 'Windswept savanna or jagged cliffs, sheer drop > 80 blocks overlooking ocean or plains',
      desc: isAr
        ? 'جرف صخري حاد يطل على مساحات مائية شاسعة؛ إطلالة سينمائية مهيبة لبناء الجسور المعلقة والقلاع السحابية والموانئ البحرية.'
        : 'Dramatic sheer cliff rising over 80 blocks above coastal waters. Exceptional dramatic vista for suspension bridges and aerial fortresses.',
    },
    {
      name: isAr ? 'حوض بناء مستوٍ واسع' : 'Prime Building Basin',
      tag: 'BUILDING BASIN',
      icon: <Castle className="w-5 h-5 text-[#F59E0B]" />,
      criteria: isAr
        ? 'أرض سهول/مروج مستوية، تباين تضاريسي منخفض، ملاصقة لنهر أو بحر مع وفرة الخشب'
        : 'Flat plains/meadow, low elevation variance, adjacent to water and forest resources',
      desc: isAr
        ? 'مساحة فسيحة خصبة ومستوية بجوار المياه والموارد؛ الموقع الأمثل لتأسيس المدن الكبرى والمزارع الضخمة دون عناء تسوية الأرض.'
        : 'Vast flat terrain adjacent to water and forest resources. Optimal building conditions for sprawling cities and farms without terraforming.',
    },
    {
      name: isAr ? 'جزيرة نجاة معزولة' : 'Isolated Survival Island',
      tag: 'SURVIVAL ISLAND',
      icon: <Waves className="w-5 h-5 text-[#0284C7]" />,
      criteria: isAr
        ? 'كتلة أرضية نقية محاطة بمحيط عميق ≥ 300م في كافة الاتجاهات'
        : 'Pristine landmass encircled by deep ocean for ≥ 300m in all directions',
      desc: isAr
        ? 'جزيرة معزولة في قلب المحيط لمحبّي تحديات النجاة الكلاسيكية والمنارات الساحلية والمنتجعات البحرية الهادئة.'
        : 'Secluded survival island encircled by deep ocean waters. Prime choice for hardcore island survival, lighthouses, and oceanic retreats.',
    },
  ];

  return (
    <section id="categories-info" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t-2 border-[#A8A8A8] dark:border-[#2E3342]">
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#866043] text-[#FADB44] font-mc-mono text-[11px] font-bold mb-2 border-t border-l border-[#A87954] border-b border-r border-[#4E3523] shadow-[1px_1px_0_rgba(0,0,0,0.3)]">
          <span className="w-2 h-2 bg-[#FADB44]"></span>
          <span>{t.categoriesSectionBadge}</span>
        </div>
        <h2 className="font-mc-heading text-2xl sm:text-3xl font-bold text-[#1E1E1E] dark:text-[#F1F5F9] uppercase tracking-tight drop-shadow-[1px_1px_0_#FFF] dark:drop-shadow-[1px_1px_0_#000]">
          {t.categoriesSectionTitle}
        </h2>
        <p className="text-[#4E4E4E] dark:text-[#94A3B8] text-xs sm:text-sm font-medium mt-1">
          {t.categoriesSectionDesc}
        </p>

        {/* Switcher between Structural Clusters and Landmarks categories */}
        <div className="flex items-center justify-center gap-2 mt-5 font-mc-heading text-xs">
          <button
            onClick={() => setActiveTab('clusters')}
            className={`px-3 py-1.5 flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
              activeTab === 'clusters'
                ? 'bg-[#5B8731] text-white shadow-[2px_2px_0_#2A4413]'
                : 'mc-button text-[#333333] dark:text-[#E2E8F0]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t.tabUsefulClusters || 'Useful Clusters'}</span>
          </button>
          <button
            onClick={() => setActiveTab('landmarks')}
            className={`px-3 py-1.5 flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
              activeTab === 'landmarks'
                ? 'bg-[#EC4899] text-white shadow-[2px_2px_0_#831843]'
                : 'mc-button text-[#333333] dark:text-[#E2E8F0]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FDE047]" />
            <span>{t.tabLandmarks || 'Scenic & Building Spots'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'clusters' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusterCategories.map((cat) => (
            <div
              key={cat.name}
              className="mc-gui-panel p-5 flex flex-col justify-between hover:bg-[#D0D0D0] dark:hover:bg-[#262A34] transition-colors"
            >
              <div>
                <div className="mb-2.5">
                  <CategoryBadge category={cat.name} isPrimary size="md" />
                </div>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] font-medium leading-relaxed mb-3">
                  {cat.desc}
                </p>
              </div>
              <div className="pt-2.5 border-t border-[#A8A8A8] dark:border-[#2E3342]">
                <span className="font-mc-mono text-[10px] text-[#555555] dark:text-[#94A3B8] uppercase font-bold block mb-1">
                  {t.criteriaLabel}
                </span>
                <p className="text-[11px] font-mc-mono font-bold text-[#5B8731] bg-[#B8B8B8] dark:bg-[#181B22] px-2 py-1 border-t border-l border-[#FFFFFF] dark:border-[#303644] border-b border-r border-[#555555] dark:border-[#0E1015]">
                  {cat.criteria}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {landmarkCategories.map((lm) => (
            <div
              key={lm.tag}
              className="mc-gui-panel p-5 flex flex-col justify-between hover:bg-[#D0D0D0] dark:hover:bg-[#262A34] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#BDBDBD] dark:bg-[#15171C] border border-[#7B7B7B] dark:border-[#333842] flex items-center justify-center">
                      {lm.icon}
                    </div>
                    <span className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                      {lm.name}
                    </span>
                  </div>
                  <span className="font-mc-mono text-[9px] bg-[#333842] text-[#FADB44] px-1.5 py-0.5 border border-[#555]">
                    {lm.tag}
                  </span>
                </div>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] font-medium leading-relaxed mb-3">
                  {lm.desc}
                </p>
              </div>
              <div className="pt-2.5 border-t border-[#A8A8A8] dark:border-[#2E3342]">
                <span className="font-mc-mono text-[10px] text-[#555555] dark:text-[#94A3B8] uppercase font-bold block mb-1">
                  {t.criteriaLabel}
                </span>
                <p className="text-[11px] font-mc-mono font-bold text-[#EC4899] bg-[#B8B8B8] dark:bg-[#181B22] px-2 py-1 border-t border-l border-[#FFFFFF] dark:border-[#303644] border-b border-r border-[#555555] dark:border-[#0E1015]">
                  {lm.criteria}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
