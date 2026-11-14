import React from 'react';
import { Language } from '../services/languageService';

export type CertaintyType = 'VERIFIED' | 'CALCULATED' | 'ESTIMATED' | 'NEEDS_VERIFICATION';

interface CertaintyBadgeProps {
  type: CertaintyType;
  lang?: Language;
  className?: string;
}

export const CertaintyBadge: React.FC<CertaintyBadgeProps> = ({
  type,
  lang = 'te',
  className = '',
}) => {
  const isTe = lang === 'te';

  switch (type) {
    case 'VERIFIED':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#ECFDF5] text-[#065F46] tracking-tight ${className}`}
        >
          {isTe ? 'ధృవీకరించబడింది' : 'Verified'}
        </span>
      );
    case 'CALCULATED':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EFF6FF] text-[#1E40AF] tracking-tight ${className}`}
        >
          {isTe ? 'లెక్కించబడింది' : 'Calculated'}
        </span>
      );
    case 'ESTIMATED':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3F4F6] text-[#374151] border border-dashed border-[#9CA3AF] tracking-tight ${className}`}
        >
          {isTe ? 'అంచనా' : 'Estimated'}
        </span>
      );
    case 'NEEDS_VERIFICATION':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] tracking-tight ${className}`}
        >
          {isTe ? 'సరిచూడాలి' : 'Needs Verification'}
        </span>
      );
    default:
      return null;
  }
};
