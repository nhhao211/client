'use client';

import React, { useState, useEffect } from 'react';
import { useTetCountdown } from '@/hooks/useTetCountdown';
import Image from 'next/image';
import binhNgoIcon from '@/lib/images/binhngo.png';
import { cn } from '@/lib/utils';

export function TetCountdown() {
  const { timeLeft, isTet } = useTetCountdown();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn(
      "relative w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white overflow-hidden shadow-md transition-all duration-500 ease-in-out",
      isTet ? "py-4" : "py-2"
    )}>
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
        
        {/* Left Side: Message */}
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <Image 
            src={binhNgoIcon} 
            alt="Xuân Bính Ngọ" 
            className="h-12 w-12 object-contain flex-shrink-0" 
            unoptimized
            loading="lazy"
          />
          <div className="text-sm md:text-base font-medium tracking-normal">
            {isTet ? (
              <span className="font-bold text-yellow-200 text-lg tracking-normal">🌸 Chúc Mừng Năm Mới - Xuân Bính Ngọ 2026! 🌸</span>
            ) : (
              <span className="flex flex-col md:flex-row md:items-center gap-1 tracking-normal">
                <span className="text-yellow-100">Sắp đến Tết rồi!</span>
                <span className="hidden md:inline text-red-200">|</span>
                <span className="font-sans italic text-yellow-50 tracking-normal">"Bính Ngọ vừa tới - Phấn khởi mọi nơi - Tiền rơi vào túi - Hạnh phúc đầy vơi."</span>
              </span>
            )}
          </div>
        </div>

        {/* Center/Right: Countdown */}
        {!isTet && (
           <div className="flex items-center gap-3 font-mono text-sm md:text-base bg-red-800/30 px-3 py-1 rounded-full border border-red-400/30 backdrop-blur-sm">
             <div className="flex flex-col items-center leading-none">
               <span className="font-bold text-yellow-300">{String(timeLeft.days).padStart(2, '0')}</span>
               <span className="text-[10px] text-red-200 uppercase">Ngày</span>
             </div>
             <span className="text-red-300 pb-2">:</span>
             <div className="flex flex-col items-center leading-none">
               <span className="font-bold text-yellow-300">{String(timeLeft.hours).padStart(2, '0')}</span>
               <span className="text-[10px] text-red-200 uppercase">Giờ</span>
             </div>
             <span className="text-red-300 pb-2">:</span>
             <div className="flex flex-col items-center leading-none">
               <span className="font-bold text-yellow-300">{String(timeLeft.minutes).padStart(2, '0')}</span>
               <span className="text-[10px] text-red-200 uppercase">Phút</span>
             </div>
             <span className="text-red-300 pb-2">:</span>
             <div className="flex flex-col items-center leading-none">
                <span className="font-bold text-yellow-300 w-5 text-center">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[10px] text-red-200 uppercase">Giây</span>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
