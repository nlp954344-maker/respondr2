import React, { useState, useMemo } from 'react';
import { COLLEGES_BY_DISTRICT, ASSAM_DISTRICTS } from '../data/colleges';
import { MapPin, School, Check, ChevronDown, X, CheckCircle, AlertCircle, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface Step0CampusSetupProps {
  district: string;
  college: string;
  collegeIsCustom: boolean;
  customCollegeText: string;
  studyYear: string;
  onUpdateState: (updates: Partial<{
    district: string;
    college: string;
    collegeIsCustom: boolean;
    customCollegeText: string;
    studyYear: string;
  }>) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenDistrictModal: () => void;
}

const STUDY_YEARS = [
  { id: '1st', label: '1st', sub: 'Fresh' },
  { id: '2nd', label: '2nd', sub: 'Soph' },
  { id: '3rd', label: '3rd', sub: 'Junior' },
  { id: '4th', label: '4th', sub: 'Senior' },
  { id: '5th+', label: '5th+', sub: 'PG/PhD' },
];

export const Step0CampusSetup: React.FC<Step0CampusSetupProps> = ({
  district,
  college,
  collegeIsCustom,
  customCollegeText,
  studyYear,
  onUpdateState,
  onNext,
  onBack,
  onOpenDistrictModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available colleges for currently selected district
  const districtColleges = useMemo(() => {
    return COLLEGES_BY_DISTRICT[district] || [];
  }, [district]);

  // Filtered colleges by user typing
  const filteredColleges = useMemo(() => {
    if (!searchQuery.trim()) return districtColleges.slice(0, 7);
    return districtColleges.filter((c) =>
      c.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [districtColleges, searchQuery]);

  const handleValidateAndContinue = () => {
    if (!district) {
      setErrorMessage('Please select your Assam district to calibrate your campus drop.');
      return;
    }

    if (collegeIsCustom) {
      if (!customCollegeText.trim()) {
        setErrorMessage('Please enter your college or university name.');
        return;
      }
    } else if (!college.trim()) {
      setErrorMessage('Please select your college from the list, or check "My college isn\'t listed".');
      return;
    }

    if (!studyYear) {
      setErrorMessage('Please select which year you are currently studying.');
      return;
    }

    setErrorMessage(null);
    onNext();
  };

  return (
    <div className="flex flex-col w-full max-w-[560px] mx-auto px-4 pt-4 pb-28">
      {/* Step Indicator Header */}
      <div className="mb-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dc2626]/10 text-[#dc2626] text-[10px] font-extrabold uppercase tracking-wider">
              Step 0 of 14
            </span>
            <span className="text-[#5c403c] text-[12px] font-bold">Campus Setup</span>
          </div>
          <span className="text-[11px] uppercase text-[#904d00] font-extrabold">
            5% Prepared
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#eaedff] rounded-full overflow-hidden">
          <div className="h-full bg-[#dc2626] rounded-full w-[7%] transition-all duration-500" />
        </div>
      </div>

      {/* Merch Calibration Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#f2f3ff] border border-[#eaedff] p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2 shrink-0 border border-[#eaedff]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtMrTUW-ZSsWBuiw03mNO7GVbATiZIZUtDZKfCPOriTBBv8A3MgGLdy9enjyNooENKAdLtBa7pkLwRR9joS69SkeM9881HPcRjuZQFqccekTqej6PAZNZM_ESjOd_IoK9pCq4CPUw874-L_rZllvXz1BteFRblPnNWkAQCFiL1oBl8AY3zL8PhTOLJxPbbBQIgs3QkIZuVx9AiyVZjQB22mO86lgPc3umF4kRquxIT7No5X0jQPceHXw"
              alt="Assamese traditional Jaapi and Gamosa streetwear seal"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase text-[#dc2626] font-extrabold tracking-widest block">
              Merch Calibration
            </span>
            <h2 className="font-headline text-[20px] text-[#131b2e] tracking-tight leading-tight mt-0.5 font-bold">
              First, rep your college
            </h2>
            <p className="text-[12px] leading-relaxed text-[#5c403c] mt-1">
              Tell us where you study across Assam so we can drop hyper-local streetwear cut for your campus vibe.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#eaedff]/60 -mx-5 -mb-5 px-5 py-2.5 bg-white/70 rounded-b-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00825a]" />
            <span className="text-[12px] text-[#5c403c] font-medium">Active Drop: Brahmaputra Season 24</span>
          </div>
          <span className="text-[10px] uppercase text-[#904d00] font-extrabold tracking-wider">
            35 Districts Active
          </span>
        </div>
      </div>

      {/* Validation Error Alert if any */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-[#ffdad6] text-[#93000a] flex items-start gap-2.5 text-[13px] animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#ba1a1a]" />
          <div>
            <strong className="font-bold block">Action Required:</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Form Questions */}
      <div className="flex flex-col gap-6">
        {/* 1. District Field */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[14px] text-[#131b2e] font-bold flex items-center gap-1">
              <span>1. District of Assam</span>
              <span className="text-[#dc2626]">*</span>
            </label>
            <span className="text-[10px] text-[#00825a] uppercase font-bold bg-[#85f8c4]/40 px-2 py-0.5 rounded">
              All 35 Verified
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={onOpenDistrictModal}
              className="w-full h-14 pl-12 pr-10 rounded-2xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] text-[14px] font-bold flex items-center justify-between transition-all shadow-sm text-left"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#dc2626] pointer-events-none">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="truncate">{district || 'Select Assam District...'}</span>
              <ChevronDown className="w-5 h-5 text-[#5c403c] shrink-0" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase text-[#5c403c] font-bold">Hot District Trend:</span>
            <div className="flex items-center gap-1 bg-[#eaedff] px-2.5 py-0.5 rounded-full text-[#904d00] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#fe932c] animate-pulse" />
              <span>{district} • 1,420 Drops Voted</span>
            </div>
          </div>
        </div>

        {/* 2. College Field */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[14px] text-[#131b2e] font-bold flex items-center gap-1">
              <span>2. College Name</span>
              <span className="text-[#dc2626]">*</span>
            </label>
            <span className="text-[11px] text-[#5c403c]">Search or select</span>
          </div>

          {!collegeIsCustom ? (
            <>
              <div className="relative">
                <School className="w-5 h-5 text-[#5c403c] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery || college}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value !== college) {
                      onUpdateState({ college: e.target.value });
                    }
                  }}
                  onFocus={() => {
                    if (college && !searchQuery) setSearchQuery(college);
                  }}
                  placeholder="Start typing your college or university..."
                  className="w-full h-14 pl-12 pr-11 rounded-2xl bg-[#eaedff] text-[#131b2e] text-[14px] focus:outline-none focus:bg-[#e2e7ff] transition-all shadow-sm font-medium placeholder:text-[#5c403c]"
                />
                {(searchQuery || college) && (
                  <button
                    type="button"
                    aria-label="Clear college input"
                    onClick={() => {
                      setSearchQuery('');
                      onUpdateState({ college: '' });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#dae2fd] text-[#5c403c] hover:text-[#131b2e] flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* College Dropdown List */}
              <div className="flex flex-col gap-1.5 bg-white p-2 rounded-2xl shadow-sm border border-[#eaedff] max-h-52 overflow-y-auto">
                {filteredColleges.length === 0 ? (
                  <div className="p-3 text-center text-[#5c403c] text-[12px]">
                    No college matched in {district}. You can select "My college isn't listed" below to enter it manually!
                  </div>
                ) : (
                  filteredColleges.map((cName) => {
                    const isSelected = college === cName;
                    return (
                      <button
                        key={cName}
                        type="button"
                        onClick={() => {
                          onUpdateState({ college: cName });
                          setSearchQuery('');
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#dc2626] text-white shadow-sm'
                            : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <School className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#5c403c]'}`} />
                          <span className="text-[13px] font-bold truncate">{cName}</span>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded font-extrabold shrink-0">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </>
          ) : null}

          {/* "My college isn't listed" Checkbox */}
          <div className="mt-1">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] cursor-pointer hover:bg-[#eaedff] transition-colors select-none">
              <input
                type="checkbox"
                checked={collegeIsCustom}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  onUpdateState({
                    collegeIsCustom: isChecked,
                    college: isChecked ? customCollegeText : '',
                  });
                }}
                className="w-5 h-5 rounded-md accent-[#dc2626] cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="text-[13px] text-[#131b2e] font-bold">My college isn't listed</span>
                <span className="text-[11px] text-[#5c403c]">
                  Check this to write custom campus details manually
                </span>
              </div>
            </label>
          </div>

          {/* Manual College Text Input */}
          {collegeIsCustom && (
            <div className="flex flex-col gap-1.5 mt-1 animate-in fade-in duration-200">
              <div className="relative">
                <input
                  type="text"
                  value={customCollegeText}
                  onChange={(e) => {
                    const text = e.target.value;
                    onUpdateState({
                      customCollegeText: text,
                      college: text,
                    });
                  }}
                  placeholder="Enter your college / university name manually..."
                  className="w-full h-14 pl-4 pr-11 rounded-2xl bg-[#dae2fd] text-[#131b2e] text-[14px] font-medium focus:outline-none shadow-inner"
                  autoFocus
                />
                {customCollegeText.trim() && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00825a]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-[#00825a] font-bold px-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                We will include your college badge in the official Assam drop tally!
              </span>
            </div>
          )}
        </div>

        {/* 3. Year of Study Pill Selection */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <label className="text-[14px] text-[#131b2e] font-bold flex items-center gap-1">
              <span>3. Which year are you currently studying?</span>
              <span className="text-[#dc2626]">*</span>
            </label>
            <span className="text-[10px] uppercase bg-[#eaedff] px-2 py-0.5 rounded text-[#5c403c] font-bold">
              Required
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5" role="radiogroup">
            {STUDY_YEARS.map((y) => {
              const isSelected = studyYear === y.id;
              return (
                <button
                  key={y.id}
                  type="button"
                  onClick={() => onUpdateState({ studyYear: y.id })}
                  className={`h-14 rounded-2xl flex flex-col items-center justify-center p-1 text-center transition-all ${
                    isSelected
                      ? 'bg-[#dc2626] text-white shadow-md scale-[1.02]'
                      : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd]'
                  }`}
                >
                  <span className="text-[14px] font-bold leading-tight">{y.label}</span>
                  <span className={`text-[10px] font-medium leading-none ${isSelected ? 'text-white/80' : 'text-[#5c403c]'}`}>
                    {y.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Student-Only Drop Access Info Box */}
        <div className="rounded-2xl bg-[#ffdcc3]/40 border border-[#fe932c]/30 p-4 flex items-start gap-3 mt-1">
          <ShoppingBag className="w-5 h-5 text-[#904d00] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-[13px] text-[#6e3900] font-bold leading-tight">
              Student-Only Drop Access
            </h3>
            <p className="text-[12px] text-[#6e3900]/90 mt-0.5 leading-relaxed">
              By continuing, your response guarantees early access token allocation for Assam Merch Fest drops at your verified campus.
            </p>
          </div>
        </div>
      </div>

      {/* Footer System Health note */}
      <div className="mt-8 pt-4 border-t border-[#eaedff] flex items-center justify-between text-[#5c403c] text-[10px] uppercase tracking-wider font-bold">
        <span>Offline Engine: Local Queue Ready</span>
        <span>Encrypted Device Session</span>
      </div>

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
            onClick={handleValidateAndContinue}
            className="flex-1 h-14 px-6 rounded-full bg-[#dc2626] hover:bg-[#b70011] text-white font-headline text-[16px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(220,38,38,0.28)] active:scale-[0.98] transition-all"
          >
            <span>Continue Drop Vote</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </aside>
    </div>
  );
};
