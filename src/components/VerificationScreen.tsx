import React, { useState } from 'react';
import { BillData } from '../types/billing';
import { Language } from '../services/languageService';
import { CertaintyBadge } from './CertaintyBadge';
import { Check, Edit2, AlertCircle } from 'lucide-react';

interface VerificationScreenProps {
  bill: BillData;
  lang: Language;
  onConfirm: (updatedBill: BillData) => void;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({
  bill,
  lang,
  onConfirm,
}) => {
  const isTe = lang === 'te';

  const [prevRdg, setPrevRdg] = useState<number>(bill.previousReading);
  const [currRdg, setCurrRdg] = useState<number>(bill.currentReading);
  const [units, setUnits] = useState<number>(bill.unitsConsumed);
  const [days, setDays] = useState<number>(bill.billingDays);
  const [total, setTotal] = useState<number>(bill.netAmountPayable);

  // Simulate a low confidence field to show the soft ochre highlight
  const [isLowConfidence, setIsLowConfidence] = useState<boolean>(true);

  const handleConfirm = () => {
    onConfirm({
      ...bill,
      previousReading: prevRdg,
      currentReading: currRdg,
      unitsConsumed: units,
      billingDays: days,
      netAmountPayable: total,
    });
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto py-2">
      {/* Receipt-style card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 shadow-sm">
        {/* Receipt Header */}
        <div className="border-b border-dashed border-[#CBD5E1] pb-3 mb-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider block">
              {bill.discom} DOMESTIC LT-1
            </span>
            <h2 className="text-base font-bold text-[#111827]">
              {isTe ? 'సేకరించిన కీలక వివరాల తనిఖీ' : 'Extracted Field Verification'}
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-[#4B5563]">
            USCNO: {bill.uscno}
          </span>
        </div>

        <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
          {isTe
            ? 'మీ బిల్లు నుండి సంగ్రహించిన కీలక విలువలు క్రింద ఉన్నాయి. ఏవైనా సంఖ్యలు సరిగ్గా లేకపోతే ఇక్కడే సరిదిద్దవచ్చు.'
            : 'Review the critical extracted values below. Highlighted fields require quick user confirmation before finalizing.'}
        </p>

        {/* Critical Fields Table */}
        <div className="space-y-3">
          {/* Previous Reading */}
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
            <div>
              <span className="text-xs font-semibold text-[#111827] block">
                {isTe ? 'మునుపటి రీడింగ్' : 'Previous Reading'}
              </span>
              <CertaintyBadge type="VERIFIED" lang={lang} />
            </div>
            <input
              type="number"
              value={prevRdg}
              onChange={(e) => setPrevRdg(parseFloat(e.target.value) || 0)}
              className="w-24 text-right font-mono font-bold text-sm text-[#111827] bg-[#F7F8F7] border border-[#E2E8F0] rounded p-1.5 focus:border-[#0F5C54] focus:outline-none tabular-nums"
            />
          </div>

          {/* Current Reading */}
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
            <div>
              <span className="text-xs font-semibold text-[#111827] block">
                {isTe ? 'ప్రస్తుత రీడింగ్' : 'Current Reading'}
              </span>
              <CertaintyBadge type="VERIFIED" lang={lang} />
            </div>
            <input
              type="number"
              value={currRdg}
              onChange={(e) => setCurrRdg(parseFloat(e.target.value) || 0)}
              className="w-24 text-right font-mono font-bold text-sm text-[#111827] bg-[#F7F8F7] border border-[#E2E8F0] rounded p-1.5 focus:border-[#0F5C54] focus:outline-none tabular-nums"
            />
          </div>

          {/* Units Consumed (Highlight in soft ochre #FFFBEB if needs check) */}
          <div
            className={`flex items-center justify-between p-2.5 rounded-lg border ${
              isLowConfidence
                ? 'bg-[#FFFBEB] border-[#FDE68A]'
                : 'bg-white border-[#E2E8F0]'
            }`}
          >
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-[#111827]">
                  {isTe ? 'వినియోగించిన యూనిట్లు' : 'Units Consumed (kWh)'}
                </span>
                {isLowConfidence && (
                  <AlertCircle className="w-3.5 h-3.5 text-[#92400E]" />
                )}
              </div>
              <CertaintyBadge
                type={isLowConfidence ? 'NEEDS_VERIFICATION' : 'VERIFIED'}
                lang={lang}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={units}
                onChange={(e) => {
                  setUnits(parseFloat(e.target.value) || 0);
                  setIsLowConfidence(false);
                }}
                className="w-24 text-right font-mono font-bold text-sm text-[#92400E] bg-white border border-[#FDE68A] rounded p-1.5 focus:border-[#0F5C54] focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {/* Billing Days */}
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
            <div>
              <span className="text-xs font-semibold text-[#111827] block">
                {isTe ? 'బిల్లింగ్ రోజులు' : 'Billing Days'}
              </span>
              <CertaintyBadge type="VERIFIED" lang={lang} />
            </div>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 30)}
              className="w-24 text-right font-mono font-bold text-sm text-[#111827] bg-[#F7F8F7] border border-[#E2E8F0] rounded p-1.5 focus:border-[#0F5C54] focus:outline-none tabular-nums"
            />
          </div>

          {/* Total Payable */}
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-[#0F5C54]/30 bg-[#E6F4F2]/30">
            <div>
              <span className="text-xs font-bold text-[#0F5C54] block">
                {isTe ? 'చెల్లించవలసిన మొత్తం' : 'Total Amount Payable'}
              </span>
              <CertaintyBadge type="CALCULATED" lang={lang} />
            </div>
            <div className="text-right">
              <span className="text-base font-bold font-mono text-[#0F5C54] tabular-nums">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Single-tap confirmation */}
        <div className="mt-5 pt-3 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3 px-4 rounded-[12px] bg-[#0F5C54] hover:bg-[#0B4741] text-white font-bold text-sm min-touch flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>{isTe ? 'ధృవీకరించండి & కొనసాగించండి' : 'Confirm & Continue'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
