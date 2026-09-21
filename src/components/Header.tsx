import React from 'react';
import { ArrowLeft, Sun, Moon, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  currentStep: number; // 0 = Step 0 (Campus setup), 1-14 = Questions, 15 = Review, -1 = Landing, 16 = Thank You
  totalSteps: number;
  onBack?: () => void;
  showBack?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  title?: string;
  subtitle?: string;
  isOnline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
  isDarkMode = false,
  onToggleTheme,
  title = 'Active Survey Session',
  subtitle = 'Campus Survey',
  isOnline = true,
}) => {
  // Calculate percentage: Step 0 is ~5%, Q1..Q14 is 10% to 90%, Review is 95%
  let progressPercent = 5;
  if (currentStep === 0) {
    progressPercent = 7;
  } else if (currentStep >= 1 && currentStep <= 14) {
    progressPercent = Math.round(7 + (currentStep / 14) * 85);
  } else if (currentStep === 15) {
    progressPercent = 96;
  } else if (currentStep === 16) {
    progressPercent = 100;
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#faf8ff]/90 backdrop-blur-xl border-b border-[#eaedff] pt-safe transition-colors">
      {/* Top micro pulse bar */}
      <div className="bg-[#131b2e] text-[#faf8ff] px-4 py-1 flex items-center justify-between text-[11px] font-bold tracking-wider">
        <div className="flex items-center gap-2 max-w-[70%] truncate">
          <span className="w-2 h-2 rounded-full bg-[#fe932c] animate-pulse shrink-0"></span>
          <span className="text-[#ffdcc3] uppercase tracking-wider">Live Pulse</span>
          <span className="text-[#916f6b]">•</span>
          <span className="text-[#e2e7ff] truncate">Voices from 35 Assam Districts</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#ffdcc3] uppercase tracking-wider shrink-0">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-[#85f8c4]" />
              <span className="text-[10px] hidden sm:inline">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-[#fe932c]" />
              <span className="text-[10px]">Offline Stash</span>
            </>
          )}
        </div>
      </div>

      {/* Main app bar */}
      <div className="h-14 px-4 flex items-center justify-between max-w-[560px] mx-auto w-full">
        <div className="flex items-center gap-3 min-w-0">
          {showBack && (
            <button
              onClick={onBack}
              aria-label="Go Back"
              type="button"
              className="w-10 h-10 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] flex items-center justify-center transition-all active:scale-95 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#dc2626] line-clamp-1">
              {subtitle}
            </span>
            <h1 className="font-headline text-[16px] sm:text-[17px] font-bold tracking-tight text-[#131b2e] truncate">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Mode"
              type="button"
              className="w-9 h-9 rounded-full bg-[#eaedff] text-[#5c403c] hover:text-[#131b2e] flex items-center justify-center transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#fe932c]" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-bold text-[13px] shadow-sm">
            R
          </div>
        </div>
      </div>

      {/* Progress track */}
      {currentStep >= 0 && currentStep <= 15 && (
        <div className="w-full h-1 bg-[#eaedff] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#dc2626] via-[#fe932c] to-[#00825a] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </header>
  );
};
