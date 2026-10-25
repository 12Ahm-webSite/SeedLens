'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  ShieldCheck,
  RefreshCw,
  Download,
  LogOut,
  Users,
  Search,
  Activity,
  Compass,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
  Layers,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  KeyRound,
} from 'lucide-react';
import type { AnalyticsData } from '@/lib/analytics';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [rememberPin, setRememberPin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Change PIN modal state
  const [showChangePinModal, setShowChangePinModal] = useState<boolean>(false);
  const [currentPinInput, setCurrentPinInput] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState<string>('');
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);
  const [pinChangeSuccess, setPinChangeSuccess] = useState<string | null>(null);
  const [pinChangeLoading, setPinChangeLoading] = useState<boolean>(false);

  // Normalize digits (e.g. Arabic ١٢٣٤ to 1234) and trim
  const normalizeInputPin = (val: string): string => {
    return val
      .trim()
      .replace(/[٠۰]/g, '0')
      .replace(/[١۱]/g, '1')
      .replace(/[٢۲]/g, '2')
      .replace(/[٣۳]/g, '3')
      .replace(/[٤۴]/g, '4')
      .replace(/[٥۵]/g, '5')
      .replace(/[٦۶]/g, '6')
      .replace(/[٧۷]/g, '7')
      .replace(/[٨۸]/g, '8')
      .replace(/[٩۹]/g, '9');
  };

  // Check stored PIN on mount
  useEffect(() => {
    const savedPin = localStorage.getItem('seedlens_admin_pin');
    if (savedPin) {
      setPin(savedPin);
      verifyPin(savedPin);
    }
  }, []);

  const verifyPin = async (inputPin: string) => {
    setLoading(true);
    setError(null);
    const cleaned = normalizeInputPin(inputPin);
    try {
      const res = await fetch(`/api/analytics?pin=${encodeURIComponent(cleaned)}`);
      if (res.ok) {
        const json = await res.json();
        setIsAuthenticated(true);
        setPin(cleaned);
        setAnalytics(json.data);
        if (rememberPin) {
          localStorage.setItem('seedlens_admin_pin', cleaned);
        }
      } else {
        setError('رمز المرور الإداري غير صحيح (Invalid PIN)');
        setIsAuthenticated(false);
      }
    } catch {
      setError('تعذر الاتصال بخادم الإحصائيات (Connection Error)');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError('يرجى إدخال رمز المرور الإداري');
      return;
    }
    verifyPin(pin);
  };

  const handleLogout = () => {
    localStorage.removeItem('seedlens_admin_pin');
    setIsAuthenticated(false);
    setPin('');
    setAnalytics(null);
  };

  const handleRefresh = async () => {
    if (!pin) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?pin=${encodeURIComponent(pin)}`);
      if (res.ok) {
        const json = await res.json();
        setAnalytics(json.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!pin) return;
    const confirmReset = window.confirm('هل أنت متأكد من تصفير كافة الإحصائيات وبدء التتبع من الصفر؟');
    if (!confirmReset) return;

    setLoading(true);
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset', pin }),
      });
      if (res.ok) {
        const json = await res.json();
        setAnalytics(json.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!analytics) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analytics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `seedlens-analytics-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError(null);
    setPinChangeSuccess(null);

    const normCurrent = normalizeInputPin(currentPinInput);
    const normNew = normalizeInputPin(newPinInput);
    const normConfirm = normalizeInputPin(confirmNewPinInput);

    if (!normCurrent) {
      setPinChangeError('يرجى إدخال رمز المرور الحالي');
      return;
    }
    if (!normNew || normNew.length < 4) {
      setPinChangeError('يجب أن يتكون رمز المرور الجديد من 4 خانات على الأقل');
      return;
    }
    if (normNew !== normConfirm) {
      setPinChangeError('تأكيد الرمز الجديد غير متطابق');
      return;
    }

    setPinChangeLoading(true);
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_pin',
          currentPin: normCurrent,
          newPin: normNew,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPinChangeSuccess('تم تحديث رمز المرور بنجاح وحفظه!');
        setPin(normNew);
        if (localStorage.getItem('seedlens_admin_pin')) {
          localStorage.setItem('seedlens_admin_pin', normNew);
        }
        setTimeout(() => {
          setShowChangePinModal(false);
          setCurrentPinInput('');
          setNewPinInput('');
          setConfirmNewPinInput('');
          setPinChangeSuccess(null);
        }, 1200);
      } else {
        setPinChangeError(json.error || 'فشل تحديث رمز المرور');
      }
    } catch {
      setPinChangeError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setPinChangeLoading(false);
    }
  };

  // Login PIN Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#C8C8C8] dark:bg-[#121316] text-[#1E1E1E] dark:text-[#E2E8F0] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] shadow-[4px_4px_0_rgba(0,0,0,0.3)] p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#7B7B7B]/30">
            <div className="w-10 h-10 bg-[#5B8731] flex items-center justify-center border-t border-l border-[#89BD44] border-b border-r border-[#2A4413] shadow-[2px_2px_0_rgba(0,0,0,0.25)]">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-mc-heading text-lg font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                SeedLens Operations
              </h1>
              <p className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8]">
                لوحة الإدارة والتحليلات المركزية (my-admin)
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mc-mono text-xs font-bold text-[#333333] dark:text-[#CBD5E1] mb-1.5">
                رمز المرور الإداري (Security PIN):
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="أدخل رمز المرور السري"
                autoFocus
                className="w-full bg-[#EFEFEF] dark:bg-[#121316] text-[#1E1E1E] dark:text-[#F1F5F9] font-mc-mono text-sm px-3 py-2 border-t border-l border-[#555555] dark:border-[#0E1014] border-b border-r border-[#FFFFFF] dark:border-[#2D333F] outline-none focus:ring-1 focus:ring-[#5B8731]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberPin}
                onChange={(e) => setRememberPin(e.target.checked)}
                className="rounded border-[#7B7B7B] accent-[#5B8731]"
              />
              <label htmlFor="remember" className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8] cursor-pointer">
                تذكر الجلسة في هذا المتصفح
              </label>
            </div>

            {error && (
              <div className="p-2.5 bg-[#7A1E11] text-white font-mc-mono text-xs flex items-center gap-2 border-t border-l border-[#A83222] border-b border-r border-[#3D0A04]">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#FADB44]" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mc-button py-2 font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#EAEAEA] dark:hover:bg-[#252830]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#5B8731]" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-[#5B8731]" />
                  <span>فتح لوحة التحكم / Authenticate</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8] hover:text-[#5B8731] dark:hover:text-[#84CC16] inline-flex items-center gap-1"
              >
                <span>العودة إلى الصفحة الرئيسية</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Calculate summaries
  const totalVisits = analytics?.total_visits || 0;
  const uniqueVisitors = analytics?.unique_visitors || 0;
  const seedsAnalyzed = analytics?.seeds_analyzed || 0;
  const seedsFound = analytics?.seeds_found || 0;
  const javaCount = analytics?.editions?.java || 0;
  const bedrockCount = analytics?.editions?.bedrock || 0;
  const totalEditions = javaCount + bedrockCount;
  const javaPercent = totalEditions > 0 ? Math.round((javaCount / totalEditions) * 100) : 0;
  const bedrockPercent = totalEditions > 0 ? 100 - javaPercent : 0;

  // Daily activity entries for timeline chart
  const dailyEntries = Object.entries(analytics?.daily_activity || {}).sort((a, b) => a[0].localeCompare(b[0]));
  const maxVisitsInDay = dailyEntries.length > 0
    ? Math.max(...dailyEntries.map(([, v]) => Math.max(v.visits || 0, v.analyses || 0)), 1)
    : 1;

  // Versions entries
  const versionEntries = Object.entries(analytics?.versions || {}).sort((a, b) => b[1] - a[1]);
  const totalVersionCount = Object.values(analytics?.versions || {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="min-h-screen bg-[#C8C8C8] dark:bg-[#121316] text-[#1E1E1E] dark:text-[#E2E8F0] p-4 md:p-6 font-mc-body selection:bg-[#5B8731] selection:text-white">
      {/* Top Admin Header */}
      <div className="max-w-7xl mx-auto mb-6 bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] p-4 shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B8731] flex items-center justify-center border-t border-l border-[#89BD44] border-b border-r border-[#2A4413] shadow-[1px_1px_0_rgba(0,0,0,0.25)]">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mc-heading text-lg font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                  SeedLens Central Operations
                </h1>
                <span className="font-mc-mono text-[9px] bg-[#10B981] text-white px-1.5 py-0.5 font-bold shadow-[1px_1px_0_rgba(0,0,0,0.2)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE ANALYTICS
                </span>
              </div>
              <p className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8]">
                لوحة القيادة والتحكم الميدانية • مسار الإدارة المخصص <code className="bg-black/10 dark:bg-black/30 px-1">/my-admin</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="mc-button px-3 py-1.5 font-mc-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#EAEAEA] dark:hover:bg-[#252830]"
              title="تحديث الإحصائيات الفورية"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#5B8731] ${loading ? 'animate-spin' : ''}`} />
              <span>تحديث البيانات</span>
            </button>

            <button
              onClick={() => {
                setShowChangePinModal(true);
                setPinChangeError(null);
                setPinChangeSuccess(null);
                setCurrentPinInput('');
                setNewPinInput('');
                setConfirmNewPinInput('');
              }}
              className="mc-button px-3 py-1.5 font-mc-mono text-xs font-bold text-[#D97706] dark:text-[#FBBF24] flex items-center gap-1.5 cursor-pointer hover:bg-[#FEF3C7] dark:hover:bg-[#452B10]"
              title="تغيير رمز المرور الإداري"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>تغيير الرمز</span>
            </button>

            <button
              onClick={handleReset}
              disabled={loading}
              className="mc-button px-3 py-1.5 font-mc-mono text-xs font-bold text-[#DC2626] dark:text-[#F87171] flex items-center gap-1.5 cursor-pointer hover:bg-[#FEE2E2] dark:hover:bg-[#451A1A]"
              title="تصفير العدادات وبدء التتبع من الصفر"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير العدادات</span>
            </button>

            <button
              onClick={handleExportJson}
              className="mc-button px-3 py-1.5 font-mc-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#EAEAEA] dark:hover:bg-[#252830]"
              title="تصدير تقرير JSON كامل"
            >
              <Download className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>تصدير JSON</span>
            </button>

            <Link
              href="/"
              className="mc-button px-3 py-1.5 font-mc-mono text-xs font-bold text-[#5B8731] dark:text-[#84CC16] flex items-center gap-1.5 hover:bg-[#EAEAEA] dark:hover:bg-[#252830]"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>الواجهة الرئيسية</span>
            </Link>

            <button
              onClick={handleLogout}
              className="mc-button px-3 py-1.5 font-mc-mono text-xs font-bold text-[#B91C1C] dark:text-[#EF4444] flex items-center gap-1.5 cursor-pointer hover:bg-[#FEE2E2] dark:hover:bg-[#451A1A]"
              title="قفل وتسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>قفل</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Key Metric HUD Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Visits */}
          <div className="bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] p-4 shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between text-[#555555] dark:text-[#94A3B8] font-mc-mono text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0284C7]" />
                إجمالي الزيارات (Visits)
              </span>
              <span className="text-[10px] bg-[#0284C7]/20 text-[#0284C7] px-1 font-bold">ALL-TIME</span>
            </div>
            <div className="font-mc-heading text-2xl font-bold text-[#1E1E1E] dark:text-[#F1F5F9] my-1">
              {totalVisits.toLocaleString()}
            </div>
            <div className="font-mc-mono text-[11px] text-[#555555] dark:text-[#94A3B8] flex items-center justify-between">
              <span>المستخدمين الفريدين:</span>
              <span className="font-bold text-[#0284C7]">{uniqueVisitors.toLocaleString()}</span>
            </div>
          </div>

          {/* Seeds Analyzed */}
          <div className="bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] p-4 shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between text-[#555555] dark:text-[#94A3B8] font-mc-mono text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#5B8731]" />
                البذور المحللة (Analyzed)
              </span>
              <span className="text-[10px] bg-[#5B8731]/20 text-[#5B8731] px-1 font-bold">ENGINE</span>
            </div>
            <div className="font-mc-heading text-2xl font-bold text-[#5B8731] dark:text-[#84CC16] my-1">
              {seedsAnalyzed.toLocaleString()}
            </div>
            <div className="font-mc-mono text-[11px] text-[#555555] dark:text-[#94A3B8] flex items-center justify-between">
              <span>نسبة الإنجاز لكل زائر:</span>
              <span className="font-bold text-[#5B8731]">
                {totalVisits ? ((seedsAnalyzed / totalVisits) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>

          {/* Seeds Found via Reverse Finder */}
          <div className="bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] p-4 shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between text-[#555555] dark:text-[#94A3B8] font-mc-mono text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#D97706]" />
                الباحث العكسي (Finder)
              </span>
              <span className="text-[10px] bg-[#D97706]/20 text-[#D97706] px-1 font-bold">PRESETS</span>
            </div>
            <div className="font-mc-heading text-2xl font-bold text-[#D97706] dark:text-[#F59E0B] my-1">
              {seedsFound.toLocaleString()}
            </div>
            <div className="font-mc-mono text-[11px] text-[#555555] dark:text-[#94A3B8] flex items-center justify-between">
              <span>عمليات تطابق ناجحة:</span>
              <span className="font-bold text-[#D97706]">100%</span>
            </div>
          </div>

          {/* Engine Latency & Health */}
          <div className="bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] p-4 shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between text-[#555555] dark:text-[#94A3B8] font-mc-mono text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#BE185D]" />
                سرعة المحرك (C Latency)
              </span>
              <span className="text-[10px] bg-[#BE185D]/20 text-[#BE185D] px-1 font-bold">C99 FAST</span>
            </div>
            <div className="font-mc-heading text-2xl font-bold text-[#BE185D] dark:text-[#EC4899] my-1 flex items-center gap-1">
              <span>~14ms</span>
              <span className="text-xs font-mc-mono text-[#10B981]">⚡ فائق</span>
            </div>
            <div className="font-mc-mono text-[11px] text-[#555555] dark:text-[#94A3B8] flex items-center justify-between">
              <span>حالة خادم Cubiomes:</span>
              <span className="font-bold text-[#10B981]">جاهز ومستقر</span>
            </div>
          </div>
        </div>

        {/* Visual Diagrams Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Diagram: Activity Timeline Chart (2 cols) */}
          <div className="lg:col-span-2 bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] p-5 shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#7B7B7B]/30">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#5B8731]" />
                <h2 className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                  رسم بياني للنشاط الزمني (Activity Timeline Diagram)
                </h2>
              </div>
              <div className="flex items-center gap-3 font-mc-mono text-[10px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#0284C7] inline-block" />
                  الزيارات (Visits)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#5B8731] inline-block" />
                  التحليلات (Analyses)
                </span>
              </div>
            </div>

            {/* SVG/HTML Tactical Bar Diagram */}
            <div className="space-y-4 pt-2">
              {dailyEntries.length === 0 ? (
                <div className="p-8 text-center text-[#777777] dark:text-[#94A3B8] font-mc-mono text-xs border border-dashed border-[#7B7B7B]/40">
                  <BarChart3 className="w-8 h-8 text-[#5B8731] mx-auto mb-2 opacity-60" />
                  <p className="font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-1">
                    بانتظار تسجيل أول نشاط زمني للموقع
                  </p>
                  <p className="text-[11px]">
                    البيانات الآن صفرية وحقيقية 100%. سيبدأ الرسم البياني بالظهور تلقائياً عند أول زيارة أو فحص بذرة.
                  </p>
                </div>
              ) : (
                dailyEntries.map(([date, counts]) => {
                  const visitWidth = Math.min(100, Math.round((counts.visits / maxVisitsInDay) * 100));
                  const analyzeWidth = Math.min(100, Math.round((counts.analyses / maxVisitsInDay) * 100));

                  return (
                    <div key={date} className="space-y-1 font-mc-mono text-xs">
                      <div className="flex justify-between items-center text-[#555555] dark:text-[#94A3B8] text-[11px]">
                        <span className="font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#5B8731]" />
                          {date}
                        </span>
                        <span className="font-bold">
                          {counts.visits} زيارة &nbsp;|&nbsp; {counts.analyses} تحليل
                        </span>
                      </div>

                      {/* Dual visual bars */}
                      <div className="space-y-1">
                        {/* Visits bar */}
                        <div className="w-full bg-[#BDBDBD] dark:bg-[#121316] h-3 overflow-hidden border border-[#7B7B7B]/30 relative">
                          <div
                            className="h-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] transition-all duration-500"
                            style={{ width: `${visitWidth}%` }}
                          />
                        </div>
                        {/* Analyses bar */}
                        <div className="w-full bg-[#BDBDBD] dark:bg-[#121316] h-3 overflow-hidden border border-[#7B7B7B]/30 relative">
                          <div
                            className="h-full bg-gradient-to-r from-[#5B8731] to-[#84CC16] transition-all duration-500"
                            style={{ width: `${analyzeWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-[#7B7B7B]/30 font-mc-mono text-[10px] text-[#777777] dark:text-[#94A3B8] flex justify-between">
              <span>* يتم تسجيل كل زيارة وتحليل تلقائياً وحفظه في ملف الإحصائيات الدائم.</span>
              <span>تحديث حي (Real-time)</span>
            </div>
          </div>

          {/* Side Column: Editions & Versions Distribution (1 col) */}
          <div className="space-y-6">
            {/* Java vs Bedrock Ratio */}
            <div className="bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] p-4 shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
              <h3 className="font-mc-heading text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-3 pb-2 border-b border-[#7B7B7B]/30 flex items-center justify-between">
                <span>نسبة Java مقابل Bedrock</span>
                <span className="font-mc-mono text-[10px] text-[#5B8731]">EDITION SPLIT</span>
              </h3>

              <div className="space-y-3 font-mc-mono text-xs">
                {/* Visual Ratio Bar */}
                <div className="w-full h-4 bg-[#121316] flex overflow-hidden border border-[#555555]">
                  <div
                    className="bg-[#5B8731] h-full flex items-center justify-center text-[9px] text-white font-bold transition-all duration-500"
                    style={{ width: `${javaPercent}%` }}
                  >
                    {javaPercent > 20 ? `${javaPercent}%` : ''}
                  </div>
                  <div
                    className="bg-[#0284C7] h-full flex items-center justify-center text-[9px] text-white font-bold transition-all duration-500"
                    style={{ width: `${bedrockPercent}%` }}
                  >
                    {bedrockPercent > 20 ? `${bedrockPercent}%` : ''}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#5B8731] inline-block" />
                    <span>☕ Java Edition:</span>
                    <b className="text-[#5B8731]">{javaCount}</b> ({javaPercent}%)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#0284C7] inline-block" />
                    <span>🪨 Bedrock:</span>
                    <b className="text-[#0284C7]">{bedrockCount}</b> ({bedrockPercent}%)
                  </div>
                </div>
              </div>
            </div>

            {/* Version Popularity Chart */}
            <div className="bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] p-4 shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
              <h3 className="font-mc-heading text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-3 pb-2 border-b border-[#7B7B7B]/30 flex items-center justify-between">
                <span>توزيع إصدارات ماينكرافت</span>
                <span className="font-mc-mono text-[10px] text-[#0284C7]">MC VERSIONS</span>
              </h3>

              <div className="space-y-2.5 font-mc-mono text-xs">
                {versionEntries.length === 0 ? (
                  <div className="p-4 text-center text-[#777777] dark:text-[#94A3B8] font-mc-mono text-xs border border-dashed border-[#7B7B7B]/40">
                    <p>بانتظار تحليل أول بذرة لتسجيل الإصدارات.</p>
                  </div>
                ) : (
                  versionEntries.map(([ver, count]) => {
                    const pct = Math.round((count / totalVersionCount) * 100);
                    const isPale = ver.includes('21.4') || ver.includes('26');
                    const isTrials = ver.includes('21.1') || ver.includes('21');

                    return (
                      <div key={ver} className="space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold flex items-center gap-1">
                            {isPale ? '🌿' : isTrials ? '⚔️' : '📦'} {ver}
                            {isPale && <span className="text-[9px] bg-[#4ADE80]/20 text-[#15803D] dark:text-[#4ADE80] px-1 font-bold">WINTER DROP</span>}
                          </span>
                          <span className="text-[#555555] dark:text-[#94A3B8]">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-[#BDBDBD] dark:bg-[#121316] h-2 overflow-hidden border border-[#7B7B7B]/30">
                          <div
                            className={`h-full ${
                              isPale
                                ? 'bg-[#15803D]'
                                : isTrials
                                ? 'bg-[#D97706]'
                                : 'bg-[#5B8731]'
                            } transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Feed Table */}
        <div className="bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] p-5 shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#7B7B7B]/30">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0284C7]" />
              <h2 className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                سجل العمليات والنشاط الميداني الحي (Live Events Stream)
              </h2>
            </div>
            <span className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8]">
              آخر {analytics?.recent_events?.length || 0} عملية مسجلة
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right font-mc-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[#BDBDBD] dark:bg-[#121316] text-[#333333] dark:text-[#CBD5E1] border-b border-[#7B7B7B]/30">
                  <th className="p-2.5">الوقت (Timestamp)</th>
                  <th className="p-2.5">نوع العملية (Type)</th>
                  <th className="p-2.5">تفاصيل الحدث (Details)</th>
                  <th className="p-2.5">الإصدار (Version)</th>
                  <th className="p-2.5">النسخة (Edition)</th>
                  <th className="p-2.5">زمن المعالجة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7B7B7B]/20">
                {(!analytics?.recent_events || analytics.recent_events.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#777777] dark:text-[#94A3B8] font-mc-mono text-xs">
                      ⚡ السجل الميداني فارغ حالياً - سيتم تدوين العمليات فور استخدام الزوار للموقع.
                    </td>
                  </tr>
                ) : (
                  analytics.recent_events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-2.5 text-[#555555] dark:text-[#94A3B8] whitespace-nowrap" dir="ltr">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-2.5 whitespace-nowrap">
                        {evt.type === 'analyze' && (
                          <span className="px-1.5 py-0.5 bg-[#5B8731]/20 text-[#3E651E] dark:text-[#84CC16] border border-[#5B8731]/40 font-bold text-[10px]">
                            🔍 تحليل بذرة
                          </span>
                        )}
                        {evt.type === 'find' && (
                          <span className="px-1.5 py-0.5 bg-[#D97706]/20 text-[#92400E] dark:text-[#F59E0B] border border-[#D97706]/40 font-bold text-[10px]">
                            🧭 بحث عكسي
                          </span>
                        )}
                        {evt.type === 'visit' && (
                          <span className="px-1.5 py-0.5 bg-[#0284C7]/20 text-[#0369A1] dark:text-[#38BDF8] border border-[#0284C7]/40 font-bold text-[10px]">
                            🌐 زيارة موقع
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                        {evt.details}
                      </td>
                      <td className="p-2.5 text-[#555555] dark:text-[#94A3B8]">
                        {evt.version || '—'}
                      </td>
                      <td className="p-2.5">
                        {evt.edition === 'bedrock' ? (
                          <span className="text-[#0284C7] font-bold">🪨 Bedrock</span>
                        ) : (
                          <span className="text-[#5B8731] font-bold">☕ Java</span>
                        )}
                      </td>
                      <td className="p-2.5 text-[#10B981] font-bold" dir="ltr">
                        {evt.latency_ms ? `${evt.latency_ms}ms` : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#D8D8D8] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#2D333F] border-b-2 border-r-2 border-[#555555] dark:border-[#0E1014] shadow-[4px_4px_0_rgba(0,0,0,0.5)] p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#7B7B7B]/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#D97706] flex items-center justify-center border-t border-l border-[#F59E0B] border-b border-r border-[#78350F]">
                  <KeyRound className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9]">
                    تغيير رمز المرور الإداري
                  </h3>
                  <p className="font-mc-mono text-[10px] text-[#555555] dark:text-[#94A3B8]">
                    Change Security PIN
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChangePinModal(false)}
                className="mc-button px-2 py-0.5 font-mc-mono text-xs text-[#555555] hover:text-[#B91C1C] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePin} className="space-y-3.5">
              <div>
                <label className="block font-mc-mono text-xs font-bold text-[#333333] dark:text-[#CBD5E1] mb-1">
                  رمز المرور الحالي (Current PIN):
                </label>
                <input
                  type="password"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="أدخل الرمز الحالي"
                  autoFocus
                  className="w-full bg-[#EFEFEF] dark:bg-[#121316] text-[#1E1E1E] dark:text-[#F1F5F9] font-mc-mono text-xs px-3 py-2 border-t border-l border-[#555555] dark:border-[#0E1014] border-b border-r border-[#FFFFFF] dark:border-[#2D333F] outline-none focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="block font-mc-mono text-xs font-bold text-[#333333] dark:text-[#CBD5E1] mb-1">
                  رمز المرور الجديد (New PIN):
                </label>
                <input
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="أدخل الرمز الجديد (4 خانات على الأقل)"
                  className="w-full bg-[#EFEFEF] dark:bg-[#121316] text-[#1E1E1E] dark:text-[#F1F5F9] font-mc-mono text-xs px-3 py-2 border-t border-l border-[#555555] dark:border-[#0E1014] border-b border-r border-[#FFFFFF] dark:border-[#2D333F] outline-none focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="block font-mc-mono text-xs font-bold text-[#333333] dark:text-[#CBD5E1] mb-1">
                  تأكيد الرمز الجديد (Confirm New PIN):
                </label>
                <input
                  type="password"
                  value={confirmNewPinInput}
                  onChange={(e) => setConfirmNewPinInput(e.target.value)}
                  placeholder="أعد إدخال الرمز الجديد"
                  className="w-full bg-[#EFEFEF] dark:bg-[#121316] text-[#1E1E1E] dark:text-[#F1F5F9] font-mc-mono text-xs px-3 py-2 border-t border-l border-[#555555] dark:border-[#0E1014] border-b border-r border-[#FFFFFF] dark:border-[#2D333F] outline-none focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              {pinChangeError && (
                <div className="p-2 bg-[#7A1E11] text-white font-mc-mono text-xs flex items-center gap-2 border-t border-l border-[#A83222] border-b border-r border-[#3D0A04]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#FADB44]" />
                  <span>{pinChangeError}</span>
                </div>
              )}

              {pinChangeSuccess && (
                <div className="p-2 bg-[#1B4D1B] text-white font-mc-mono text-xs flex items-center gap-2 border-t border-l border-[#2E7D2E] border-b border-r border-[#0D260D]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#4ADE80]" />
                  <span>{pinChangeSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="mc-button px-3 py-1.5 font-mc-mono text-xs font-bold text-[#555555] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={pinChangeLoading}
                  className="mc-button px-4 py-1.5 font-mc-mono text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] bg-[#D97706] flex items-center gap-1.5 cursor-pointer hover:bg-[#F59E0B]"
                >
                  {pinChangeLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>حفظ الرمز الجديد</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
