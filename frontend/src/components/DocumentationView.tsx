'use client';

import React, { useState, useEffect } from 'react';
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
  Search,
  Sliders,
  Share2,
  Download,
  KeyRound,
  Eye,
  Crown,
  Flame,
  Coins,
  Scale,
  Bookmark,
  ArrowLeftRight,
  Image as ImageIcon,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type DocSection = 'changelog' | 'compare_vault' | 'wishlist' | 'map_bedrock' | 'architecture' | 'faq';

const NAV_ITEMS: {
  id: DocSection;
  label: { ar: string; en: string };
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: 'changelog',
    label: { ar: 'سجل التحديثات (Changelog)', en: 'Full Changelog' },
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: '#5B8731',
  },
  {
    id: 'compare_vault',
    label: { ar: 'مقارنة البذور والمستودع', en: 'Comparison & Vault' },
    icon: <Scale className="w-3.5 h-3.5" />,
    color: '#0284C7',
  },
  {
    id: 'wishlist',
    label: { ar: 'محرك البحث العكسي وأنماط RPG', en: 'Reverse Finder & RPG' },
    icon: <Search className="w-3.5 h-3.5" />,
    color: '#D97706',
  },
  {
    id: 'map_bedrock',
    label: { ar: 'الخريطة وتكافؤ البيدروك', en: 'Map HUD & Bedrock Parity' },
    icon: <Compass className="w-3.5 h-3.5" />,
    color: '#059669',
  },
  {
    id: 'architecture',
    label: { ar: 'المعمارية التقنية ومحرك C', en: 'Engine Architecture' },
    icon: <Cpu className="w-3.5 h-3.5" />,
    color: '#2563EB',
  },
  {
    id: 'faq',
    label: { ar: 'الأسئلة الشائعة والأوامر', en: 'FAQ & Commands' },
    icon: <HelpCircle className="w-3.5 h-3.5" />,
    color: '#A855F7',
  },
];

export default function DocumentationView() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const [activeSection, setActiveSection] = useState<DocSection>('changelog');

  useEffect(() => {
    const sectionIds: DocSection[] = [
      'changelog',
      'compare_vault',
      'wishlist',
      'map_bedrock',
      'architecture',
      'faq',
    ];

    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '') as DocSection;
      if (sectionIds.includes(hash)) {
        setActiveSection(hash);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible && sectionIds.includes(visible.target.id as DocSection)) {
          setActiveSection(visible.target.id as DocSection);
        }
      },
      {
        rootMargin: '-15% 0px -65% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: DocSection) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#C6C6C6] dark:bg-[#12141A] text-[#1E1E1E] dark:text-[#E2E8F0] transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-[#A8A8A8] dark:border-[#2E3342] font-mc-mono text-xs">
          <Link
            href={isAr ? '/ar' : '/en'}
            className="mc-button px-3 py-1.5 flex items-center gap-1.5 font-bold hover:text-[#5B8731] cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isAr ? 'العودة إلى المحلل الرئيسي' : 'Back to Analyzer'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#17B85E] shadow-[0_0_6px_#17B85E]"></span>
            <span className="font-bold text-[#555555] dark:text-[#94A3B8]">
              {isAr ? 'وثيقة مرجعية v4.3 (مقارنة البذور، مستودع المجتمع، والمعاينات)' : 'Documentation Reference v4.3 (Seed Comparison, Vault & Previews)'}
            </span>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="mc-gui-panel p-6 sm:p-8 mb-8 border-2 border-[#FFFFFF] dark:border-[#363B47] shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#866043] text-[#FADB44] font-mc-mono text-[11px] font-bold mb-3 border-t-2 border-l-2 border-[#A87954] border-b-2 border-r-2 border-[#4E3523]">
                <FileText className="w-3.5 h-3.5" />
                <span>{isAr ? 'دليل التوثيق وسجل التحديثات الشامل' : 'OFFICIAL DOCUMENTATION & CHANGELOG'}</span>
              </div>
              <h1 className="font-mc-heading text-2xl sm:text-3xl md:text-4xl text-[#1E1E1E] dark:text-[#F1F5F9] font-bold uppercase tracking-tight">
                {isAr ? 'الدليل الشامل لمنصة ' : 'Everything about '}
                <span className="text-[#5B8731]">SeedLens</span>
              </h1>
              <p className="text-sm sm:text-base text-[#4E4E4E] dark:text-[#CBD5E1] mt-2 max-w-3xl leading-relaxed">
                {isAr
                  ? 'دليل مرجعي تفصيلي يغطي مقارنة البذور جنباً إلى جنب، مستودع بذور المجتمع والمفضلة، محرك البحث العكسي (Reverse Seed Finder)، أنماط RPG، معاينات المعالم المتناسبة مع النت، تكافؤ البيدروك، وتصدير الخرائط والبطاقات البريدية.'
                  : 'Comprehensive guide covering Seed vs Seed Comparison, Community Vault & Bookmarks, Reverse Seed Finder, RPG Presets, Bandwidth-Friendly Previews, Bedrock Parity, and GIS Engine.'}
              </p>
            </div>

            <div className="mc-slot p-4 text-xs font-mc-mono text-center sm:text-start shrink-0">
              <div className="text-[#94A3B8] text-[10px] uppercase font-bold mb-1">
                {isAr ? 'الإصدار النشط حالياً' : 'Current Active Release'}
              </div>
              <div className="text-[#FADB44] font-bold text-lg font-mc-heading">SeedLens v4.3</div>
              <div className="text-[#17B85E] text-[11px] font-bold mt-1">
                ● Comparison, Vault & Previews
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Table of Contents Navigation Bar */}
        <div className="sticky top-2 z-20 backdrop-blur-md bg-[#C6C6C6]/95 dark:bg-[#12141A]/95 p-3 mb-8 border-2 border-[#FFFFFF] dark:border-[#363B47] shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
          <nav aria-label="Documentation sections" className="flex flex-wrap items-center gap-2 font-mc-heading text-xs">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`px-3 py-1.5 flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'text-white shadow-[2px_2px_0_rgba(0,0,0,0.5)]'
                      : 'mc-button text-[#333333] dark:text-[#E2E8F0]'
                  }`}
                  style={isActive ? { backgroundColor: item.color } : undefined}
                >
                  {item.icon}
                  <span>{isAr ? item.label.ar : item.label.en}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* All Documentation Sections (Continuously Rendered for Crawlers & Deep-Linking) */}
        <div className="space-y-10">
          {/* SECTION 1: Full Changelog */}
          <section id="changelog" aria-labelledby="heading-changelog" className="space-y-6 scroll-mt-24">
            {/* Version 4.3 Card (Latest Active Release) */}
            <div className="mc-gui-panel p-6 border-l-4 border-l-[#0284C7] border-t-2 border-r-2 border-b-2">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-[#A8A8A8] dark:border-[#2E3342]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#0284C7] text-white font-mc-heading text-xs font-bold shadow-[1px_1px_0_#075985]">
                    v4.3
                  </span>
                  <h2 className="font-mc-heading text-lg font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                    {isAr
                      ? 'مقارنة البذور جنباً إلى جنب، مستودع المجتمع والمفضلة، ومعاينات WebP الخفيفة'
                      : 'Seed vs Seed Comparison, Community Vault & Bookmarks, Bandwidth-Friendly Previews'}
                  </h2>
                </div>
                <span className="font-mc-mono text-xs bg-[#2A4413] text-[#89BD44] px-2 py-0.5 font-bold">
                  {isAr ? 'أكتوبر 2026 (الإصدار النشط الأحدث)' : 'October 2026 (Latest Active)'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#4E4E4E] dark:text-[#CBD5E1] mb-4 leading-relaxed font-medium">
                {isAr
                  ? 'ترقية استكشافية متقدمة تضيف ميزة مقارنة بذرتين في شاشة واحدة ومصفوفة مقاييس تقابلية مع توصيات أسلوب اللعب الذكية، ومستودع بذور المجتمع والمفضلة المحلية مع تصدير واستيراد JSON، ومكتبة معاينات المعالم والهياكل بصيغة WebP القياسية خفيفة الحجم (10-45 كيلوبايت) المتناسبة مع سرعة وباقة نت المستخدم مع خطة استرجاع تلقائية للرسومات المتجهية.'
                  : 'Advanced expansion delivering side-by-side seed comparison with RPG playstyle recommendations, community vault with bookmark persistence & JSON export/import, and bandwidth-friendly WebP preview library (10-45KB) with instant SVG fallback.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#0284C7] font-bold mb-1">
                    <Scale className="w-4 h-4" />
                    <span>{isAr ? 'مقارنة البذور جنباً إلى جنب' : 'Seed vs Seed Comparison'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'وضع بذرتين معاً ومقارنة كثافة الهياكل، نقاط البناء، المناظر الطبيعية، وقرب الـ Spawn مع تحديد الفائز بشارة 👑.'
                      : 'Simultaneous comparison across clusters, landmarks, trial chambers, and building scores with winner crowns.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold mb-1">
                    <Crown className="w-4 h-4" />
                    <span>{isAr ? 'توصيات أسلوب اللعب الذكي' : 'Smart Playstyle Advice'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'تحليل ذكي يوصيك بالبذرة الأنسب لـ: الملك البنّاء (Mega-Builder)، صائد الأقبية (Dungeon Raider)، وصانع السينما (Aesthetic Creator).'
                      : 'Recommends the ideal seed based on your desired playstyle: Mega-Builder, Dungeon Raider, or Aesthetic Creator.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#10B981] font-bold mb-1">
                    <Bookmark className="w-4 h-4" />
                    <span>{isAr ? 'مستودع المجتمع والمفضلة' : 'Community Vault & Bookmarks'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'حفظ أي بذرة بنقرة واحدة ⭐ في مفضلة المتصفح، مع بنك بذور أسبوعية موثقة ومصنفة جاهزة للاستكشاف الفوري.'
                      : 'Bookmark any seed to localStorage with one click, explore curated weekly seeds, and load them instantly.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#8B5CF6] font-bold mb-1">
                    <Download className="w-4 h-4" />
                    <span>{isAr ? 'تصدير واستيراد المفضلة JSON' : 'Export & Import JSON'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'نسخ احتياطي لمفضلتك ومشاركتها مع أصدقائك عبر ملف JSON خفيف يُستورد بضغطة زر واحدة.'
                      : 'Backup and share your bookmarked seeds with friends via clean JSON files.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#EC4899] font-bold mb-1">
                    <ImageIcon className="w-4 h-4" />
                    <span>{isAr ? 'معاينات WebP خفيفة للنت' : 'Bandwidth-Friendly Previews'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'صور حقيقية للمعالم والهياكل مضغوطة بعناية (10-45 كيلوبايت) لتناسب باقات النت وتعمل بسلاسة تامة مع استرجاع SVG.'
                      : 'Curated standard-quality WebP screenshots (10-45KB) that load instantly without wasting mobile data.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#14B8A6] font-bold mb-1">
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>{isAr ? 'النقل المباشر للمحلل والخريطة' : 'Direct Load to Analyzer'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'زر تحميل مباشر لتحويل البذرة الفائزة من شاشة المقارنة أو المستودع إلى شاشة التحليل والخريطة دون كتابتها يدوياً.'
                      : 'One-click action to load winning seeds directly into the comprehensive analyzer and interactive map.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Version 4.2 Card */}
            <div className="mc-gui-panel p-6 border-l-4 border-l-[#F59E0B] border-t-2 border-r-2 border-b-2">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-[#A8A8A8] dark:border-[#2E3342]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#F59E0B] text-black font-mc-heading text-xs font-bold shadow-[1px_1px_0_#78350F]">
                    v4.2
                  </span>
                  <h2 className="font-mc-heading text-lg font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                    {isAr
                      ? 'محرك البحث العكسي، أنماط RPG، وتكافؤ البيدروك الشامل'
                      : 'Reverse Seed Finder, RPG Presets, Map HUD & Bedrock Parity'}
                  </h2>
                </div>
                <span className="font-mc-mono text-xs bg-[#4A4A4A] text-[#CBD5E1] px-2 py-0.5 font-bold">
                  {isAr ? 'أكتوبر 2026' : 'October 2026'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#4E4E4E] dark:text-[#CBD5E1] mb-4 leading-relaxed font-medium">
                {isAr
                  ? 'نقلة ثورية تُحول المنصة من مجرد محلل للبذور المدخلة إلى صانع عوالم ذكي حسب الطلب: يحدد اللاعب رغباته ومواصفات عالمه، فيقوم محرك C الموازي باستخراج البذرة المثالية مع إحداثيات الانتقال في أجزاء من الثانية.'
                  : 'Transforming SeedLens from a passive seed analyzer to an active world architect. Specify desired landscape criteria, and the blazing C engine discovers matching seeds in milliseconds.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold mb-1">
                    <Search className="w-4 h-4" />
                    <span>{isAr ? 'البحث العكسي فائق السرعة' : 'Blazing Fast Reverse Finder'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'فحص آلاف البذور في الخلفية عبر C Fast-Reject Early-Exit واستخراج البذرة المطابقة لمواصفاتك في 10-50 مللي ثانية.'
                      : 'Evaluates thousands of seeds per second using multi-threaded C pipeline with immediate exit heuristics.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#EC4899] font-bold mb-1">
                    <Crown className="w-4 h-4" />
                    <span>{isAr ? '5 أنماط لعب RPG جاهزة' : '5 Ready RPG Presets'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'الملك البنّاء، صائد الأقبية، صانع السينما، المحاصر المنعزل، والتاجر الإمبراطوري بضغطة زر واحدة.'
                      : 'Curated archetypes: Mega-Builder, Dungeon Raider, Aesthetic Creator, Castaway Survivor, and Economy Mogul.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#10B981] font-bold mb-1">
                    <Compass className="w-4 h-4" />
                    <span>{isAr ? 'تصدير نقاط العلام (Waypoints)' : 'Waypoints Mod Exporter'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'تصدير ملفات جاهزة لمودات Xaero\'s Minimap و JourneyMap لترى المعالم كدبابيس مشعة داخل لعبتك مباشرة.'
                      : 'Exports ready-to-use waypoint files for Xaero\'s and JourneyMap to see markers in-game.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#3B82F6] font-bold mb-1">
                    <Share2 className="w-4 h-4" />
                    <span>{isAr ? 'بطاقة بريد ماينكرافت السينمائية' : 'Minecraft Postcard Generator'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'توليد بطاقة بريدية عالية الجودة بصيغة PNG لمشاركة بذورك الأسطورية مع أصدقائك على Discord و Reddit.'
                      : 'Generates high-resolution aesthetic pixel-art postcards ready to download and share.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#14B8A6] font-bold mb-1">
                    <Layers className="w-4 h-4" />
                    <span>{isAr ? 'وضع تكافؤ البيدروك (Bedrock Parity)' : 'Bedrock Parity Mode'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'مفتاح تبديل للنسخة يوضح تطابق التضاريس والبحيرات والبيومات 100% بين جافا وبيدروك بفضل Caves & Cliffs.'
                      : 'Direct toggle explaining 100% terrain and biome parity between Java and Bedrock editions.'}
                  </p>
                </div>

                <div className="mc-slot p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#8B5CF6] font-bold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isAr ? 'لوحة العمليات والتحليلات الآمنة' : 'Secure Operations Portal'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr
                      ? 'لوحة إدارة وتحليلات ميدانية برمز PIN مخصص قابل للتغيير مع تتبع واقعي ونظيف للزوار والفحوصات.'
                      : 'Protected operations dashboard with changeable PIN, real-time telemetry, and audit counters.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Version 4.1 Card */}
            <div className="mc-gui-panel p-6 border-l-4 border-l-[#EC4899] border-t-2 border-r-2 border-b-2">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-[#A8A8A8] dark:border-[#2E3342]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#EC4899] text-white font-mc-heading text-xs font-bold shadow-[1px_1px_0_#831843]">
                    v4.2
                  </span>
                  <h2 className="font-mc-heading text-lg font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                    {isAr
                      ? 'محرك استكشاف أماكن البناء والمناظر الطبيعية الخلابة (Scenic & Building Spots)'
                      : 'Scenic & Prime Building Spots Discovery Engine'}
                  </h2>
                </div>
                <span className="font-mc-mono text-xs bg-[#4A4A4A] text-[#CBD5E1] px-2 py-0.5 font-bold">
                  {isAr ? 'سبتمبر 2026' : 'September 2026'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#4E4E4E] dark:text-[#CBD5E1] mb-3 leading-relaxed font-medium">
                {isAr
                  ? 'ترقية استكشافية نوعية: فحص تضاريس العالم ثلاثية الأبعاد (3D Biome & Height Sampling) لاكتشاف فوهات الكرز، الفوهات المحصنة، الجروف، أحواض البناء المستوية، وجزر النجاة المنعزلة مع تقييم Scenic و Building من 0 إلى 100%.'
                  : '3D terrain sampling across 10,000 blocks to identify Cherry Calderas, Crater Rings, Clifftops, Basins, and Survival Islands.'}
              </p>
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
                <span className="font-mc-mono text-xs bg-[#4A4A4A] text-[#CBD5E1] px-2 py-0.5 font-bold">
                  {isAr ? 'أغسطس 2026' : 'August 2026'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#4E4E4E] dark:text-[#CBD5E1] mb-2 leading-relaxed font-medium">
                {isAr
                  ? 'توسيع المحرك ليدعم كافة إصدارات ماينكرافت الرسمية من 1.18 وحتى 1.21.4 (Winter Drop)، مع إضافة غرف المحاكمة (Trial Chambers) وشاراتها النحاسية المميزة دون المساس بعناقيد v3.1.'
                  : 'Expanded support from 1.18 to 1.21.4, integrating Trial Chambers and copper badges without altering baseline clusters.'}
              </p>
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
          </section>

          {/* SECTION 2: Compare & Vault Guide */}
          <section id="compare_vault" aria-labelledby="heading-compare_vault" className="mc-gui-panel p-6 sm:p-8 space-y-6 border-2 border-[#0284C7] scroll-mt-24">
            <div className="flex items-center gap-3 pb-3 border-b border-[#A8A8A8] dark:border-[#2E3342]">
              <div className="w-10 h-10 bg-[#0284C7] border-2 border-[#38BDF8] border-b-[#075985] border-r-[#075985] flex items-center justify-center text-white shadow-[1px_1px_0_#000] shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 id="heading-compare_vault" className="font-mc-heading text-xl font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                  {isAr ? 'دليل مقارنة البذور ومستودع المجتمع والمفضلة' : 'Seed Comparison, Community Vault & Bookmarks'}
                </h2>
                <p className="text-xs text-[#555555] dark:text-[#94A3B8] font-mc-mono">
                  Side-by-Side Dual Matrix • Smart RPG Advice • Weekly Seeds • JSON Backup • WebP Previews
                </p>
              </div>
            </div>

            {/* Sub-section 1: Dual Seed Comparison */}
            <div>
              <h3 className="font-mc-heading text-sm font-bold text-[#0284C7] mb-2 flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>{isAr ? '1. مقارنة البذور جنباً إلى جنب (Dual Seed Comparison)' : '1. Dual Seed Comparison'}</span>
              </h3>
              <p className="text-xs text-[#4E4E4E] dark:text-[#CBD5E1] leading-relaxed mb-3">
                {isAr
                  ? 'أداة فريدة تضع بذرتين وجهاً لوجه في شاشة واحدة: تقوم المنصة بتحليل كلا العالمين بالتوازي وبأقصى سرعة، ثم تعرض مصفوفة إحصائية تقارن بينهما في كافة المقاييس الجوهرية:'
                  : 'Compare two seeds face-to-face on a single screen with parallel execution and comparative metric bars:'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-4">
                <div className="mc-slot p-3">
                  <span className="text-[#FADB44] font-bold block mb-1">🏰 {isAr ? 'العناقيد الاستراتيجية' : 'Strategic Clusters'}</span>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr ? 'مقارنة عدد العناقيد المفيدة (القرى، المعابد، والمراكز الهيكلية) المتواجدة في نطاق الـ 5000م.' : 'Total useful clusters (villages, temples, mega hubs) within the perimeter.'}
                  </p>
                </div>

                <div className="mc-slot p-3">
                  <span className="text-[#10B981] font-bold block mb-1">⭐ {isAr ? 'المعالم وأماكن البناء' : 'Scenic Spots'}</span>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr ? 'مقارنة أعلى درجات ملاءمة البناء (Building Score) ونسبة الجمالية التضاريسية (Scenic Score).' : 'Evaluates maximum building ease and cinematic vista scores.'}
                  </p>
                </div>

                <div className="mc-slot p-3">
                  <span className="text-[#EC4899] font-bold block mb-1">⚔️ {isAr ? 'غرف المحاكمة والهياكل' : 'Trial Chambers & Loot'}</span>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr ? 'مقارنة توافر غرف المحاكمة، المدن القديمة، والقصور لتحديد العالم الأنسب للقتال والنهب السريع.' : 'Compares counts of Trial Chambers and Ancient Cities for combat.'}
                  </p>
                </div>

                <div className="mc-slot p-3">
                  <span className="text-[#38BDF8] font-bold block mb-1">🎯 {isAr ? 'قرب الـ Spawn' : 'Spawn Proximity'}</span>
                  <p className="text-[#CBD5E1] text-[11px]">
                    {isAr ? 'أيهما يوفر هيكلاً أو قرية أقرب إلى نقطة البداية لتسهيل أول ليلة في عالم النجاة.' : 'Measures which seed offers immediate structures near the world spawn.'}
                  </p>
                </div>
              </div>

              {/* Recommendation explanation */}
              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342] text-xs">
                <h4 className="font-mc-heading text-xs font-bold text-[#F59E0B] uppercase mb-1 flex items-center gap-1.5">
                  <Crown className="w-4 h-4" />
                  <span>{isAr ? 'نظام التوصية الذكية لأسلوب اللعب (Smart RPG Advice)' : 'Smart RPG Recommendation Engine'}</span>
                </h4>
                <p className="text-[#333333] dark:text-[#CBD5E1] leading-relaxed mb-2">
                  {isAr
                    ? 'بعد استكمال المقارنة، لا تتركك المنصة محتاراً بين الأرقام! يقوم المحرك بتحليل الفوارق الإحصائية وترشيح البذرة الفائزة وتبرير السبب بناءً على أسلوب لعبك:'
                    : 'The comparison engine synthesizes statistical differences to provide actionable recommendations for your playstyle:'}
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#4E4E4E] dark:text-[#CBD5E1] font-mc-mono text-[11px]">
                  <li><strong className="text-[#F59E0B]">{isAr ? 'خيار الملك البنّاء (Mega-Builder):' : 'Mega-Builder:'}</strong> {isAr ? 'يرشح البذرة التي تملك أعلى مؤشر استواء أرض (Building Score) مع أحواض خضراء شاسعة.' : 'Favors the seed with higher building score and prime flat basins.'}</li>
                  <li><strong className="text-[#EF4444]">{isAr ? 'خيار صائد الأقبية (Dungeon Raider):' : 'Dungeon Raider:'}</strong> {isAr ? 'يرشح البذرة التي تملك غرف محاكمة ومراكز أعماق أقرب للـ Spawn.' : 'Favors early combat structures and Trial Chambers.'}</li>
                  <li><strong className="text-[#EC4899]">{isAr ? 'خيار صانع السينما (Aesthetic Creator):' : 'Aesthetic Creator:'}</strong> {isAr ? 'يرشح البذرة التي تتفوق في درجات الـ Scenic Score وفوهات الكرز الساحرة.' : 'Favors peak scenic scores and cherry calderas for media creators.'}</li>
                </ul>
              </div>
            </div>

            {/* Sub-section 2: Community Vault & Bookmarks */}
            <div className="pt-2 border-t border-[#A8A8A8] dark:border-[#2E3342]">
              <h3 className="font-mc-heading text-sm font-bold text-[#10B981] mb-2 flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span>{isAr ? '2. مستودع بذور المجتمع والمفضلة المحلية (Community Vault & Bookmarks)' : '2. Community Vault & Local Bookmarks'}</span>
              </h3>
              <p className="text-xs text-[#4E4E4E] dark:text-[#CBD5E1] leading-relaxed mb-3">
                {isAr
                  ? 'مستودع متكامل متاح عبر زر [🏛️ مستودع البذور] يتيح لك حفظ ومشاركة واكتشاف أفضل بذور ماينكرافت دون الحاجة لحساب أو تسجيل دخول:'
                  : 'A complete seed vault accessible via the [🏛️ Community Vault] button for saving, sharing, and discovering verified seeds:'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-3">
                <div className="mc-slot p-3.5">
                  <div className="flex items-center gap-1.5 text-[#10B981] font-bold mb-1">
                    <Bookmark className="w-4 h-4" />
                    <span>{isAr ? 'حفظ المفضلة بنقرة واحدة' : 'One-Click Bookmarks'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    {isAr
                      ? 'في أي وقت تفحص فيه بذرة تعجبك، اضغط على زر [⭐ حفظ في المفضلة] في شريط النتائج لتُخزن في متصفحك (localStorage) فوراً للرجوع إليها في أي وقت.'
                      : 'Click [⭐ Bookmark Seed] in the results bar to instantly persist favorite seeds in your browser.'}
                  </p>
                </div>

                <div className="mc-slot p-3.5">
                  <div className="flex items-center gap-1.5 text-[#8B5CF6] font-bold mb-1">
                    <Download className="w-4 h-4" />
                    <span>{isAr ? 'تصدير واستيراد JSON' : 'Export & Import JSON'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    {isAr
                      ? 'يمكنك تنزيل كافة مفضلتك كملف JSON لنسخها احتياطياً أو استيراد بذور أصدقائك بضغطة زر دون أي فقدان للبيانات.'
                      : 'Download your bookmarked collection as JSON or import shared seed collections effortlessly.'}
                  </p>
                </div>

                <div className="mc-slot p-3.5">
                  <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold mb-1">
                    <Crown className="w-4 h-4" />
                    <span>{isAr ? 'بذور المجتمع الموثقة' : 'Curated Community Seeds'}</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    {isAr
                      ? 'كتالوج جاهز لبذور أسطورية مثبتة رياضياً (عاصمة تجارية، غرف محاكمة سريعة، فوهات كرز شاهقة، والحديقة الشاحبة Pale Garden) مع أوامر /tp وزر فحص فوري.'
                      : 'Curated library of proven seeds with direct /tp coordinates and instant one-click analysis.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-section 3: Bandwidth-Friendly Screenshot Previews */}
            <div className="pt-2 border-t border-[#A8A8A8] dark:border-[#2E3342]">
              <h3 className="font-mc-heading text-sm font-bold text-[#EC4899] mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>{isAr ? '3. مكتبة المعاينات المصورة الخفيفة المتناسبة مع سرعة النت (Bandwidth-Friendly Previews)' : '3. Bandwidth-Friendly Image Previews'}</span>
              </h3>
              <p className="text-xs text-[#4E4E4E] dark:text-[#CBD5E1] leading-relaxed mb-3">
                {isAr
                  ? 'تم تصميم مكتبة المعاينات المصورة لتقديم مظهر جمالي سينمائي داخل بطاقات المعالم وبطاقات الهوفر في الخريطة مع الالتزام الصارم بـ عدم استهلاك باقة وبيانات إنترنت المستخدم:'
                  : 'Curated in-game visual previews for landmarks and map hover cards, strictly engineered to preserve user mobile data and load instantly on any network:'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mc-mono">
                <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                  <h4 className="font-mc-heading text-xs font-bold text-[#EC4899] uppercase mb-1">
                    {isAr ? 'ضغط WebP القياسي عالي الكفاءة' : 'Optimized WebP Standard Quality'}
                  </h4>
                  <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed">
                    {isAr
                      ? 'تم ضغط كافة لقطات الشاشة الحقيقية من داخل اللعبة بصيغة WebP الحديثة بدقة ملائمة، حيث يتراوح حجم الصورة الواحدة بين 10 إلى 45 كيلوبايت فقط! هذا يعني أن تصفح عشرات المعالم يستهلك أقل من 1 ميجابايت من الإنترنت، مما يضمن سرعة فتح فائقة حتى على اتصالات 3G و 4G.'
                      : 'All in-game previews are compressed to modern WebP format (10KB–45KB). Browsing dozens of spots consumes less than 1MB of bandwidth.'}
                  </p>
                </div>

                <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                  <h4 className="font-mc-heading text-xs font-bold text-[#10B981] uppercase mb-1">
                    {isAr ? 'نظام الرجوع الآمن للرسومات المتجهية (SVG Fallback)' : 'Graceful Vector SVG Fallback'}
                  </h4>
                  <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed">
                    {isAr
                      ? 'في حال ضعف أو انقطاع الاتصال أو تفعيل المستخدم لوضع توفير البيانات الصارم، ترجع الواجهة برمجياً وبشكل فوري وتلقائي (Graceful Degradation) إلى الرسومات المتجهية SVG الخفيفة والمدمجة في الكود، لضمان استمرار عمل الخريطة والبطاقات بلا أي توقف.'
                      : 'If network connectivity drops, components automatically fallback to inline procedural SVG vector graphics with zero delay.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Wishlist & RPG Presets Guide */}
          <section id="wishlist" aria-labelledby="heading-wishlist" className="mc-gui-panel p-6 sm:p-8 space-y-6 border-2 border-[#D97706] scroll-mt-24">
            <div className="flex items-center gap-3 pb-3 border-b border-[#A8A8A8] dark:border-[#2E3342]">
              <div className="w-10 h-10 bg-[#D97706] border-2 border-[#F59E0B] border-b-[#78350F] border-r-[#78350F] flex items-center justify-center text-white shadow-[1px_1px_0_#000] shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 id="heading-wishlist" className="font-mc-heading text-xl font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                  {isAr ? 'دليل محرك البحث العكسي واستمارة رغبات العالم' : 'Reverse Seed Finder & RPG Playstyle Guide'}
                </h2>
                <p className="text-xs text-[#555555] dark:text-[#94A3B8] font-mc-mono">
                  Wishlist Sliders • RPG Presets • Waypoint Mod Export • Postcards
                </p>
              </div>
            </div>

            <div className="bg-[#B8B8B8] dark:bg-[#181B22] p-4 text-xs font-mc-mono border-t border-l border-[#FFFFFF] dark:border-[#303644] border-b border-r border-[#555555] dark:border-[#0E1015]">
              <h3 className="font-mc-heading text-sm font-bold text-[#D97706] mb-1">
                {isAr ? 'كيف يعمل محرك البحث العكسي؟' : 'How does the Reverse Seed Finder work?'}
              </h3>
              <p className="text-[#333333] dark:text-[#CBD5E1] leading-relaxed">
                {isAr
                  ? 'بدلاً من البحث اليدوي العشوائي، يُمكّنك محرك SeedLens من تحديد متطلباتك (مثلاً: فوهة كرز محاطة بقمم مثلجة مع سهولة بناء ≥ 85% وهياكل قرب الـ Spawn). يقوم محرك C الموازي بفحص آلاف البذور في الخلفية بتقنية الاستبعاد المبكر (Fast-Reject Early-Exit)، مستبعداً البذور غير المطابقة في أجزاء من الميكروثانية حتى يجد بذرة أحلامك بدقة تامة.'
                  : 'Instead of manually testing random seeds, set your desired parameters. The multi-threaded C engine evaluates thousands of seeds in milliseconds via early-exit heuristics, returning your ideal seed instantly.'}
              </p>
            </div>

            {/* RPG Presets Table */}
            <div>
              <h3 className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#F59E0B]" />
                <span>{isAr ? 'شخصيات اللعب الجاهزة (RPG Playstyle Presets)' : 'Curated RPG Playstyle Presets'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="mc-slot p-3.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#F59E0B] flex items-center gap-1.5">
                      <Castle className="w-4 h-4" />
                      {isAr ? 'الملك البنّاء (Mega-Builder)' : 'Mega-Builder'}
                    </span>
                    <span className="text-[10px] bg-[#B45309] text-white px-1.5 py-0.5 font-mc-mono">Build ≥ 85%</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    {isAr
                      ? 'سهول خضراء فسيحة بجوار مياه جارية ومصادر أخشاب لبناء مدن وقواعد دون عناء تسوية التضاريس.'
                      : 'Extensive flat grasslands next to rivers and wood supplies for building sprawling megacities.'}
                  </p>
                </div>

                <div className="mc-slot p-3.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#EF4444] flex items-center gap-1.5">
                      <Swords className="w-4 h-4" />
                      {isAr ? 'صائد الأقبية (Dungeon Raider)' : 'Dungeon Raider'}
                    </span>
                    <span className="text-[10px] bg-[#991B1B] text-white px-1.5 py-0.5 font-mc-mono">Combat Trial</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    {isAr
                      ? 'غرف محاكمة (Trial Chambers) ومدينة قديمة على بعد خطوات من الـ Spawn للقتال ونهب الصولجان والدروع.'
                      : 'Early-game Trial Chambers and Ancient City near spawn for rapid gear progression and combat.'}
                  </p>
                </div>

                <div className="mc-slot p-3.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#EC4899] flex items-center gap-1.5">
                      <Camera className="w-4 h-4" />
                      {isAr ? 'صانع السينما (Aesthetic Creator)' : 'Aesthetic Creator'}
                    </span>
                    <span className="text-[10px] bg-[#9D174D] text-white px-1.5 py-0.5 font-mc-mono">Scenic ≥ 90%</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    {isAr
                      ? 'فوهات كرز ساحرة محاطة بجبال مسننة تمنح لقطات سينمائية مبهرة لصنّاع المحتوى ومحبي اللقطات الخلابة.'
                      : 'Scenic Cherry Calderas enclosed by jagged peaks, perfect for cinematics and scenic bases.'}
                  </p>
                </div>

                <div className="mc-slot p-3.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#0284C7] flex items-center gap-1.5">
                      <Waves className="w-4 h-4" />
                      {isAr ? 'المحاصر المنعزل (Castaway Survivor)' : 'Castaway Survivor'}
                    </span>
                    <span className="text-[10px] bg-[#075985] text-white px-1.5 py-0.5 font-mc-mono">Ocean ≥ 400m</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    {isAr
                      ? 'جزيرة نجاة نقية معزولة وسط محيط سحيق دون يابسة مجاورة لتحديات النجاة الصعبة والمنارات.'
                      : 'Secluded survival island enclosed by vast deep ocean for hardcore survival challenges.'}
                  </p>
                </div>

                <div className="mc-slot p-3.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#10B981] flex items-center gap-1.5">
                      <Coins className="w-4 h-4" />
                      {isAr ? 'التاجر الإمبراطوري (Economy Mogul)' : 'Economy Mogul'}
                    </span>
                    <span className="text-[10px] bg-[#065F46] text-white px-1.5 py-0.5 font-mc-mono">3+ Villages</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    {isAr
                      ? 'عاصمة تجارية تضم 3 قرى أو أكثر على مسافة مشي قصيرة لتأسيس قاعات المقايضة ومزارع الحديد فوراً.'
                      : 'Dense cluster of 3+ villages close together for instant trading halls and iron farms.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Waypoints & Postcards Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                <h4 className="font-mc-heading text-xs font-bold text-[#10B981] uppercase mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>{isAr ? 'تصدير نقاط العلام لمودات الخرائط' : 'In-Game Waypoints Export'}</span>
                </h4>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed mb-2">
                  {isAr
                    ? 'اضغط زر "تصدير نقاط العلام (Waypoints)" في شريط النتائج لتحميل ملف نصي جاهز لمود Xaero\'s Minimap أو JourneyMap، ضعه في مجلد الخريطة داخل ملفات لعبتك وستظهر كل المواقع كدبابيس مشعة مباشرة على شاشتك!'
                    : 'Click "Export Waypoints" in the results bar to download ready config files for Xaero\'s Minimap or JourneyMap, projecting markers directly in your HUD.'}
                </p>
              </div>

              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                <h4 className="font-mc-heading text-xs font-bold text-[#3B82F6] uppercase mb-1.5 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" />
                  <span>{isAr ? 'توليد بطاقة المشاركة السينمائية' : 'Minecraft Postcard Sharing'}</span>
                </h4>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed mb-2">
                  {isAr
                    ? 'اضغط زر "مشاركة بطاقة المعلم" لتحصل على بطاقة بريدية سينمائية مرسومة بأناقة ماينكرافت البيكسلية متضمنة رقم البذرة والإحداثيات ودرجات التقييم، قابلة للتحميل بضغطة زر كصورة PNG لمشاركتها على وسائل التواصل.'
                    : 'Click "Share Postcard" to generate an aesthetic pixel-art postcard with seed, coordinates, and scores, downloadable as PNG for Discord and Reddit.'}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: Map HUD & Bedrock Parity Guide */}
          <section id="map_bedrock" aria-labelledby="heading-map_bedrock" className="mc-gui-panel p-6 sm:p-8 space-y-6 border-2 border-[#059669] scroll-mt-24">
            <div className="flex items-center gap-3 pb-3 border-b border-[#A8A8A8] dark:border-[#2E3342]">
              <div className="w-10 h-10 bg-[#059669] border-2 border-[#34D399] border-b-[#064E3B] border-r-[#064E3B] flex items-center justify-center text-white shadow-[1px_1px_0_#000] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 id="heading-map_bedrock" className="font-mc-heading text-xl font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                  {isAr ? 'تجربة الخريطة المتقدمة وتكافؤ البيدروك' : 'Interactive Map HUD & Bedrock Parity'}
                </h2>
                <p className="text-xs text-[#555555] dark:text-[#94A3B8] font-mc-mono">
                  Real-time Coordinates HUD • Version-Contextual Hover Cards • 100% Terrain Parity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="mc-slot p-4">
                <span className="text-[#34D399] font-mc-mono font-bold block mb-1">FEATURE 01</span>
                <h3 className="font-mc-heading font-bold text-sm text-white mb-2">
                  {isAr ? 'شريط الإحداثيات الحي (Coordinates HUD)' : 'Real-time Coordinates HUD'}
                </h3>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'شريط تفاعلي في الزاوية السفلية للخريطة يقرأ إحداثيات مؤشر الفأرة (X, Z) لحظياً أثناء التحريك مع حساب المسافة لنقطة الـ Spawn، مما يتيح لك معاينة أي موقع بدقة البلوكة دون الحاجة للنقر.'
                    : 'A live HUD in the bottom corner tracks cursor X, Z coordinates and distance from world spawn with zero latency.'}
                </p>
              </div>

              <div className="mc-slot p-4">
                <span className="text-[#F59E0B] font-mc-mono font-bold block mb-1">FEATURE 02</span>
                <h3 className="font-mc-heading font-bold text-sm text-white mb-2">
                  {isAr ? 'بطاقات الهوفر المتكيفة حسب الإصدار' : 'Version-Contextual Hover Cards'}
                </h3>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'عند تمرير مؤشر الفأرة فوق أي دبوس، تظهر بطاقة مصغرة أنيقة بصورة متجهة مطابقة تماماً للإصدار المختار: تظهر قمم ثلجية لـ 1.18 وأزهار كرز لـ 1.20 وغرف محاكمة لـ 1.21، مع زر سريع لنسخ أمر /tp دون إرباك مساحة الخريطة.'
                    : 'Hovering over pins displays compact contextual previews matching the active Minecraft version, complete with instant /tp copy buttons.'}
                </p>
              </div>
            </div>

            {/* Bedrock Parity Deep Dive */}
            <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
              <h3 className="font-mc-heading text-sm font-bold text-[#059669] uppercase mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{isAr ? 'حقيقة تكافؤ البيدروك وجافا (Bedrock Edition Parity)' : 'Understanding Bedrock Parity'}</span>
              </h3>
              <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed mb-3">
                {isAr
                  ? 'منذ تحديث Minecraft 1.18 (Caves & Cliffs Part II)، وحّدت شركة Mojang خوارزمية توليد التضاريس والبيومات بالكامل بين Java و Bedrock. هذا يعني أن أي بذرة 64-بت ستنتج نفس الجبال، نفس الوديان، نفس فوهات الكرز، ونفس جزر النجاة في نفس الإحداثيات تماماً على الهاتف أو الكونسول أو الحاسوب!'
                  : 'Since Minecraft 1.18 Caves & Cliffs, Mojang unified terrain and biome generation across Java and Bedrock. All 64-bit seeds yield identical mountains, cherry groves, rivers, and islands across both editions.'}
              </p>
              <div className="mc-slot p-2.5 text-xs font-mc-mono text-[#FADB44]">
                {isAr
                  ? '💡 ملاحظة للمستخدمين: ميزة اكتشاف المعالم وأماكن البناء صالحة بنسبة 100% للبيدروك، بينما قد تختلف إحداثيات بعض القرى والمعابد بسبب اختلاف مولد الهياكل الداخلي.'
                  : '💡 Note: Landmarks and scenic spots are 100% identical on Bedrock. Individual village coordinates may slightly vary.'}
              </div>
            </div>
          </section>

          {/* SECTION 5: Technical Architecture */}
          <section id="architecture" aria-labelledby="heading-architecture" className="mc-gui-panel p-6 sm:p-8 space-y-6 border-2 border-[#2563EB] scroll-mt-24">
            <div className="flex items-center gap-3 pb-3 border-b border-[#A8A8A8] dark:border-[#2E3342]">
              <div className="w-10 h-10 bg-[#2563EB] border-2 border-[#60A5FA] border-b-[#1E40AF] border-r-[#1E40AF] flex items-center justify-center text-white shadow-[1px_1px_0_#000] shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 id="heading-architecture" className="font-mc-heading text-xl font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                  {isAr ? 'المعمارية التقنية وتدفق البيانات في SeedLens' : 'Technical Architecture & Pipeline'}
                </h2>
                <p className="text-xs text-[#555555] dark:text-[#94A3B8] font-mc-mono">
                  Input → Fast-Reject C Pipeline → Cubiomes → Spatial Clusterer → Leaflet GIS
                </p>
              </div>
            </div>

            {/* Pipeline Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="mc-slot p-4">
                <span className="text-[#F59E0B] font-mc-mono font-bold block mb-1">STAGE 00</span>
                <h3 className="font-mc-heading font-bold text-sm text-white mb-2">
                  {isAr ? 'محرك الفحص العكسي فائق السرعة' : 'Fast-Reject Early-Exit Pipeline (C)'}
                </h3>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'في وضع البحث العكسي (seedlens find)، يفحص المحرك معايير التضاريس والبيومات المطلوبة بأقل تكلفة حسابية؛ إذا لم تتطابق البذرة، يتم استبعادها في أقل من ميكروثانية والانتقال للبذرة التالية دون توليد العالم كاملاً.'
                    : 'In reverse search mode, the C engine evaluates conditions with minimal compute, discarding non-matching seeds in microseconds before full simulation.'}
                </p>
              </div>

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
            </div>
          </section>

          {/* SECTION 6: FAQ & Commands */}
          <section id="faq" aria-labelledby="heading-faq" className="mc-gui-panel p-6 sm:p-8 space-y-6 border-2 border-[#A855F7] scroll-mt-24">
            <div className="flex items-center gap-3 pb-3 border-b border-[#A8A8A8] dark:border-[#2E3342]">
              <div className="w-10 h-10 bg-[#A855F7] border-2 border-[#C084FC] border-b-[#6B21A8] border-r-[#6B21A8] flex items-center justify-center text-white shadow-[1px_1px_0_#000] shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 id="heading-faq" className="font-mc-heading text-xl font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                  {isAr ? 'الأسئلة الشائعة ودليل أوامر الانتقال وتصدير الخرائط' : 'FAQ, Teleport & Mod Export Guide'}
                </h2>
                <p className="text-xs text-[#555555] dark:text-[#94A3B8] font-mc-mono">
                  Minecraft Teleport Syntax • Mod Integration • Bedrock & Security
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
                <h3 className="font-mc-heading text-sm font-bold text-[#059669] uppercase mb-1">
                  {isAr ? 'هل بذور ومواقع SeedLens تعمل على ماينكرافت بيدروك (Bedrock)؟' : 'Do SeedLens seeds and spots work on Bedrock Edition?'}
                </h3>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'نعم بنسبة 100% للتضاريس والبيومات! منذ تحديث 1.18، تتطابق الجبال وفوهات الكرز والبحيرات والوديان بدقة متناهية بين جافا وبيدروك. يمكنك اختيار وضع [Bedrock Edition] في واجهة البحث للتركيز على المعالم المشتركة.'
                    : 'Yes! 100% parity for terrain, mountains, caldera lakes, and biomes since 1.18. Toggle the [Bedrock Edition] mode in the search bar for matched features.'}
                </p>
              </div>

              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                <h3 className="font-mc-heading text-sm font-bold text-[#D97706] uppercase mb-1">
                  {isAr ? 'كيف أستخدم ملف نقاط العلام (Waypoints) داخل ماينكرافت؟' : 'How do I import exported Waypoints into Minecraft?'}
                </h3>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'بعد تنزيل الملف من زر "تصدير نقاط العلام"، افتح مجلد `.minecraft/waypoints` لمود Xaero\'s أو JourneyMap وضع الملف بداخله. عند دخولك للعالم ستظهر كافة القرى وفوهات الكرز كدبابيس ثلاثية الأبعاد على شاشتك.'
                    : 'Download the waypoints file and place it into `.minecraft/waypoints` for Xaero\'s Minimap or JourneyMap. All spots appear as 3D markers in your game.'}
                </p>
              </div>

              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                <h3 className="font-mc-heading text-sm font-bold text-[#8B5CF6] uppercase mb-1">
                  {isAr ? 'كيف يتم التحقق من صحة البذور المدخلة (Numeric & Text Seeds)؟' : 'How are numeric and text seeds validated?'}
                </h3>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'يقبل النظام أرقام البذور المباشرة 64-بت (الموجبة والسالبة)، كما يدعم إدخال الكلمات والنصوص حيث يقوم بتحويلها تلقائياً بدالة التجزئة القياسية لماينكرافت جافا (String.hashCode) لتوليد بذور مطابقة للعبة بدقة.'
                    : 'The engine accepts direct 64-bit numeric seeds (positive or negative) as well as text strings, automatically hashing them using standard Java String.hashCode() to ensure exact game parity.'}
                </p>
              </div>

              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                <h3 className="font-mc-heading text-sm font-bold text-[#0284C7] uppercase mb-1">
                  {isAr ? 'كيف أقارن بين بذرتين في آن واحد لاختيار الأنسب؟' : 'How do I compare two seeds side-by-side?'}
                </h3>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed mb-2">
                  {isAr
                    ? 'انقر على تبويب [مقارنة بذرتين] في أعلى الصفحة، وأدخل رقم البذرة الأولى وإصدارها ورقم البذرة الثانية وإصدارها ثم اضغط زر "بدء المقارنة الفورية". سيعرض لك النظام جدولاً إحصائياً يقارن العناقيد، تضاريس البناء، غرف المحاكمة، وقرب الـ Spawn مع تتويج البذرة الفائزة 👑 وتقديم نصيحة لاختيار البذرة المناسبة لأسلوب لعبك.'
                    : 'Switch to the [Compare Seeds] tab in the header, input both seeds and their target versions, then click "Run Instant Comparison". You will get a side-by-side metrics matrix with winner crowns and playstyle advice.'}
                </p>
              </div>

              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                <h3 className="font-mc-heading text-sm font-bold text-[#10B981] uppercase mb-1">
                  {isAr ? 'كيف أحفظ بذوري المفضلة أو أنقلها إلى جهاز آخر؟' : 'How do I bookmark seeds and transfer them between devices?'}
                </h3>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'عند فحص أي بذرة، اضغط زر [⭐ حفظ في المفضلة] في شريط النتائج. لفتح المفضلة، انقر زر [🏛️ مستودع البذور] في الشريط العلوي؛ ستجد تبويب "مفضلتي" الذي يحتوي زراً لـ [تصدير JSON] لعمل نسخة احتياطية أو [استيراد JSON] لاسترجاع بذورك على أي حاسوب آخر دون الحاجة لتسجيل أي حساب.'
                    : 'Click [⭐ Bookmark Seed] on any analysis result. Open the [🏛️ Community Vault] modal from the header and navigate to "My Bookmarks" to export or import your seeds as JSON without any account.'}
                </p>
              </div>

              <div className="bg-[#DFDFDF] dark:bg-[#161820] p-4 border border-[#A8A8A8] dark:border-[#2E3342]">
                <h3 className="font-mc-heading text-sm font-bold text-[#EC4899] uppercase mb-1">
                  {isAr ? 'هل تستهلك المعاينات المصورة الكثير من بيانات الإنترنت؟' : 'Do the in-game preview images consume high network bandwidth?'}
                </h3>
                <p className="text-xs text-[#333333] dark:text-[#CBD5E1] leading-relaxed">
                  {isAr
                    ? 'إطلاقاً! تم ضغط كافة الصور بدقة متوازنة وبتقنية WebP الحديثة ليتراوح حجم الصورة بين 10 إلى 45 كيلوبايت فقط، مما يجعلها خفيفة جداً ومتوافقة تماماً مع باقات وبيانات الهاتف المتنقل (3G/4G/5G). كما تتوفر آلية تحويل فوري للرسومات المتجهية SVG إذا انقطع الاتصال.'
                    : 'Not at all! All images are standard-quality WebP assets (10KB–45KB), designed specifically to protect mobile data and load with zero delay. An automatic SVG fallback is built-in.'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
