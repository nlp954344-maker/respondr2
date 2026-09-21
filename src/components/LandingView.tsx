import React from 'react';
import { ArrowRight, Zap, MapPin, Users, Flame, Truck, Lock, FileSpreadsheet, ShieldAlert } from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
  onOpenSheetsGuide: () => void;
  hasAlreadySubmitted?: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStart,
  onOpenSheetsGuide,
  hasAlreadySubmitted = false,
}) => {
  return (
    <div className="flex flex-col w-full max-w-[560px] mx-auto px-4 pt-4 pb-28">
      {/* Top Navigation & Campus Tag */}
      <header className="flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#131b2e] border-2 border-[#dc2626] flex items-center justify-center text-white font-extrabold shadow-md overflow-hidden relative">
            <span className="font-headline text-[20px] text-[#dc2626]">R</span>
            <span className="font-headline text-[13px] text-[#fe932c] absolute bottom-1 right-2">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-[18px] font-extrabold tracking-tight text-[#131b2e] leading-tight">
              [respondr]
            </span>
            <span className="text-[10px] text-[#dc2626] font-bold uppercase tracking-wider">
              Assam Campus Merch
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSheetsGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd] transition-all text-[11px] font-bold shadow-sm"
            title="View Google Sheets Apps Script Backend Code & Setup"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#00825a]" />
            <span>Sheets Sync</span>
          </button>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#ffdcc3] text-[#904d00] text-[11px] font-bold">
            <Flame className="w-3.5 h-3.5 text-[#fe932c]" />
            <span>Drop 01</span>
          </div>
        </div>
      </header>

      {/* Gentle notice if already submitted from this device */}
      {hasAlreadySubmitted && (
        <div className="mb-4 p-3 rounded-2xl bg-[#ffdcc3]/80 border border-[#fe932c]/30 flex items-start gap-2.5 text-[12px] text-[#904d00]">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#fe932c]" />
          <div>
            <strong className="font-bold">You have already submitted from this device.</strong>
            <p className="mt-0.5 text-[11px]">
              You can still take the survey again if you want to submit updated votes or vote for a friend’s college!
            </p>
          </div>
        </div>
      )}

      {/* Live District & Velocity Badges */}
      <section className="flex flex-col gap-2 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcc3] text-[#904d00] text-[12px] font-bold shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#904d00]" />
            <span>Takes under 2 mins</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dae2fd] text-[#131b2e] text-[12px] font-semibold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00825a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00825a]"></span>
            </span>
            <span>2,480+ voted across Assam</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#eaedff] text-[#5c403c] text-[12px]">
          <MapPin className="w-4 h-4 text-[#dc2626] shrink-0" />
          <span className="truncate">
            Campus reps live across <strong className="text-[#131b2e]">35 districts of Assam</strong>
          </span>
        </div>
      </section>

      {/* Editorial Streetwear Hero */}
      <section className="flex flex-col mb-6">
        <div className="relative mb-2">
          <h1 className="font-headline text-[32px] sm:text-[36px] font-extrabold text-[#131b2e] leading-[1.15] tracking-tight">
            Would you wear your{' '}
            <span className="relative inline-block text-[#dc2626]">
              college
              <svg
                className="absolute -bottom-1.5 left-0 w-full h-2 text-[#dc2626]"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q25,0 50,5 T100,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            ?
          </h1>
          <div className="w-14 h-1.5 bg-[#dc2626] rounded-full mt-3" />
        </div>
        <p className="text-[15px] leading-relaxed text-[#5c403c] mt-2">
          Help co-create Assam’s first streetwear-grade college apparel. Drop your honest takes, shape the oversized fit, and unlock early secret drop access for your campus.
        </p>
      </section>

      {/* Streetwear Drop Lookbook Card */}
      <div className="relative bg-white rounded-3xl p-4 shadow-lg border border-[#eaedff] overflow-hidden mb-6">
        {/* Accent Tag */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000b] text-[10px] font-extrabold uppercase tracking-wider">
              Sample Drop 001
            </span>
            <span className="text-[10px] font-bold text-[#5c403c] uppercase tracking-widest">
              GAU • DIB • SIL • JEC
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#00825a] bg-[#85f8c4]/40 px-2.5 py-0.5 rounded-full">
            Heavy 280 GSM
          </span>
        </div>

        {/* Product Visual Mockup */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#eaedff] mb-3 shadow-inner">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR4jn4Toik6Vwbw4NlktP5zxwBW-qcU1TRSdK7hMcif9_7AUlJh5gHbIx4jZdUQZhm9j_QJOMxhCQBAU4hgLvi2ujCYP4_aoaEV9my-GUl-_-FUg1FQSZneE0B_2HcFx38j_itwOlUMoR_ChkJF_7fF2f2ZAMRXue77nyRed3UDnbE_tRfmLn3QaBqk4bBzmRZlaGZ50D_bm5C4Ra_GlN1VGPw8wKufGLt2OHtE5ix6788uW_dFDA20A"
            alt="Oversized matte black boxy t-shirt with subtle traditional red and white Assamese Gamosa geometric embroidery pattern on the nape"
            className="w-full h-full object-cover"
          />

          {/* Overlay Stickers */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-1">
            <span className="px-3 py-1 rounded-xl bg-[#283044]/90 backdrop-blur-sm text-white font-headline text-[15px] font-bold shadow-md">
              Boxy Fit
            </span>
            <span className="px-2 py-0.5 rounded bg-[#dc2626] text-white text-[10px] font-extrabold tracking-wider uppercase w-fit">
              Unisex Cut
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 shadow-md backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse"></span>
            <span className="text-[10px] text-[#131b2e] font-extrabold uppercase tracking-wide">
              Gamosa Hemline
            </span>
          </div>
        </div>

        {/* Drop Details & Swatches */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#131b2e]">Brahmaputra Acid Wash</span>
            <span className="text-[12px] text-[#5c403c]">Guwahati, Jorhat & Dibrugarh Campus Exclusive</span>
          </div>
          <div className="flex items-center gap-1.5" title="Available sample colorways">
            <span className="w-5 h-5 rounded-full bg-[#e2e7ff] border border-white shadow-sm" title="Mist White" />
            <span className="w-5 h-5 rounded-full bg-[#dc2626] border border-white shadow-sm" title="Gamosa Red" />
            <span className="w-5 h-5 rounded-full bg-[#283044] border border-white shadow-sm" title="Carbon Black" />
          </div>
        </div>
      </div>

      {/* Value Props Grid */}
      <section className="grid grid-cols-3 gap-2.5 mb-7">
        <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#eaedff] shadow-sm">
          <Users className="w-5 h-5 text-[#dc2626] mb-1.5" />
          <span className="text-[12px] font-bold text-[#131b2e]">100% Student</span>
          <span className="text-[10px] text-[#5c403c] mt-0.5">Designed by peers</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#eaedff] shadow-sm">
          <Zap className="w-5 h-5 text-[#fe932c] mb-1.5" />
          <span className="text-[12px] font-bold text-[#131b2e]">No Boring Form</span>
          <span className="text-[10px] text-[#5c403c] mt-0.5">Streetwear voting</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#eaedff] shadow-sm">
          <Truck className="w-5 h-5 text-[#00825a] mb-1.5" />
          <span className="text-[12px] font-bold text-[#131b2e]">Campus Drop</span>
          <span className="text-[10px] text-[#5c403c] mt-0.5">Free college desk pickup</span>
        </div>
      </section>

      {/* Assamese Traditional Weave Motif Divider */}
      <div aria-hidden="true" className="w-full flex items-center justify-center gap-1 py-2 mb-6">
        <div className="h-0.5 flex-1 bg-[#dae2fd]" />
        <div className="flex items-center gap-1.5 px-2">
          <div className="w-2 h-2 rotate-45 bg-[#dc2626]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#fe932c]" />
          <div className="w-2.5 h-2.5 rotate-45 bg-[#dc2626]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#fe932c]" />
          <div className="w-2 h-2 rotate-45 bg-[#dc2626]" />
        </div>
        <div className="h-0.5 flex-1 bg-[#dae2fd]" />
      </div>

      {/* Campus Whispers Live Snippets */}
      <section className="flex flex-col gap-2.5 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#131b2e]">Campus Whispers</span>
          <span className="text-[10px] text-[#dc2626] uppercase font-extrabold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-ping" />
            Live Student Feed
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="p-3 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ffdad6] text-[#93000b] flex items-center justify-center font-bold text-[12px] shrink-0">
              CU
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#131b2e]">Cotton University, Panbazar</span>
                <span className="text-[10px] text-[#5c403c]">4m ago</span>
              </div>
              <p className="text-[12px] text-[#5c403c] mt-0.5">
                “Please don’t give us generic synthetic hoodies. We want heavyweight boxy tees with Assamese typography!”
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ffdcc3] text-[#904d00] flex items-center justify-center font-bold text-[12px] shrink-0">
              DU
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#131b2e]">Dibrugarh University</span>
                <span className="text-[10px] text-[#5c403c]">12m ago</span>
              </div>
              <p className="text-[12px] text-[#5c403c] mt-0.5">
                “Voted for the oversized varsity jacket. Need that Muga-silk inspired inner lining!”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Action Hub */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#faf8ff]/95 backdrop-blur-xl border-t border-[#eaedff] pb-safe pt-3 shadow-xl">
        <div className="max-w-[560px] mx-auto px-4 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onStart}
            className="w-full h-14 rounded-full bg-[#dc2626] hover:bg-[#b70011] text-white font-headline text-[17px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all"
          >
            <span>Start Survey</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center gap-1.5 pb-1">
            <Lock className="w-3.5 h-3.5 text-[#00825a]" />
            <span className="text-[11px] text-[#5c403c] font-medium">
              100% Anonymous &amp; Free • Made with ❤️ in Assam
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
