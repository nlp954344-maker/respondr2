import React, { useState } from 'react';
import { QuestionConfig } from '../types';
import {
  Check,
  CheckCircle,
  AlertCircle,
  Clock,
  Radio,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface QuestionCardProps {
  question: QuestionConfig;
  totalQuestions: number;
  currentAnswer: string | string[] | undefined;
  otherText: string;
  longText: string;
  district: string;
  college: string;
  onSelectSingle: (questionId: string, value: string) => void;
  onToggleMulti: (questionId: string, value: string, maxSelect?: number) => void;
  onUpdateOtherText: (key: 'q3Other' | 'q4Other' | 'q12Other', value: string) => void;
  onUpdateLongText: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  totalQuestions,
  currentAnswer,
  otherText,
  longText,
  district,
  college,
  onSelectSingle,
  onToggleMulti,
  onUpdateOtherText,
  onUpdateLongText,
  onNext,
  onBack,
  isLastQuestion,
}) => {
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Time remaining estimation
  const stepsRemaining = totalQuestions - question.stepNumber + 1;
  const approxSecondsLeft = stepsRemaining * 8;
  const timeDisplay =
    approxSecondsLeft > 60
      ? `~${Math.ceil(approxSecondsLeft / 60)}m left`
      : `~${approxSecondsLeft}s left`;

  const percentComplete = Math.round((question.stepNumber / totalQuestions) * 100);

  // Handle multi-select array
  const selectedValues = Array.isArray(currentAnswer)
    ? currentAnswer
    : currentAnswer
    ? [currentAnswer]
    : [];

  const handleValidateAndProceed = () => {
    if (question.required) {
      if (question.type === 'text') {
        if (!longText.trim()) {
          triggerError('Please provide your thoughts before proceeding.');
          return;
        }
      } else if (selectedValues.length === 0) {
        triggerError('Please select an option before moving to the next question.');
        return;
      }

      // If 'Other (Specify)' is selected, ensure other text is filled
      if (
        question.allowOther &&
        selectedValues.includes('Other (Specify)') &&
        !otherText.trim()
      ) {
        triggerError('Please specify your custom concept in the text box below.');
        return;
      }
    }

    setErrorMessage(null);
    onNext();
  };

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 500);
  };

  return (
    <div className="flex flex-col w-full max-w-[560px] mx-auto px-4 pt-4 pb-28">
      {/* Kinetic Progress Header Tracker Card */}
      <div className="bg-[#eaedff] rounded-2xl p-4 shadow-sm relative overflow-hidden mb-6">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#ffdcc3] opacity-50 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#dc2626] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                DROP QUESTION {String(question.stepNumber).padStart(2, '0')} OF {totalQuestions}
              </span>
              <span className="text-[12px] text-[#5c403c] font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#5c403c]" />
                {timeDisplay}
              </span>
            </div>
            <span className="font-headline text-[16px] text-[#dc2626] font-bold">
              {percentComplete}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-[#dae2fd] overflow-hidden">
            <div
              className="h-full bg-[#dc2626] rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(220,38,38,0.4)]"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[#5c403c] text-[11px]">
            <span className="flex items-center gap-1 truncate max-w-[70%]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00825a] shrink-0" />
              <span className="truncate">{college || district} Cohort</span>
            </span>
            <span className="text-[#904d00] font-bold uppercase tracking-wider shrink-0">
              ASSAM DROP SZN
            </span>
          </div>
        </div>
      </div>

      {/* Error alert with shake animation */}
      {errorMessage && (
        <div
          className={`mb-5 p-3.5 rounded-2xl bg-[#ffdad6] text-[#93000a] flex items-start gap-2.5 text-[13px] border border-[#ba1a1a]/20 ${
            errorShake ? 'animate-shake' : ''
          }`}
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#ba1a1a]" />
          <div>
            <strong className="font-bold block">Selection Required</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Question Header & Category */}
      <div className="flex flex-col gap-1.5 mb-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#ffdcc3] text-[#904d00] text-[10px] uppercase font-bold tracking-wider">
              {question.categoryTag || question.category}
            </span>
            {question.required ? (
              <span className="text-[10px] text-[#dc2626] uppercase font-extrabold bg-[#ffdad6]/60 px-2 py-0.5 rounded">
                Required
              </span>
            ) : (
              <span className="text-[10px] text-[#00825a] uppercase font-bold bg-[#85f8c4]/40 px-2 py-0.5 rounded">
                Optional
              </span>
            )}
          </div>

          {/* Multi-Select Max limit counter */}
          {question.type === 'multi' && question.maxSelect && (
            <div
              className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all ${
                selectedValues.length >= question.maxSelect
                  ? 'bg-[#fe932c] text-[#131b2e] animate-pulse'
                  : 'bg-[#eaedff] text-[#131b2e]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#dc2626]" />
              <span>
                {selectedValues.length} of {question.maxSelect} selected
                {selectedValues.length >= question.maxSelect ? ' (Limit reached)' : ''}
              </span>
            </div>
          )}
        </div>

        <h2 className="font-headline text-[20px] sm:text-[22px] text-[#131b2e] font-bold leading-tight mt-1">
          {question.label}
        </h2>

        {question.subtitle && (
          <p className="text-[13px] text-[#5c403c] leading-relaxed mt-1">
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Render Options: Single Select, Multi Select, or Long Text */}
      {question.type === 'single' && (
        <div className="flex flex-col gap-3">
          {question.options?.map((opt) => {
            const isSelected = selectedValues.includes(opt.label);
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  onSelectSingle(question.id, opt.label);
                  setErrorMessage(null);
                }}
                className={`group flex items-center justify-between p-4 rounded-2xl text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#dc2626] text-white shadow-md'
                    : 'bg-white hover:bg-[#f2f3ff] text-[#131b2e] border border-[#eaedff] shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-white text-[#dc2626] shadow-sm'
                        : 'bg-[#eaedff] text-[#5c403c]'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-5 h-5 font-bold" />
                    ) : (
                      <Radio className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline text-[15px] font-bold leading-snug">
                        {opt.label}
                      </span>
                      {opt.tag && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-[#ffdcc3] text-[#904d00]'
                          }`}
                        >
                          {opt.tag}
                        </span>
                      )}
                    </div>
                    {opt.description && (
                      <span
                        className={`text-[12px] leading-relaxed mt-0.5 ${
                          isSelected ? 'text-white/90' : 'text-[#5c403c]'
                        }`}
                      >
                        {opt.description}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-white bg-white'
                      : 'border-[#dae2fd] bg-transparent'
                  }`}
                >
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'multi' && (
        <div className="flex flex-wrap gap-2.5">
          {question.options?.map((opt) => {
            const isSelected = selectedValues.includes(opt.label);
            const isLimitReached =
              !isSelected &&
              Boolean(question.maxSelect) &&
              selectedValues.length >= (question.maxSelect || 99);

            return (
              <button
                key={opt.label}
                type="button"
                disabled={isLimitReached}
                onClick={() => {
                  onToggleMulti(question.id, opt.label, question.maxSelect);
                  setErrorMessage(null);
                }}
                className={`h-12 px-4 rounded-2xl text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all text-left ${
                  isSelected
                    ? 'bg-[#00825a] text-white shadow-md'
                    : isLimitReached
                    ? 'bg-[#f2f3ff] text-[#5c403c] opacity-40 cursor-not-allowed border border-transparent'
                    : 'bg-white hover:bg-[#eaedff] text-[#131b2e] border border-[#eaedff]'
                }`}
              >
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                ) : (
                  <PlusCircle className="w-4 h-4 shrink-0 text-[#5c403c]" />
                )}
                <span>{opt.label}</span>
                {opt.tag && (
                  <span
                    className={`ml-1 text-[9px] uppercase px-1.5 py-0.5 rounded font-extrabold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#ffdcc3] text-[#904d00]'
                    }`}
                  >
                    {opt.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Expanding Custom Concept / Other Input Field */}
      {question.allowOther && selectedValues.includes('Other (Specify)') && (
        <div className="mt-4 p-4 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#904d00] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#fe932c]" />
              <span>Custom Garment / Style Concept</span>
            </label>
            {otherText.trim() && (
              <span className="text-[10px] font-bold text-[#00825a] flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Validated
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              value={otherText}
              onChange={(e) => {
                if (question.otherKey) {
                  onUpdateOtherText(question.otherKey, e.target.value);
                }
              }}
              placeholder={question.otherPlaceholder || 'Enter your custom concept here...'}
              className="w-full h-12 px-4 pr-10 rounded-xl bg-white text-[#131b2e] text-[13px] border border-[#eaedff] focus:outline-none focus:border-[#dc2626] font-medium"
              autoFocus
            />
          </div>
          <p className="text-[11px] text-[#5c403c] mt-1.5">
            Will be included in the {college || district} production voting slip!
          </p>
        </div>
      )}

      {/* Long Text Open-Ended Question (Q11) */}
      {question.type === 'text' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <textarea
            value={longText}
            onChange={(e) => onUpdateLongText(e.target.value)}
            maxLength={question.maxCharacters || 500}
            rows={4}
            placeholder="Share raw design thoughts, favorite local graphics, Brahmaputra river waves, or fabric weight..."
            className="w-full bg-[#f2f3ff] rounded-xl p-3.5 text-[14px] text-[#131b2e] placeholder:text-[#5c403c] outline-none transition-all resize-none focus:bg-white border border-transparent focus:border-[#dc2626]"
          />

          {/* Character counter & circular SVG meter */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#eaedff]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="text-[#dc2626] transition-all duration-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${Math.min(
                      100,
                      ((longText.length || 0) / (question.maxCharacters || 500)) * 100
                    ).toFixed(1)}, 100`}
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                </svg>
              </div>
              <span className="text-[12px] text-[#5c403c] font-medium">
                {longText.length} / {question.maxCharacters || 500} characters
              </span>
            </div>

            <div className="flex items-center gap-1 text-[#00825a] text-[11px] font-bold">
              <Zap className="w-3.5 h-3.5 text-[#00825a]" />
              <span>High Impact Feedback</span>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar */}
      <aside className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#faf8ff]/95 backdrop-blur-xl border-t border-[#eaedff] shadow-xl">
        <div className="h-20 max-w-[560px] mx-auto px-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="h-14 px-5 rounded-full bg-[#eaedff] text-[#131b2e] text-[14px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#dae2fd] active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={handleValidateAndProceed}
            className="flex-1 h-14 px-6 rounded-full bg-[#dc2626] hover:bg-[#b70011] text-white font-headline text-[16px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(220,38,38,0.28)] active:scale-[0.98] transition-all"
          >
            <span>{isLastQuestion ? 'Review Answers' : 'Continue Drop Vote'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </aside>
    </div>
  );
};
