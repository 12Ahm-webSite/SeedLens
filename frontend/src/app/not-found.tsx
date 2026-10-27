import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, MapPinOff } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#C8C8C8] dark:bg-[#121316] text-[#1E1E1E] dark:text-[#E2E8F0]">
      <div className="mc-gui-panel max-w-md w-full p-8 text-center border-2 border-[#FFFFFF] dark:border-[#363B47] shadow-[4px_4px_0_rgba(0,0,0,0.35)]">
        {/* Minecraft Void / Missing Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-[#866043] border-2 border-[#A87954] border-b-[#4E3523] border-r-[#4E3523] flex items-center justify-center shadow-[2px_2px_0_#000]">
          <MapPinOff className="w-8 h-8 text-[#FADB44]" />
        </div>

        <div className="inline-block px-3 py-1 bg-[#1E1E1E] text-[#FADB44] font-mc-mono text-xs font-bold mb-3 border border-[#555]">
          ERROR: 404_CHUNK_NOT_GENERATED
        </div>

        <h1 className="font-mc-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-2">
          إحداثيات غير موجودة
        </h1>
        <p className="font-mc-mono text-xs text-[#555555] dark:text-[#94A3B8] mb-6">
          Coords: X:NaN Y:0 Z:NaN • Chunk outside world boundary
        </p>

        <p className="font-mc-body text-sm text-[#333333] dark:text-[#CBD5E1] leading-relaxed mb-6">
          الصفحة أو الإحداثيات التي تحاول الوصول إليها غير موجودة في هذا العالم، أو ربما تم نقلها.
          <br />
          <span className="text-xs text-[#666666] dark:text-[#888888]">
            (The requested world chunk or route does not exist.)
          </span>
        </p>

        <Link
          href="/"
          className="mc-button w-full py-2.5 px-4 font-mc-heading text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Compass className="w-4 h-4 text-[#5B8731]" />
          <span>العودة إلى المحلل الرئيسي (Back to Analyzer)</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#888888]" />
        </Link>
      </div>
    </div>
  );
}
