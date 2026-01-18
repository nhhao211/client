'use client';

import React, { useState, useEffect } from 'react';

export function TetDecorations() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {/* Top Left Branch */}
      <div className="absolute -left-10 -top-10 w-40 h-40 opacity-80 animate-swing origin-top-left">
        <svg viewBox="0 0 200 200" className="w-full h-full text-red-500 drop-shadow-lg">
           {/* Simple Cherry Blossom Branch SVG */}
           <path d="M0,0 Q50,100 150,50" fill="none" stroke="#5d4037" strokeWidth="4" />
           <circle cx="50" cy="50" r="5" fill="#fecaca" />
           <circle cx="80" cy="70" r="6" fill="#fecaca" />
           <circle cx="120" cy="40" r="5" fill="#fda4af" />
           <circle cx="140" cy="60" r="4" fill="#fda4af" />
           {/* Lantern on branch */}
           <path d="M100,60 L100,100" stroke="#b91c1c" strokeWidth="2" />
           <rect x="90" y="100" width="20" height="30" rx="5" fill="#ef4444" />
           <path d="M90,100 L110,100 L105,90 L95,90 Z" fill="#b91c1c" />
           <path d="M90,130 L110,130 L105,140 L95,140 Z" fill="#b91c1c" />
        </svg>
      </div>

      {/* Bottom Left Lanterns */}
      <div className="absolute left-4 bottom-4 w-24 h-32 opacity-90 animate-swing-slow origin-top">
         <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-md">
             {/* String */}
            <line x1="50" y1="0" x2="50" y2="40" stroke="#f59e0b" strokeWidth="2" />
             {/* Lantern Body */}
            <path d="M30,40 Q20,70 30,100 H70 Q80,70 70,40 Z" fill="#dc2626" />
            <path d="M30,40 H70" stroke="#f59e0b" strokeWidth="2" />
            <path d="M30,100 H70" stroke="#f59e0b" strokeWidth="2" />
            {/* Tassel */}
            <line x1="50" y1="100" x2="50" y2="120" stroke="#dc2626" strokeWidth="2" />
            <circle cx="50" cy="120" r="2" fill="#f59e0b" />
            <path d="M50,122 Q40,140 50,150 Q60,140 50,122" fill="#ef4444" />
         </svg>
      </div>
    </div>
  );
}
