import React, { useState } from 'react';
import { SurveyState } from '../types';
import {
  Receipt,
  MapPin,
  School,
  Shirt,
  BadgePercent,
  CheckCircle,
  Edit3,
  Rocket,
  Lock,
  ArrowLeft,
  Gift,
  AlertTriangle,
  Loader2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ReviewModalOrViewProps {
  state: SurveyState;
  onEditStep: (stepNumber: number) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

export const ReviewModalOrView: React.FC<ReviewModalOrViewProps> = ({
  state,
  onEditStep,
  onSubmit,
  onBack,
  isSubmitting,
  submitError,
}) => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);

  const displayCollege = state.collegeIsCustom
    ? state.customCollegeText || 'Custom College'
    : state.college || 'Not Selected';

  const preferredCut = Array.isArray(state.answers.q5)
    ? state.answers.q5.join(', ')
    : state.answers.q5 || 'Oversized Fit';

  const preferredPrice = Array.isArray(state.answers.q6)
    ? state.answers.q6.join(', ')
    : state.answers.q6 || '₹400–499';

  return (
    <div className="flex flex-col w-full max-w-[560px] mx-auto px-4 pt-4 pb-28">
      {/* Step Tracker Header */}
      <div className="mb-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dc2626]/10 text-[#dc2626] text-[10px] font-extrabold uppercase tracking-wider">
              Step 15 of 15
            </span>
            <span className="text-[#5c403c] text-[12px] font-bold">Review &amp; Lock Ballot</span>
          </div>
          <span className="text-[11px] uppercase text-[#00825a] font-extrabold">
            96% Ready
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#eaedff] rounded-full overflow-hidden">
          <div className="h-full bg-[#00825a] rounded-full w-[96%] transition-all duration-500" />
        </div>
      </div>

      {/* Hero Header */}
      <div className="mb-6">
        <h2 className="font-headline text-[24px] font-extrabold text-[#131b2e] tracking-tight">
          Review Your Drop Ballot
        </h2>
        <p className="text-[13px] text-[#5c403c] mt-1 leading-relaxed">
          Verify your campus choices before stamping your vote into the official Assam Merch tally.
        </p>
      </div>

      {/* Submit Error Message if any */}
      {submitError && (
        <div className="mb-5 p-4 rounded-2xl bg-[#ffdad6] text-[#93000a] flex items-start gap-3 text-[13px] border border-[#ba1a1a]/20">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#ba1a1a]" />
          <div>
            <strong className="font-bold block">Submission Alert</strong>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      {/* Response Summary Bento Box Card */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-[#eaedff] mb-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#eaedff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffdad6] text-[#93000b] flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#dc2626] tracking-wider">
                  Campus Slip
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00825a]" />
              </div>
              <h3 className="font-headline text-[16px] font-bold text-[#131b2e]">
                Response Summary
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(0)}
            className="text-[11px] font-bold text-[#dc2626] hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit All</span>
          </button>
        </div>

        {/* Bento Grid of Key Choices */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* District */}
          <div className="bg-[#f2f3ff] rounded-2xl p-3 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-[#5c403c]">Assam District</span>
            <div className="flex items-center gap-1.5 mt-1 truncate">
              <MapPin className="w-4 h-4 text-[#dc2626] shrink-0" />
              <span className="text-[13px] font-bold text-[#131b2e] truncate">
                {state.district}
              </span>
            </div>
          </div>

          {/* College */}
          <div className="bg-[#f2f3ff] rounded-2xl p-3 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-[#5c403c]">Institution</span>
            <div className="flex items-center gap-1.5 mt-1 truncate">
              <School className="w-4 h-4 text-[#904d00] shrink-0" />
              <span className="text-[13px] font-bold text-[#131b2e] truncate">
                {displayCollege}
              </span>
            </div>
          </div>

          {/* Year */}
          <div className="bg-[#f2f3ff] rounded-2xl p-3 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-[#5c403c]">Study Year</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-4 h-4 text-[#00825a] shrink-0" />
              <span className="text-[13px] font-bold text-[#131b2e]">
                {state.studyYear} Year
              </span>
            </div>
          </div>

          {/* Selected Fit */}
          <div className="bg-[#f2f3ff] rounded-2xl p-3 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-[#5c403c]">Selected Cut</span>
            <div className="flex items-center gap-1.5 mt-1 truncate">
              <Shirt className="w-4 h-4 text-[#dc2626] shrink-0" />
              <span className="text-[13px] font-bold text-[#131b2e] truncate">
                {preferredCut}
              </span>
            </div>
          </div>

          {/* Preferred Price */}
          <div className="bg-[#f2f3ff] rounded-2xl p-3 flex flex-col justify-between col-span-2">
            <span className="text-[10px] uppercase font-bold text-[#5c403c]">
              Comfort Price Bracket
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <BadgePercent className="w-4 h-4 text-[#904d00] shrink-0" />
              <span className="text-[13px] font-bold text-[#131b2e]">
                {preferredPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Apparel & Aesthetics preview */}
        {state.answers.q3 && (
          <div className="mt-4 pt-3 border-t border-[#eaedff]">
            <span className="text-[10px] uppercase font-bold text-[#5c403c] block mb-1.5">
              Apparel Types Voted:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(state.answers.q3) ? state.answers.q3 : [state.answers.q3]).map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-0.5 rounded-lg bg-[#eaedff] text-[#131b2e] text-[11px] font-bold"
                >
                  {item}
                </span>
              ))}
              {state.otherInputs.q3Other && (
                <span className="px-2.5 py-0.5 rounded-lg bg-[#ffdcc3] text-[#904d00] text-[11px] font-bold">
                  Custom: {state.otherInputs.q3Other}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Design thoughts preview if provided */}
        {state.q11Text && (
          <div className="mt-3 pt-3 border-t border-[#eaedff]">
            <span className="text-[10px] uppercase font-bold text-[#5c403c] block mb-1">
              Your Streetwear Feedback:
            </span>
            <p className="text-[12px] text-[#131b2e] italic bg-[#f2f3ff] p-2.5 rounded-xl">
              “{state.q11Text}”
            </p>
          </div>
        )}
      </div>

      {/* Assam Campus Youth Incentive Card */}
      <div className="bg-gradient-to-r from-[#ffdcc3]/80 to-[#f2f3ff] rounded-3xl p-4 mb-6 flex items-center gap-3.5 border border-[#fe932c]/30 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-[#fe932c] text-white flex items-center justify-center shrink-0 shadow-md">
          <Gift className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-extrabold text-[#dc2626] tracking-wider">
              Drop Perk
            </span>
            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#00825a] text-white font-bold">
              EARLY PASS
            </span>
          </div>
          <h4 className="text-[14px] font-bold text-[#131b2e] leading-tight mt-0.5 truncate">
            ₹150 Merch Voucher Unlocked
          </h4>
          <p className="text-[11px] text-[#5c403c] truncate">
            Valid on {displayCollege} Fest Drop release!
          </p>
        </div>
      </div>

      {/* Hidden honeypot input for bot spam prevention */}
      <input
        type="text"
        name="website_url_field"
        value={state.honeypot}
        onChange={() => {}}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {/* Privacy note */}
      <div className="text-center mb-6">
        <p className="text-[11px] text-[#5c403c]">
          Responses are anonymous and used only for market research.
        </p>
      </div>

      {/* Sticky Bottom Submit Zone */}
      <aside className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#faf8ff]/95 backdrop-blur-xl border-t border-[#eaedff] shadow-xl">
        <div className="max-w-[560px] mx-auto px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="h-14 px-5 rounded-full bg-[#eaedff] text-[#131b2e] text-[14px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#dae2fd] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSubmit}
              className="flex-1 h-14 px-6 rounded-full bg-[#dc2626] hover:bg-[#b70011] text-white font-headline text-[16px] font-bold flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(220,38,38,0.32)] active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Recording campus vote...</span>
                </>
              ) : (
                <>
                  <span>Submit Survey</span>
                  <Rocket className="w-5 h-5 text-white" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[#5c403c] text-[10px] uppercase tracking-widest pt-0.5">
            <Lock className="w-3 h-3 text-[#00825a]" />
            <span>Encrypted • 1 Vote per Student ID</span>
          </div>
        </div>
      </aside>
    </div>
  );
};
