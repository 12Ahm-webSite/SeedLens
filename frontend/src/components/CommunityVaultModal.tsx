'use client';

import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Sparkles,
  Download,
  Upload,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Compass,
  X,
  Search,
  Filter,
  Layers,
  Crown,
  Castle,
  Trees,
  Waves,
  Swords,
  Coins,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  getBookmarks,
  removeBookmark,
  exportBookmarksJson,
  importBookmarksJson,
  SavedBookmark,
} from '@/lib/bookmarks';
import communitySeedsData from '@/data/community_seeds.json';

interface CommunityVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSeed: (seed: string, version?: string, edition?: 'java' | 'bedrock') => void;
}

export default function CommunityVaultModal({
  isOpen,
  onClose,
  onSelectSeed,
}: CommunityVaultModalProps) {
  const { locale, t } = useLanguage();
  const isAr = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'community' | 'saved'>('community');
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copiedSeed, setCopiedSeed] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBookmarks(getBookmarks());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (seedStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(seedStr);
    setCopiedSeed(seedStr);
    setTimeout(() => setCopiedSeed(null), 1800);
  };

  const handleDeleteBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeBookmark(id);
    setBookmarks(getBookmarks());
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const count = importBookmarksJson(content);
        setBookmarks(getBookmarks());
        alert(isAr ? `تم استيراد ${count} بذرة بنجاح!` : `Successfully imported ${count} seeds!`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredCommunity = communitySeedsData.filter((item) => {
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchSearch =
      searchQuery === '' ||
      item.seed.includes(searchQuery) ||
      (isAr ? item.title_ar : item.title_en).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isAr ? item.highlight_ar : item.highlight_en).toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredBookmarks = bookmarks.filter((bm) => {
    return (
      searchQuery === '' ||
      bm.seed.includes(searchQuery) ||
      (bm.notes && bm.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bm.highlight && bm.highlight.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] shadow-[4px_4px_0_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-[#7B7B7B]/30 bg-[#C8C8C8] dark:bg-[#15171C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#D97706] flex items-center justify-center border-t border-l border-[#F59E0B] border-b border-r border-[#78350F] shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
              <Bookmark className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-mc-heading text-base font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                {isAr ? 'مستودع بذور المجتمع والمفضلة' : 'Community Vault & Saved Seeds'}
              </h2>
              <p className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8]">
                {isAr
                  ? 'عوالم منتقاة أسطورياً وبذورك المحفوظة للمعاينة الفورية'
                  : 'Curated legendary worlds and personal bookmarked seeds'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mc-button px-2.5 py-1 font-mc-mono text-xs font-bold text-[#555555] hover:text-[#B91C1C] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Controls & Search Bar */}
        <div className="p-4 pb-2 border-b border-[#7B7B7B]/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mc-heading text-xs">
            <button
              onClick={() => setActiveTab('community')}
              className={`px-3 py-1.5 flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeTab === 'community'
                  ? 'bg-[#D97706] text-white shadow-[2px_2px_0_#78350F]'
                  : 'mc-button text-[#333333] dark:text-[#CBD5E1]'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{isAr ? 'بذور المجتمع المنتقاة' : 'Curated Community Seeds'}</span>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded">
                {communitySeedsData.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-[#5B8731] text-white shadow-[2px_2px_0_#2A4413]'
                  : 'mc-button text-[#333333] dark:text-[#CBD5E1]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isAr ? 'المفضلة المحفوظة' : 'My Bookmarks'}</span>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded">
                {bookmarks.length}
              </span>
            </button>
          </div>

          {/* Quick Actions (Export / Import when in saved) */}
          {activeTab === 'saved' && (
            <div className="flex items-center gap-2 font-mc-mono text-xs">
              <button
                onClick={exportBookmarksJson}
                disabled={bookmarks.length === 0}
                className="mc-button px-2.5 py-1 flex items-center gap-1 font-bold text-[#2563EB] dark:text-[#60A5FA] cursor-pointer disabled:opacity-50"
                title={isAr ? 'تصدير المفضلة كملف JSON' : 'Export bookmarks as JSON'}
              >
                <Download className="w-3 h-3" />
                <span>{isAr ? 'تصدير' : 'Export'}</span>
              </button>

              <label
                className="mc-button px-2.5 py-1 flex items-center gap-1 font-bold text-[#059669] dark:text-[#34D399] cursor-pointer"
                title={isAr ? 'استيراد بذور من ملف JSON' : 'Import bookmarks from JSON'}
              >
                <Upload className="w-3 h-3" />
                <span>{isAr ? 'استيراد' : 'Import'}</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Search Box */}
          <div className="w-full sm:w-64 relative flex items-center mc-slot px-2.5 py-1">
            <Search className="w-3.5 h-3.5 text-[#888888] me-1.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن بذرة أو معلم...' : 'Search seed or archetype...'}
              className="w-full bg-transparent text-xs font-mc-mono text-[#FFFFFF] focus:outline-none placeholder-[#888888]"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'community' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredCommunity.map((item) => (
                <div
                  key={item.id}
                  className="mc-gui-panel p-3.5 hover:border-[#D97706] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9] block">
                          {isAr ? item.title_ar : item.title_en}
                        </span>
                        <span className="font-mc-mono text-xs font-bold text-[#D97706]">
                          {isAr ? item.archetype_ar : item.archetype_en}
                        </span>
                      </div>
                      <span className="font-mc-mono text-[10px] bg-[#0284C7] text-white px-1.5 py-0.5 font-bold shrink-0">
                        {item.edition_parity}
                      </span>
                    </div>

                    <p className="font-mc-body text-xs text-[#444444] dark:text-[#CBD5E1] mb-2.5 leading-relaxed">
                      {isAr ? item.highlight_ar : item.highlight_en}
                    </p>

                    <div className="flex items-center gap-2 mb-3 font-mc-mono text-[11px] text-[#555555] dark:text-[#94A3B8] flex-wrap">
                      <span className="text-[#5B8731] font-bold">
                        📍 X: {item.coordinates.x} | Y: {item.coordinates.y} | Z: {item.coordinates.z}
                      </span>
                      <span>•</span>
                      <span>🏔️ {item.scenic_score}%</span>
                      <span>🏰 {item.building_score}%</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#7B7B7B]/20 flex items-center justify-between gap-2">
                    <div className="font-mc-mono text-xs text-[#222222] dark:text-[#E2E8F0] font-bold flex items-center gap-1.5">
                      <span className="text-[#888888]">Seed:</span>
                      <code className="bg-black/15 dark:bg-black/40 px-1 py-0.5">{item.seed}</code>
                      <button
                        onClick={(e) => handleCopy(item.seed, e)}
                        className="p-1 hover:text-[#5B8731] transition-colors cursor-pointer"
                        title={isAr ? 'نسخ رقم البذرة' : 'Copy seed'}
                      >
                        {copiedSeed === item.seed ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onSelectSeed(item.seed, '1.20.6', 'java');
                        onClose();
                      }}
                      className="mc-btn-green px-3 py-1 font-mc-heading text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
                      <span>{isAr ? 'تحليل البذرة' : 'Analyze Seed'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'saved' && (
            <div>
              {filteredBookmarks.length === 0 ? (
                <div className="text-center py-12 mc-slot p-6">
                  <Bookmark className="w-10 h-10 mx-auto text-[#7B7B7B] mb-2" />
                  <h3 className="font-mc-heading text-sm font-bold text-[#CBD5E1] mb-1">
                    {isAr ? 'لا توجد بذور محفوظة في المفضلة بعد' : 'No saved bookmarks yet'}
                  </h3>
                  <p className="font-mc-mono text-xs text-[#94A3B8] max-w-sm mx-auto">
                    {isAr
                      ? 'عند فحص أي بذرة تعجبك، اضغط على زر النجمة (⭐) لحفظها هنا والعودة إليها في أي وقت دون إعادة كتابتها!'
                      : 'Click the star icon (⭐) on any seed analysis result to bookmark it here for instant access!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredBookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      className="mc-gui-panel p-3.5 hover:border-[#5B8731] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                              Seed #{bm.seed}
                            </span>
                            <span className="text-[10px] bg-[#5B8731] text-white px-1.5 py-0.2 font-mc-mono uppercase">
                              {bm.edition}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleDeleteBookmark(bm.id, e)}
                            className="p-1 text-[#888888] hover:text-[#DC2626] transition-colors cursor-pointer"
                            title={isAr ? 'حذف من المفضلة' : 'Remove bookmark'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {bm.highlight && (
                          <p className="font-mc-body text-xs text-[#555555] dark:text-[#94A3B8] mb-2">
                            {bm.highlight}
                          </p>
                        )}

                        <div className="flex items-center gap-2 font-mc-mono text-[10px] text-[#777777] dark:text-[#94A3B8] mb-2.5">
                          <span>📅 {new Date(bm.savedAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</span>
                          {bm.clusterCount !== undefined && <span>• 🏰 {bm.clusterCount} Clusters</span>}
                          {bm.scenicScore !== undefined && <span>• 🏔️ {bm.scenicScore}% Scenic</span>}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#7B7B7B]/20 flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => handleCopy(bm.seed, e)}
                          className="mc-button px-2.5 py-1 font-mc-mono text-xs flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSeed === bm.seed ? (
                            <>
                              <Check className="w-3 h-3 text-[#10B981]" />
                              <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{isAr ? 'نسخ' : 'Copy'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            onSelectSeed(bm.seed, bm.version, bm.edition);
                            onClose();
                          }}
                          className="mc-btn-green px-3 py-1 font-mc-heading text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>{isAr ? 'فتح وتحليل' : 'Analyze'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
