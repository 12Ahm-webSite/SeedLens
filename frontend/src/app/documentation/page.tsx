'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  FileText,
  MapPin,
  Trees,
  Mountain,
  Castle,
  Camera,
  Waves,
  Swords,
  CheckCircle2,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DocumentationPage() {
  const { t, locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeSection, setActiveSection] = useState<'changelog' | 'architecture' | 'faq'>('changelog');

  return (
    <div className="min-h-screen flex flex-col bg-[#C6C6C6] dark:bg-[#12141A] text-[#1E1E1E] dark:text-[#E2E8F0] transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-[#A8A8A8] dark:border-[#2E3342] font-mc-mono text-xs">
          <Link
            href="/"
            className="mc-button px-3 py-1.5 flex items-center gap-1.5 font-bold hover:text-[#5B8731] cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isAr ? 'العودة إلى المحلل الرئيسي' : 'Back to Analyzer'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#17B85E] shadow-[0_0_6px_#17B85E]"></span>
            <span className="font-bold text-[#555555] dark:text-[#94A3B8]">
              {isAr ? 'وثيقة مرجعية v4.1' : 'Documentation Reference v4.1'}
            </span>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="mc-gui-panel p-6 sm:p-8 mb-8 border-2 border-[#FFFFFF] dark:border-[#363B47] shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#866043] text-[#FADB44] font-mc-mono text-[11px] font-bold mb-3 border-t-2 border-l-2 border-[#A87954] border-b-2 border-r-2 border-[#4E3523]">
                <FileText className="w-3.5 h-3.5" />
                <span>{isAr ? 'دليل التوثيق وسجل التحديثات الرسمي' : 'OFFICIAL DOCUMENTATION & CHANGELOG'}</span>
              </div>
              <h1 className="font-mc-heading text-2xl sm:text-3xl md:text-4xl text-[#1E1E1E] dark:text-[#F1F5F9] font-bold uppercase tracking-tight">
                {isAr ? 'كل ما تحتاج معرفته عن ' : 'Everything about '}
                <span className="text-[#5B8731]">SeedLens</span>
              </h1>
              <p className="text-sm sm:text-base text-[#4E4E4E] dark:text-[#CBD5E1] mt-2 max-w-3xl leading-relaxed">
                {isAr
                  ? 'سجل مفصل لكافة التحديثات، الميزات الجديدة، وكيفية فحص التضاريس وأماكن البناء والعناقيد الهيكلية بدقة حسابية مطلقة.'
                  : 'Comprehensive guide detailing every update, newly added features, and deterministic algorithms.'}
              </p>
            </div>

            <div className="mc-slot p-4 text-xs font-mc-mono text-center sm:text-start shrink-0">
              <div className="text-[#94A3B8] text-[10px] uppercase font-bold mb-1">
                {isAr ? 'الإصدار النشط حالياً' : 'Current Active Release'}
              </div>
              <div className="text-[#FADB44] font-bold text-lg font-mc-heading">SeedLens v4.1</div>
              <div className="text-[#17B85E] text-[11px] font-bold mt-1">
                ● 100% Bit-Identical Calibrated
              </div>
            </div>
          </div>

          {/* Quick Section Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#A8A8A8] dark:border-[#2E3342] font-mc-heading text-xs">
            <button
              onClick={() => setActiveSection('changelog')}
              className={`px-3 py-1.5 flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeSection === 'changelog'
                  ? 'bg-[#5B8731] text-white shadow-[2px_2px_0_#2A4413]'
                  : 'mc-button text-[#333333] dark:text-[#E2E8F0]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'سجل التحديثات الكامل (Changelog)' : 'Full Changelog'}</span>
            </button>

            <button
              onClick={() => setActiveSection('architecture')}
              className={`px-3 py-1.5 flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeSection === 'architecture'
                  ? 'bg-[#2563EB] text-white shadow-[2px_2px_0_#1E40AF]'
                  : 'mc-button text-[#333333] dark:text-[#E2E8F0]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{isAr ? 'المعمارية التقنية للمحرك' : 'Engine Architecture'}</span>
            </button>

            <button
              onClick={() => setActiveSection('faq')}
              className={`px-3 py-1.5 flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeSection === 'faq'
                  ? 'bg-[#A855F7] text-white shadow-[2px_2px_0_#6B21A8]'
                  : 'mc-button text-[#333333] dark:text-[#E2E8F0]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأسئلة الشائعة والأوامر' : 'FAQ & Commands'}</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: Full Changelog */}
        {activeSection === 'changelog' && (
          <div className="space-y-6 animate-fade-in">
            {/* Version 4.1 Card */}
            <div className="mc-gui-panel p-6 border-l-4 border-l-[#EC4899] border-t-2 border-r-2 border-b-2">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-[#A8A8A8] dark:border-[#2E3342]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#EC4899] text-white font-mc-heading text-xs font-bold shadow-[1px_1px_0_#831843]">
                    v4.1
                  </span>
                  <h2 className="font-mc-heading text-lg font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                    {isAr
                      ? 'محرك استكشاف أماكن البناء والمناظر الطبيعية الخلابة (Scenic & Building Spots)'
                      : 'Scenic & Prime Building Spots Discovery Engine'}
                  </h2>
                </div>
                <span className="font-mc-mono text-xs bg-[#2A4413] text-[#89BD44] px-2 py-0.5 font-bold">
                  {isAr ? 'أكتوبر 2026 (نشط)' : 'October 2026 (Active)'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#4E4E4E] dark:text-[#CBD5E1] mb-4 leading-relaxed font-medium">
                {isAr
                  ? 'أكبر ترقية استكشافية نوعية في SeedLens: لم يعد المحرك يقتصر على الهياكل فقط، بل أصبح يفحص تضاريس العالم ثلاثية الأبعاد (3D Biome & Height Sampling) لاكتشاف أفضل المواقع الجغرافية المناسبة للبناء والاستقرار وأخذ لقطات سينمائية مهيبة.'
                  : 'A landmark enhancement: SeedLens now conducts high-speed 3D terrain and biome sampling across 10,000x10,000 blocks to identify scenic vistas and ideal base building locations.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#F472B6] font-bold mb-1">
                    <Trees className="w-4 h-4" />
                    <span>{isAr ? 'فوهات الكرز الجبلية' : 'Cherry Calderas'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'أودية دائرية محاطة بسلاسل جبلية مثلجة ومغطاة بأزهار الكرز.'
                      : 'Circular valleys enclosed by snowy peaks, blanketed with cherry blossoms.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#10B981] font-bold mb-1">
                    <Mountain className="w-4 h-4" />
                    <span>{isAr ? 'الفوهات الجبلية المحمية' : 'Mountain Crater Rings'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'مروج منخفضة محاطة بجدران جبلية شاهقة من كافة الاتجاهات كحصن طبيعي.'
                      : 'Deep alpine meadows fortified by steep peaks in all 4 directions.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#A855F7] font-bold mb-1">
                    <Camera className="w-4 h-4" />
                    <span>{isAr ? 'الجروف البانورامية الشاهقة' : 'Epic Clifftop Vistas'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'انحدارات صخرية سحيقة بفارق ارتفاع > 80 بلوكاً تطل على محيطات وبحار.'
                      : 'Dramatic sheer cliff drops > 80m overlooking oceans and plains.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold mb-1">
                    <Castle className="w-4 h-4" />
                    <span>{isAr ? 'أحواض البناء المستوية' : 'Prime Building Basins'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'أراضٍ سهلية مستوية شاسعة بجوار مياه وأشجار لبناء الممالك دون تسوية التضاريس.'
                      : 'Extensive flat terrain adjacent to water and lumber for sprawling bases.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#0284C7] font-bold mb-1">
                    <Waves className="w-4 h-4" />
                    <span>{isAr ? 'جزر النجاة المنعزلة' : 'Isolated Survival Islands'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'جزر نقية محاطة بمحيط عميق على مسافة ≥ 300م لعشاق تحديات النجاة الصعبة.'
                      : 'Secluded pristine islands enclosed by deep ocean for classic survival runs.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#17B85E] font-bold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>{isAr ? 'نقاط تقييم مزدوجة 0-100%' : 'Dual Scoring System'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'مؤشر جمالي (Scenic Score) ومؤشر للبناء (Building Score) مع حساب المسافة لنقطة البداية.'
                      : 'Algorithmic scenic & building ratings computed from biome diversity and slope variance.'}
                  </p>
                </div>
              </div>

              <div className="bg-[#B8B8B8] dark:bg-[#181B22] p-3 text-xs font-mc-mono border-t border-l border-[#FFFFFF] dark:border-[#303644] border-b border-r border-[#555555] dark:border-[#0E1015]">
                <span className="text-[#5B8731] font-bold">
                  {isAr ? '✓ الميزات البرمجية المضافة في الواجهة:' : '✓ Frontend Enhancements Added:'}
                </span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-[#333333] dark:text-[#CBD5E1]">
                  <li>{isAr ? 'بانر إشعاري بارز ومتحرك يظهر فور العثور على أماكن بناء مميزة.' : 'Prominent animated callout banner whenever prime building spots are detected.'}</li>
                  <li>{isAr ? 'تبويب موحد جديد: "عرض الكل معاً" يجمع العناقيد وأماكن البناء في قائمة واحدة.' : 'Unified view tab ("All Locations") combining both structures and building sites.'}</li>
                  <li>{isAr ? 'تعريب كامل وشامل لكافة بطاقات التحليل، المعايير الرياضية، ونوافذ التفاصيل.' : '100% Arabic localization for all cards, explanations, modals, and metric HUDs.'}</li>
                  <li>{isAr ? 'دبابيس خريطة تفاعلية Leaflet بأيقونات تعبيرية مخصصة وزر نسخ أمر الانتقال السريع.' : 'Interactive Leaflet pins with custom emojis and instant /tp clipboard buttons.'}</li>
                </ul>
              </div>
            </div>

            {/* Version 4.0 Card */}
            <div className="mc-gui-panel p-6 border-l-4 border-l-[#D97706] border-t-2 border-r-2 border-b-2">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-[#A8A8A8] dark:border-[#2E3342]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#D97706] text-white font-mc-heading text-xs font-bold shadow-[1px_1px_0_#78350F]">
                    v4.0
                  </span>
                  <h2 className="font-mc-heading text-lg font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                    {isAr
                      ? 'دعم تعدد الإصدارات واكتشاف غرف المحاكمة (Multi-Version & Trial Chambers)'
                      : 'Multi-Version Engine & Trial Chambers Discovery'}
                  </h2>
                </div>
                <span className="font-mc-mono text-xs bg-[#2A4413] text-[#89BD44] px-2 py-0.5 font-bold">
                  {isAr ? 'سبتمبر 2026' : 'September 2026'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#4E4E4E] dark:text-[#CBD5E1] mb-3 leading-relaxed font-medium">
                {isAr
                  ? 'توسيع المحرك ليدعم كافة إصدارات ماينكرافت الرسمية من 1.18 وحتى 1.21.4، مع إضافة غرف المحاكمة (Trial Chambers) وشاراتها النحاسية المميزة دون كسر توافقية النسخ السابقة.'
                  : 'Expanded the engine to support all Java editions from 1.18 to 1.21.4, integrating Trial Chambers generation rules and custom copper badges.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 font-mc-mono text-xs mb-3">
                <div className="p-2 bg-[#E2E2E2] dark:bg-[#181B22] border border-[#A8A8A8] dark:border-[#333842]">
                  <span className="text-[#D97706] font-bold">1.21.1 / 1.21.4:</span>
                  <p className="text-[11px] text-[#555555] dark:text-[#94A3B8]">{isAr ? 'غرف المحاكمة + الحديقة الشاحبة' : 'Trial Chambers + Pale Garden'}</p>
                </div>
                <div className="p-2 bg-[#E2E2E2] dark:bg-[#181B22] border border-[#A8A8A8] dark:border-[#333842]">
                  <span className="text-[#2CBAA8] font-bold">1.20.6 / 1.20:</span>
                  <p className="text-[11px] text-[#555555] dark:text-[#94A3B8]">{isAr ? 'آثار المسار + بساتين الكرز' : 'Trail Ruins + Cherry Groves'}</p>
                </div>
                <div className="p-2 bg-[#E2E2E2] dark:bg-[#181B22] border border-[#A8A8A8] dark:border-[#333842]">
                  <span className="text-[#5B8731] font-bold">1.19.4 / 1.18.2:</span>
                  <p className="text-[11px] text-[#555555] dark:text-[#94A3B8]">{isAr ? 'المدينة القديمة + كهوف التحديث الأول' : 'Ancient Cities + Caves & Cliffs'}</p>
                </div>
              </div>
            </div>

            {/* Version 3.1 Card */}
            <div className="mc-gui-panel p-6 border-l-4 border-l-[#5B8731] border-t-2 border-r-2 border-b-2">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-[#A8A8A8] dark:border-[#2E3342]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#5B8731] text-white font-mc-heading text-xs font-bold shadow-[1px_1px_0_#2A4413]">
                    v3.1
                  </span>
                  <h2 className="font-mc-heading text-lg font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                    {isAr
                      ? 'خط الأساس للعناقيد الهيكلية المفيدة (Useful Clusters Foundation)'
                      : 'Useful Structural Clusters Baseline'}
                  </h2>
                </div>
                <span className="font-mc-mono text-xs bg-[#4A4A4A] text-[#CBD5E1] px-2 py-0.5 font-bold">
                  {isAr ? 'خط الأساس المثبت' : 'Frozen Baseline'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#4E4E4E] dark:text-[#CBD5E1] mb-2 leading-relaxed font-medium">
                {isAr
                  ? 'الأساس الخوارزمي المعتمد في تصنيف وتجميع الهياكل الاستراتيجية عبر 5 فئات رئيسية: المركز الاستراتيجي الفائق، العاصمة التجارية، مركز الأعماق السحيق، بؤرة Spawn استراتيجية، والتجمع فائق الكثافة. تم حفظه كخط أساس غير قابل للكسر بنسبة 100% حرفياً (Bit-Identical).'
                  : 'The proven baseline algorithm classifying clusters across 5 strategic archetypes within [-5000, 5000] perimeter.'}
              </p>
            </div>
          </div>
        )}

        {/* SECTION 2: Technical Architecture */}
        {activeSection === 'architecture' && (
          <div className="mc-gui-panel p-6 sm:p-8 space-y-6 animate-fade-in border-2 border-[#2563EB]">
            <div className="flex items-center gap-3 pb-3 border-b border-[#A8A8A8] dark:border-[#2E3342]">
              <div className="w-10 h-10 bg-[#2563EB] border-2 border-[#60A5FA] border-b-[#1E40AF] border-r-[#1E40AF] flex items-center justify-center text-white shadow-[1px_1px_0_#000] shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-mc-heading text-xl font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                  {isAr ? 'المعمارية التقنية وتدفق البيانات في SeedLens' : 'Technical Architecture & Pipeline'}
                </h2>
                <p className="text-xs text-[#555555] dark:text-[#94A3B8] font-mc-mono">
                  Input → Cubiomes → Spatial Clusterer → Heuristics → JSON API → Leaflet GIS
                </p>
              </div>
            </div>

            {/* Pipeline Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="mc-slot p-4">
                <span className="text-[#FADB44] font-mc-mono font-bold block mb-1">STAGE 01</span>
                <h3 className="font-mc-heading font-bold text-sm text-white mb-2">
                  {isAr ? 'التحقق وحل البذور والإصدارات' : 'Validation & Version Resolution'}
                </h3>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'استقبال البذرة (سواء كانت رقماً سالباً أو موجباً 64-بت أو نصاً عادياً يتم تحويله بدالة hashCode لماينكرافت جافا) وتحديد الإصدار المطلوب عبر VersionProfile.'
                    : 'Resolves raw 64-bit seed numbers or text strings via standard Java String.hashCode(), routing generation to the appropriate version profile.'}
                </p>
              </div>

              <div className="mc-slot p-4">
                <span className="text-[#17B85E] font-mc-mono font-bold block mb-1">STAGE 02</span>
                <h3 className="font-mc-heading font-bold text-sm text-white mb-2">
                  {isAr ? 'التوليد القطعي وفحص التضاريس' : 'Deterministic Simulation & 3D Biome Sampling'}
                </h3>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'مسح نطاق 10 آلاف بلوك (±5000 م) لاستخراج مواقع القرى والمدن القديمة وغرف المحاكمة، وبالتوازي فحص تضاريس العالم لاكتشاف فوهات الكرز والأحواض المستوية.'
                    : 'Scans the 10,000 block perimeter for structure generation points, while landmarks.c concurrently evaluates 3D biome caldera rings and flat basins.'}
                </p>
              </div>

              <div className="mc-slot p-4">
                <span className="text-[#2CBAA8] font-mc-mono font-bold block mb-1">STAGE 03</span>
                <h3 className="font-mc-heading font-bold text-sm text-white mb-2">
                  {isAr ? 'خوارزمية التجميع المكاني متعددة المراحل' : 'Multi-Pass Spatial Clustering'}
                </h3>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'تجميع الهياكل المتقاربة ضمن نصف قطر 500م، مع حساب المركز الهندسي، القطر المحيط الأقصى، وأقرب مسافة بين زوج هياكل.'
                    : 'Groups candidate structures within a 500m proximity threshold, calculating exact bounding diameters and nearest pairwise distances.'}
                </p>
              </div>

              <div className="mc-slot p-4">
                <span className="text-[#EC4899] font-mc-mono font-bold block mb-1">STAGE 04</span>
                <h3 className="font-mc-heading font-bold text-sm text-white mb-2">
                  {isAr ? 'التقييم الاستراتيجي والعرض التفاعلي' : 'Heuristic Evaluation & Interactive GIS'}
                </h3>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'تطبيق القواعد الرياضية لتصنيف العواصم التجارية والمراكز الاستراتيجية وتصدير مخرجات JSON فائقة النقاء لعرضها على خريطة Leaflet والبطاقات التفاعلية.'
                    : 'Applies rigorous heuristic criteria to classify archetypes, outputting structured JSON serialized directly to Next.js Leaflet interactive view.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: FAQ & Commands */}
        {activeSection === 'faq' && (
          <div className="mc-gui-panel p-6 sm:p-8 space-y-6 animate-fade-in border-2 border-[#A855F7]">
            <div className="flex items-center gap-3 pb-3 border-b border-[#A8A8A8] dark:border-[#2E3342]">
              <div className="w-10 h-10 bg-[#A855F7] border-2 border-[#C084FC] border-b-[#6B21A8] border-r-[#6B21A8] flex items-center justify-center text-white shadow-[1px_1px_0_#000] shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-mc-heading text-xl font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                  {isAr ? 'الأسئلة الشائعة ودليل أوامر الانتقال السريع' : 'FAQ & Quick Teleport Commands'}
                </h2>
                <p className="text-xs text-[#555555] dark:text-[#94A3B8] font-mc-mono">
                  Minecraft Teleport Syntax & Troubleshooting
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                <h3 className="font-mc-heading text-sm font-bold text-[#5B8731] uppercase mb-1">
                  {isAr ? 'كيف أنتقل فوراً إلى أي موقع أو مكان بناء داخل اللعبة؟' : 'How do I teleport to discovered locations in-game?'}
                </h3>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed mb-2">
                  {isAr
                    ? 'في بطاقة أي عنقود أو مكان بناء، اضغط على زر نسخ أمر الانتقال (/tp)، ثم افتح نافذة الدردشة (T) في ماينكرافت واضغط (Ctrl + V) ثم Enter.'
                    : 'Click the copy /tp button on any cluster or landmark card, then paste (Ctrl + V) into the Minecraft chat console.'}
                </p>
                <div className="mc-slot p-2 text-xs font-mc-mono text-[#FADB44] flex items-center justify-between">
                  <span>/tp @s 1240 135 -480</span>
                  <span className="text-[10px] text-[#A8A8A8]">{isAr ? '(مثال للانتقال المباشر)' : '(Example)'}</span>
                </div>
              </div>

              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                <h3 className="font-mc-heading text-sm font-bold text-[#5B8731] uppercase mb-1">
                  {isAr ? 'لماذا يختلف توليد العالم بين إصدارات ماينكرافت؟' : 'Why do world layouts change between Minecraft versions?'}
                </h3>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'تقوم شركة Mojang بتحديث خوارزميات التوليد مع كل تحديث رئيسي؛ مثلاً أضاف تحديث 1.19 المدن القديمة العميقة، وأضاف تحديث 1.20 بساتين الكرز وآثار المسار، بينما أضاف تحديث 1.21 غرف المحاكمة. لذلك يوفر SeedLens قائمة منسدلة لاختيار إصدارك بدقة.'
                    : 'Mojang frequently updates generation tables with new structures and biomes. SeedLens offers full multi-version profiles to simulate the exact generation rules of each version.'}
                </p>
              </div>

              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                <h3 className="font-mc-heading text-sm font-bold text-[#5B8731] uppercase mb-1">
                  {isAr ? 'هل يدعم SeedLens إصدار ماينكرافت بيدروك (Bedrock)؟' : 'Does SeedLens support Minecraft Bedrock Edition?'}
                </h3>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'نواة البيومات والتضاريس متطابقة تقريباً بين جافا وبيدروك منذ تحديث 1.18 بفضل الـ Parity، لكن مواقع الهياكل الصغرى قد تختلف قليلاً. صُمم SeedLens ومُعاير حصرياً لدقة ماينكرافت جافا 100%.'
                    : 'Biomes largely match Bedrock via terrain parity, but structure placements differ. SeedLens is strictly calibrated for Minecraft Java edition.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
