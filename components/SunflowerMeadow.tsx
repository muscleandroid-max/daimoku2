import React, { useMemo } from 'react';
import { CloudSun } from 'lucide-react';

interface SunflowerMeadowProps {
  totalValue: number;
}

// Pseudo-random generator to keep positions stable across renders
// Returns a number between 0 and 1 based on an index
const seededRandom = (index: number) => {
  const x = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

interface FlowerProps {
  x: number;
  y: number;
  scale: number;
  zIndex: number;
  rotation: number;
  delay: number;
}

// Memoized Sunflower component for performance
const Sunflower = React.memo(({ x, y, scale, zIndex, rotation, delay }: FlowerProps) => (
  <div
    className="absolute origin-bottom-center transition-transform hover:scale-150 duration-300 ease-in-out cursor-pointer group will-change-transform"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      zIndex: zIndex,
      animation: `fadeIn 0.5s ease-out forwards`,
      animationDelay: `${delay}ms`,
      opacity: 0 // Start hidden for animation
    }}
  >
    <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-sm">
      {/* Stem (slightly curved) */}
      <path d="M50 100 Q50 80 50 60" stroke="#166534" strokeWidth="4" fill="none" />
      
      {/* Leaves */}
      <path d="M50 85 Q20 75 45 65" fill="#15803d" />
      <path d="M50 85 Q80 75 55 65" fill="#15803d" />

      {/* Petals */}
      <g className="origin-center">
        <path d="M50 20 L55 40 L60 20 L65 40 L75 25 L70 45 L85 40 L75 55 L90 60 L75 65 L85 75 L65 70 L60 85 L55 70 L50 85 L45 70 L40 85 L35 70 L15 75 L25 65 L10 60 L25 55 L15 40 L30 45 L25 25 L35 40 L40 20 L45 40 Z" fill="#facc15" />
        <circle cx="50" cy="50" r="28" fill="#fef08a" opacity="0.6" />
      </g>

      {/* Center */}
      <circle cx="50" cy="50" r="16" fill="#78350f" />
      <circle cx="50" cy="50" r="12" fill="#92400e" className="group-hover:fill-[#78350f] transition-colors" />
      
      {/* Detail Dots */}
      <circle cx="45" cy="45" r="2" fill="#451a03" />
      <circle cx="55" cy="45" r="2" fill="#451a03" />
      <circle cx="45" cy="55" r="2" fill="#451a03" />
      <circle cx="55" cy="55" r="2" fill="#451a03" />
    </svg>
  </div>
));

export const SunflowerMeadow: React.FC<SunflowerMeadowProps> = ({ totalValue }) => {
  // Calculate flower count: 1 flower per 1000 units
  const flowerCount = Math.max(0, Math.floor(totalValue / 1000));
  
  // Cap visual rendering at 1000 flowers
  const displayCount = Math.min(flowerCount, 1000);
  
  // Generate flower positions based on index
  // Use useMemo to avoid recalculating unless count changes, but seededRandom ensures stability
  const flowers = useMemo(() => {
    const items = [];
    for (let i = 0; i < displayCount; i++) {
      // Generate pseudo-random values based on index 'i'
      const r1 = seededRandom(i);
      const r2 = seededRandom(i + 10000);
      const r3 = seededRandom(i + 20000);

      // X Position: 2% to 98%
      const x = 2 + r1 * 96;

      // Y Position: 10% to 95% (relative to the green field)
      // Higher Y means closer to bottom (foreground)
      const y = 5 + r2 * 90;

      // Scale based on Y (Depth): Further away (smaller y) = smaller scale
      // Min scale 0.4, Max scale 1.1
      const scale = 0.4 + (y / 100) * 0.7;

      // Z-Index based on Y: Closer to bottom = higher z-index
      const zIndex = Math.floor(y * 10);

      // Slight random rotation for natural look (-15 to 15 deg)
      const rotation = (r3 - 0.5) * 30;

      // Staggered animation delay
      const delay = Math.min(i * 5, 1000);

      items.push({ id: i, x, y, scale, zIndex, rotation, delay });
    }
    
    // Sort by Y so that elements lower on screen (foreground) are rendered last in DOM
    // This helps with natural layering if z-index isn't enough context
    return items.sort((a, b) => a.y - b.y);
  }, [displayCount]);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 mt-8 relative bg-white">
      {/* Sky Section - Fixed Height */}
      <div className="h-40 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 relative z-0">
        <div className="absolute top-4 left-6 flex items-center gap-2 bg-white/30 backdrop-blur-sm p-2 rounded-lg text-sky-900 shadow-sm border border-white/40 z-20">
           <CloudSun className="w-6 h-6 text-amber-500" />
           <div>
             <span className="text-xs font-bold uppercase tracking-wider block opacity-70">Meadow Status</span>
             <span className="font-bold text-lg leading-none">
               {flowerCount.toLocaleString()} <span className="text-sm font-normal">輪のひまわり</span>
             </span>
           </div>
        </div>
        
        {/* Decorative clouds */}
        <div className="absolute top-8 right-20 w-20 h-8 bg-white/60 rounded-full blur-sm opacity-80"></div>
        <div className="absolute top-16 right-48 w-32 h-10 bg-white/40 rounded-full blur-md opacity-60"></div>
      </div>

      {/* Grass/Field Section - Overlapping Area */}
      {/* We make this container tall enough to hold the flowers with depth */}
      <div className="bg-gradient-to-b from-emerald-300 via-emerald-500 to-green-800 h-[500px] relative -mt-8 z-10 overflow-hidden">
        
        {/* Horizon blend */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-sky-100/30 to-transparent pointer-events-none"></div>

        {displayCount === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-emerald-900/50 pb-20">
              <p className="text-lg font-medium">まだ種は撒かれていません...</p>
              <p className="text-sm">1000編につき1輪の花が咲きます</p>
           </div>
        ) : (
          <div className="absolute inset-0 top-8">
            {flowers.map((f) => (
              <Sunflower key={f.id} {...f} />
            ))}
          </div>
        )}
        
        {flowerCount > 1000 && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20 z-50">
                他 {flowerCount - 1000} 輪は表示上限のため省略されています
            </div>
        )}
      </div>
      
      {/* Decorative Soil Line */}
      <div className="h-3 bg-[#3E2723] relative z-20"></div>
      
      {/* CSS Keyframes for fade in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0) translateY(20px); }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
