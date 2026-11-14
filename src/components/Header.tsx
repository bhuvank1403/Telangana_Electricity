import React from 'react';
import { Language } from '../services/languageService';
import { FileText } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isBillUploaded: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  activeTab,
  onTabChange,
  isBillUploaded,
}) => {
  const isTe = lang === 'te';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Title (Clean Utility Style, NO Challenge 31 / Govt at top) */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#E6F4F2] border border-[#0F5C54]/20 flex items-center justify-center text-[#0F5C54]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight leading-tight">
              {isTe ? 'తెలంగాణ విద్యుత్ బిల్లు సహాయక్' : 'Telangana Electricity Bill Assistant'}
            </h1>
            <p className="text-xs text-[#4B5563] font-medium">
              TGSPDCL & TGNPDCL Domestic
            </p>
          </div>
        </div>

        {/* Segmented Language Toggle with smooth 150ms slide */}
        <div className="relative flex items-center bg-[#F3F4F6] p-1 rounded-lg border border-[#E2E8F0] min-touch">
          <button
            type="button"
            onClick={() => onLanguageChange('te')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-150 min-touch flex items-center justify-center ${
              lang === 'te'
                ? 'bg-white text-[#0F5C54] shadow-sm'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            తెలుగు
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-150 min-touch flex items-center justify-center ${
              lang === 'en'
                ? 'bg-white text-[#0F5C54] shadow-sm'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      {isBillUploaded && (
        <div className="max-w-2xl mx-auto px-4 border-t border-[#E2E8F0] flex space-x-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onTabChange('explain')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap min-touch flex items-center transition-colors ${
              activeTab === 'explain'
                ? 'border-[#0F5C54] text-[#0F5C54]'
                : 'border-transparent text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            {isTe ? '1. బిల్లు వివరణ (Explain)' : '1. Explain It'}
          </button>
          <button
            onClick={() => onTabChange('trace')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap min-touch flex items-center transition-colors ${
              activeTab === 'trace'
                ? 'border-[#0F5C54] text-[#0F5C54]'
                : 'border-transparent text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            {isTe ? '2. మార్పు విశ్లేషణ (Trace)' : '2. Trace It'}
          </button>
          <button
            onClick={() => onTabChange('forecast')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap min-touch flex items-center transition-colors ${
              activeTab === 'forecast'
                ? 'border-[#0F5C54] text-[#0F5C54]'
                : 'border-transparent text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            {isTe ? '3. భవిష్యత్ అంచనా (Forecast)' : '3. See It Coming'}
          </button>
          <button
            onClick={() => onTabChange('verify')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap min-touch flex items-center transition-colors ${
              activeTab === 'verify'
                ? 'border-[#0F5C54] text-[#0F5C54]'
                : 'border-transparent text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            {isTe ? 'రసీదు & సవరణ' : 'Field Review'}
          </button>
        </div>
      )}
    </header>
  );
};
