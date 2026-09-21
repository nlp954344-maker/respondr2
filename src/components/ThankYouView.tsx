import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Gift,
  Copy,
  CheckCircle,
  Share2,
  Send,
  Link2,
  MapPin,
  RefreshCw,
  Heart,
  Flame,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ASSAM_DISTRICTS } from '../data/colleges';

interface ThankYouViewProps {
  sessionId: string;
  district: string;
  college: string;
  onResetForFriend: () => void;
}

export const ThankYouView: React.FC<ThankYouViewProps> = ({
  sessionId,
  district,
  college,
  onResetForFriend,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#dc2626', '#fe932c', '#00825a', '#ffdcc3'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleCopyPassId = () => {
    navigator.clipboard?.writeText(sessionId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Vote for ${college || 'our college'} in the Assam Campus Streetwear Drop! First 500 respondents get 20% off: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Vote now for ${college || 'our college'} in the official Assam Campus Merch Drop!`
    );
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  // Sample top district standings for the live heatmap
  const topDistricts = [
    { name: district || 'Kamrup Metropolitan', votes: 1420, percent: 92 },
    { name: 'Dibrugarh', votes: 890, percent: 68 },
    { name: 'Jorhat', votes: 760, percent: 59 },
    { name: 'Cachar (Silchar)', votes: 640, percent: 48 },
    { name: 'Sonitpur (Tezpur)', votes: 520, percent: 41 },
    { name: 'Nagaon', votes: 410, percent: 34 },
  ];

  return (
    <div className="flex flex-col w-full max-w-[560px] mx-auto px-4 pt-6 pb-20">
      {/* Celebration Header */}
      <div className="flex flex-col items-center text-center pt-2 px-1 mb-6">
        {/* Pulsing Green Success Halo */}
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute w-28 h-28 rounded-full bg-[#85f8c4]/40 animate-ping opacity-30" />
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#fe932c]/20 to-[#00825a]/30 blur-md" />
          <div className="relative w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-[#eaedff]">
            <div className="w-14 h-14 rounded-full bg-[#00825a] flex items-center justify-center text-white shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcc3] text-[#904d00] text-[10px] font-extrabold tracking-widest uppercase mb-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fe932c]" />
          <span>RESPONSE RECORDED!</span>
        </div>

        <h2 className="font-headline text-[24px] sm:text-[28px] font-extrabold text-[#131b2e] tracking-tight leading-tight max-w-sm mb-2">
          You just put your campus on the merch map! 🔥
        </h2>

        <p className="text-[13px] leading-relaxed text-[#5c403c] max-w-sm px-2">
          Thank you! Your inputs are directly helping build Assam’s first streetwear-grade college merchandise collection. Cotton University, AEC, Dibrugarh, and 30+ districts are leading the votes.
        </p>
      </div>

      {/* Perks Unlocked Card */}
      <div className="relative w-full rounded-3xl bg-white p-5 shadow-lg border border-[#eaedff] overflow-hidden mb-5">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#ffdad6]/30 pointer-events-none blur-xl" />
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#dc2626] via-[#fe932c] to-[#00825a]" />

        <div className="flex items-center justify-between gap-2 mb-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#ffdcc3] flex items-center justify-center text-[#904d00]">
              <Gift className="w-4 h-4" />
            </span>
            <h3 className="font-headline text-[16px] font-bold text-[#131b2e]">
              Perks Unlocked
            </h3>
          </div>
          <span className="text-[10px] uppercase px-2.5 py-1 rounded-full bg-[#85f8c4]/40 text-[#006646] font-extrabold tracking-wide">
            DROP PASS #01
          </span>
        </div>

        <div className="rounded-2xl bg-[#f2f3ff] p-3.5 mb-4 border border-[#eaedff]">
          <p className="text-[12px] text-[#131b2e] font-medium leading-relaxed">
            🎁 <strong className="font-bold text-[#dc2626]">Early Bird Perks:</strong> First 500 respondents get{' '}
            <span className="text-[#005137] bg-[#85f8c4] px-1.5 py-0.5 rounded font-extrabold">
              20% off
            </span>{' '}
            when the first drop goes live in {district || 'your district'}.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#5c403c] font-bold">
              Your Digital Street Pass ID
            </span>
            <span className="text-[11px] text-[#00825a] font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Verified Student
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#dae2fd] px-4 py-3 rounded-2xl">
            <span className="font-mono font-bold text-[15px] tracking-wider text-[#131b2e] select-all">
              {sessionId}
            </span>
            <button
              type="button"
              onClick={handleCopyPassId}
              className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#131b2e] active:scale-95 shadow-sm transition-all"
              title="Copy Street Pass ID"
            >
              {copiedId ? (
                <Check className="w-4 h-4 text-[#00825a]" />
              ) : (
                <Copy className="w-4 h-4 text-[#5c403c]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Batchmate Momentum Card */}
      <div className="w-full rounded-3xl bg-[#f2f3ff] border border-[#eaedff] p-5 shadow-sm space-y-3 mb-5">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#131b2e]">Batchmate Momentum</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#131b2e] text-[10px] font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00825a] animate-ping" />
            <span>142 students joined</span>
          </div>
        </div>

        <p className="text-[12px] text-[#5c403c] leading-relaxed">
          Unlock custom oversize hoodies faster for {college || 'your campus'} by sharing the drop ballot with your branch groups.
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="h-12 rounded-2xl bg-[#00825a] hover:bg-[#006646] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleShareTelegram}
            className="h-12 rounded-2xl bg-[#dae2fd] hover:bg-[#e2e7ff] text-[#131b2e] text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 text-[#dc2626]" />
            <span>Telegram</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="h-12 rounded-2xl bg-[#dae2fd] hover:bg-[#e2e7ff] text-[#131b2e] text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-[#00825a]" />
            ) : (
              <Link2 className="w-4 h-4 text-[#5c403c]" />
            )}
            <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Live District Heatmap Accordion */}
      <div className="w-full bg-white rounded-3xl border border-[#eaedff] p-4 shadow-sm mb-5">
        <button
          type="button"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="w-full flex items-center justify-between text-left font-bold text-[13px] text-[#131b2e]"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#dc2626]" />
            <span>View Live District Heatmap (35 Districts)</span>
          </div>
          {showHeatmap ? (
            <ChevronUp className="w-4 h-4 text-[#5c403c]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5c403c]" />
          )}
        </button>

        {showHeatmap && (
          <div className="mt-4 pt-3 border-t border-[#eaedff] flex flex-col gap-2.5 animate-in fade-in duration-200">
            <p className="text-[11px] text-[#5c403c]">
              Real-time student voting density across Assam for Batch #01 merch allocation:
            </p>
            {topDistricts.map((item, idx) => (
              <div key={item.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#131b2e]">
                    #{idx + 1} {item.name}
                  </span>
                  <span className="text-[#904d00] font-bold">{item.votes} Votes</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#dc2626] to-[#fe932c] rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Another Response for a Friend */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onResetForFriend}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-[13px] font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <RefreshCw className="w-4 h-4 text-[#dc2626]" />
          <span>Submit Another Response for a Friend</span>
        </button>
      </div>

      {/* Footer Branding Emblem */}
      <div className="pt-8 flex flex-col items-center justify-center text-center gap-2">
        <div className="w-12 h-12 rounded-full bg-[#131b2e] border-2 border-[#dc2626] flex items-center justify-center text-white font-extrabold shadow-md">
          <span className="font-headline text-[18px] text-[#dc2626]">R</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="font-headline text-[16px] font-extrabold tracking-tight text-[#131b2e]">
              [respondr]
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffdcc3] text-[#904d00] uppercase font-extrabold">
              Assam
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-[#5c403c] pt-0.5">
            Culture • Identity • Streetwear
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-[#dae2fd] text-[#5c403c] text-[10px] font-bold">
          <Heart className="w-3 h-3 text-[#dc2626] fill-[#dc2626]" />
          <span>Crafted for Cottonians, AECians, &amp; Assam Youth</span>
        </div>
      </div>
    </div>
  );
};
