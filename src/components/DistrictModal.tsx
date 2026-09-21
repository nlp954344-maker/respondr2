import React, { useState, useMemo } from 'react';
import { ASSAM_DISTRICTS } from '../data/colleges';
import { Search, MapPin, X, Check, ShieldCheck } from 'lucide-react';
import { DistrictData } from '../types';

interface DistrictModalProps {
  isOpen: boolean;
  selectedDistrict: string;
  onSelect: (districtName: string) => void;
  onClose: () => void;
}

type ZoneFilter = 'All' | 'Upper Assam' | 'Lower Assam' | 'Central & Hills' | 'Barak Valley';

export const DistrictModal: React.FC<DistrictModalProps> = ({
  isOpen,
  selectedDistrict,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeZone, setActiveZone] = useState<ZoneFilter>('All');
  const [tempSelected, setTempSelected] = useState(selectedDistrict);

  // Sync temp selection when opened
  React.useEffect(() => {
    setTempSelected(selectedDistrict);
  }, [selectedDistrict, isOpen]);

  const filteredDistricts = useMemo(() => {
    return ASSAM_DISTRICTS.filter((dist) => {
      const matchesSearch =
        dist.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        dist.hq.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesZone = activeZone === 'All' || dist.zone === activeZone;
      return matchesSearch && matchesZone;
    });
  }, [searchQuery, activeZone]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#131b2e]/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[560px] bg-[#faf8ff] rounded-t-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Top Drag Pill */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-[#dae2fd] rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-[#eaedff]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#dc2626]/10 flex items-center justify-center text-[#dc2626]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-headline text-[17px] font-bold text-[#131b2e] leading-tight">
                Select Assam District
              </h2>
              <p className="text-[11px] text-[#5c403c]">
                Select your study region to load verified campus drops
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#00825a] bg-[#85f8c4]/30 px-2 py-0.5 rounded hidden sm:inline-block">
              35 Districts
            </span>
            <button
              onClick={onClose}
              aria-label="Close district modal"
              type="button"
              className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Zone Filter Bar */}
        <div className="px-5 pt-3 pb-2 flex flex-col gap-2.5 bg-[#faf8ff]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#5c403c] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district (e.g. Kamrup, Jorhat, Dibrugarh)..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#eaedff] text-[#131b2e] text-[13px] placeholder:text-[#5c403c] focus:outline-none focus:bg-[#e2e7ff] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c403c] hover:text-[#131b2e]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Regional Zone Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            {(['All', 'Upper Assam', 'Lower Assam', 'Central & Hills', 'Barak Valley'] as ZoneFilter[]).map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => setActiveZone(zone)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                  activeZone === zone
                    ? 'bg-[#dc2626] text-white shadow-sm'
                    : 'bg-[#eaedff] text-[#5c403c] hover:bg-[#dae2fd]'
                }`}
              >
                {zone === 'All' ? 'All (35)' : zone}
              </button>
            ))}
          </div>
        </div>

        {/* Districts Scrollable List */}
        <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col gap-2 pb-6">
          {filteredDistricts.length === 0 ? (
            <div className="py-12 text-center text-[#5c403c] flex flex-col items-center">
              <MapPin className="w-8 h-8 text-[#dae2fd] mb-2" />
              <p className="font-bold text-[14px]">No Assam district found</p>
              <p className="text-[12px] mt-1">Try checking for spelling or clear search filters</p>
            </div>
          ) : (
            filteredDistricts.map((dist) => {
              const isSelected = tempSelected === dist.name;
              return (
                <button
                  key={dist.name}
                  type="button"
                  onClick={() => setTempSelected(dist.name)}
                  className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#dc2626] text-white shadow-md'
                      : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin className={`w-5 h-5 shrink-0 ${isSelected ? 'text-white' : 'text-[#dc2626]'}`} />
                    <div className="truncate">
                      <span className={`text-[14px] font-bold block ${isSelected ? 'text-white' : 'text-[#131b2e]'}`}>
                        {dist.name}
                      </span>
                      <span className={`text-[11px] truncate block ${isSelected ? 'text-white/80' : 'text-[#5c403c]'}`}>
                        {dist.hq} • {dist.zone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isSelected ? (
                      <span className="text-[10px] uppercase font-extrabold bg-white/20 px-2 py-0.5 rounded text-white flex items-center gap-1">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-[#904d00] bg-[#ffdcc3]/60 px-2 py-0.5 rounded-full">
                        {dist.totalCollegesSample}+ Colleges
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Sticky Confirm Bar */}
        <div className="px-5 py-3 border-t border-[#eaedff] bg-[#f2f3ff] flex items-center justify-between">
          <div className="truncate pr-2">
            <span className="text-[10px] text-[#5c403c] uppercase block font-medium">Selected District:</span>
            <strong className="text-[14px] text-[#dc2626] truncate block">{tempSelected || 'None'}</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              if (tempSelected) onSelect(tempSelected);
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-[#dc2626] hover:bg-[#b70011] text-white text-[13px] font-bold shadow-md active:scale-95 transition-all"
          >
            Confirm District
          </button>
        </div>
      </div>
    </div>
  );
};
