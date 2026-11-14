import React, { useState } from 'react';
import { Language } from '../services/languageService';
import { CertaintyBadge } from './CertaintyBadge';
import { ArrowUpRight, ArrowDownRight, Info, ChevronRight, Check } from 'lucide-react';

interface TraceWaterfallScreenProps {
  lang: Language;
}

export const TraceWaterfallScreen: React.FC<TraceWaterfallScreenProps> = ({ lang }) => {
  const isTe = lang === 'te';

  // Exact numbers matching user requirements:
  // Previous Bill = ₹800 (150 units, 30 days)
  // Current Bill = ₹1,040 (198 units, 33 days)
  // Total Change = +₹240
  // Billing Days Effect = +₹75
  // Daily Usage Change = +₹165
  // Tariff / Slab Change = ₹0
  // Other / Residual = ₹0
  const prevBill = { amount: 800, units: 150, days: 30, month: 'April 2026' };
  const currBill = { amount: 1040, units: 198, days: 33, month: 'May 2026' };
  const totalChange = 240;

  const steps = [
    {
      id: 'base',
      labelTe: 'మునుపటి బిల్లు (ఏప్రిల్)',
      labelEn: 'Previous Bill (April)',
      amount: 800,
      delta: 800,
      type: 'base',
      colorBg: 'bg-[#111827]',
      colorText: 'text-white',
      badge: 'VERIFIED' as const,
      detailsTe: 'మునుపటి నెలలో 150 యూనిట్లకు 30 రోజుల వ్యవధిలో చెల్లించిన మొత్తం: ₹800.00 (రోజుకు 5.0 యూనిట్లు).',
      detailsEn: 'Base bill for 150 units over 30 days: ₹800.00 (5.0 units/day average).',
    },
    {
      id: 'days',
      labelTe: 'బిల్లింగ్ రోజుల ప్రభావం (+3 రోజులు)',
      labelEn: 'Billing Days Effect (+3 days)',
      amount: 75,
      delta: 75,
      type: 'increase',
      colorBg: 'bg-[#B45309]',
      colorText: 'text-white',
      badge: 'CALCULATED' as const,
      detailsTe: 'మునుపటి సగటుతో పోలిస్తే ఈ నెలలో 3 రోజులు ఎక్కువ రావడం వల్ల పెరిగిన మొత్తం: (5 u/day × 3 days = 15 units = +₹75.00).',
      detailsEn: '3 extra billing days (33 vs 30 days) at prior average usage velocity (5u/day × 3 days = +₹75.00).',
    },
    {
      id: 'usage',
      labelTe: 'రోజువారీ వాడకం రేటు మార్పు',
      labelEn: 'Daily Usage Rate Change',
      amount: 165,
      delta: 165,
      type: 'increase',
      colorBg: 'bg-[#B45309]',
      colorText: 'text-white',
      badge: 'CALCULATED' as const,
      detailsTe: 'రోజువారీ వినియోగం 5.0u నుండి 6.0u కు పెరగడం వల్ల అదనపు 33 యూనిట్ల ఖర్చు: +₹165.00.',
      detailsEn: 'Daily usage rate increased from 5.0 to 6.0 units/day across 33 days: +₹165.00.',
    },
    {
      id: 'tariff',
      labelTe: 'టారిఫ్ స్లాబ్ మార్పు ప్రభావం',
      labelEn: 'Tariff / Slab Change',
      amount: 0,
      delta: 0,
      type: 'neutral',
      colorBg: 'bg-[#9CA3AF]',
      colorText: 'text-white',
      badge: 'CALCULATED' as const,
      detailsTe: 'రెండు నెలల్లోనూ LT-I(B) స్లాబ్ రేట్లు స్థిరంగా ఉన్నందున స్లాబ్ మార్పు ప్రభావం: ₹0.00.',
      detailsEn: 'Both cycles remained in LT-I(B) domestic band; zero tariff rate variation: ₹0.00.',
    },
    {
      id: 'residual',
      labelTe: 'ఇతర ఛార్జీలు / వ్యత్యాసం (Residual)',
      labelEn: 'Other / Unexplained Residual',
      amount: 0,
      delta: 0,
      type: 'residual',
      colorBg: 'bg-striped-residual',
      colorText: 'text-[#374151]',
      badge: 'VERIFIED' as const,
      detailsTe: 'అన్ని విభాగాలు ఖచ్చితంగా సరిపోయాయి. వివరించబడని వ్యత్యాసం ఏదీ లేదు: ₹0.00.',
      detailsEn: 'All line items fully reconciled. Zero unexplained residual: ₹0.00.',
    },
    {
      id: 'final',
      labelTe: 'ప్రస్తుత బిల్లు (మే)',
      labelEn: 'Current Bill (May)',
      amount: 1040,
      delta: 1040,
      type: 'final',
      colorBg: 'bg-[#0F5C54]',
      colorText: 'text-white',
      badge: 'VERIFIED' as const,
      detailsTe: 'ప్రస్తుత నెలలో 198 యూనిట్లకు 33 రోజుల వ్యవధిలో మొత్తం చెల్లించవలసినది: ₹1,040.00.',
      detailsEn: 'Current bill for 198 units over 33 billing days: ₹1,040.00.',
    },
  ];

  const [activeStepId, setActiveStepId] = useState<string>('days');
  const activeStep = steps.find((s) => s.id === activeStepId) || steps[1];

  return (
    <div className="space-y-4 max-w-xl mx-auto py-2">
      {/* Overview Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-3">
          <div>
            <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider block">
              {isTe ? 'క్రమానుగత ప్రతిక్షేపణ విశ్లేషణ' : 'Sequential Variance Waterfall'}
            </span>
            <h2 className="text-base font-bold text-[#111827]">
              {isTe ? 'బిల్లు ఎందుకు పెరిగింది?' : 'Why Did Your Bill Change?'}
            </h2>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] font-bold text-xs font-mono">
            <ArrowUpRight className="w-4 h-4" />
            <span>+₹{totalChange.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
          {isTe
            ? 'ఏప్రిల్ బిల్లు (₹800) నుండి మే బిల్లు (₹1,040) కి పెరిగిన ₹240 వ్యత్యాసాన్ని విశ్లేషించగా: కేవలం ఎక్కువ రోజులు (+₹75) మరియు రోజువారీ వాడకం రేటు పెరగడం (+₹165) మాత్రమే ప్రధాన కారణాలు.'
            : 'Decomposing the ₹240 increase from April (₹800) to May (₹1,040) reveals that extra billing days (+₹75) and higher daily consumption (+₹165) account for the entire difference.'}
        </p>

        {/* The Clean Step-Bridge Waterfall Chart */}
        <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
          {steps.map((step, idx) => {
            const isSelected = activeStepId === step.id;
            const isDelta = step.type === 'increase' || step.type === 'decrease' || step.type === 'neutral' || step.type === 'residual';

            return (
              <div
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                style={{
                  animationDelay: `${idx * 35}ms`,
                }}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer min-touch animate-fast-reveal ${
                  isSelected
                    ? 'border-[#0F5C54] bg-[#E6F4F2]/30 shadow-sm'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-3 h-3 rounded-sm flex-shrink-0 ${
                        step.type === 'increase'
                          ? 'bg-[#B45309]'
                          : step.type === 'decrease'
                          ? 'bg-[#15803D]'
                          : step.type === 'residual'
                          ? 'bg-striped-residual border border-[#9CA3AF]'
                          : step.type === 'final'
                          ? 'bg-[#0F5C54]'
                          : 'bg-[#111827]'
                      }`}
                    />
                    <span className="font-semibold text-[#111827]">
                      {isTe ? step.labelTe : step.labelEn}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 font-mono tabular-nums">
                    <CertaintyBadge type={step.badge} lang={lang} />
                    <span
                      className={`font-bold text-sm ${
                        step.type === 'increase'
                          ? 'text-[#B45309]'
                          : step.type === 'decrease'
                          ? 'text-[#15803D]'
                          : step.type === 'final'
                          ? 'text-[#0F5C54]'
                          : 'text-[#111827]'
                      }`}
                    >
                      {isDelta && step.amount > 0 ? `+₹${step.amount}` : `₹${step.amount}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Provenance Card */}
      {activeStep && (
        <div className="bg-white border-2 border-[#0F5C54]/30 rounded-[12px] p-4 shadow-sm animate-fast-reveal">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#0F5C54] uppercase tracking-wider">
              {isTe ? 'విలువ మూలం & నిరూపణ (Provenance):' : 'Calculation & Provenance:'}
            </span>
            <span className="text-xs font-mono font-bold text-[#111827]">
              {isTe ? activeStep.labelTe : activeStep.labelEn}
            </span>
          </div>

          <p className="text-xs text-[#111827] leading-relaxed mb-3">
            {isTe ? activeStep.detailsTe : activeStep.detailsEn}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#F7F8F7] p-2.5 rounded border border-[#E2E8F0]">
            <div>
              <span className="text-[#4B5563] block">Previous:</span>
              <span className="font-bold text-[#111827]">150u • 30 days (₹800)</span>
            </div>
            <div>
              <span className="text-[#4B5563] block">Current:</span>
              <span className="font-bold text-[#111827]">198u • 33 days (₹1,040)</span>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Neutrality Banner (BR-03) */}
      <div className="flex items-start space-x-2.5 p-3 rounded-[12px] bg-[#F7F8F7] border border-[#E2E8F0] text-xs text-[#4B5563] leading-relaxed">
        <Info className="w-4 h-4 text-[#0F5C54] flex-shrink-0 mt-0.5" />
        <p>
          {isTe
            ? 'ఈ విశ్లేషణ అధికారిక TGERC టారిఫ్ నిబంధనల ప్రకారం లెక్కించబడింది. వ్యత్యాసాలు ఓవర్‌ఛార్జింగ్ కాదు, డిస్కంతో సరిచూసుకోవడానికి మాత్రమే.'
            : 'Variance components are mathematically derived from verified bill records. Differences are informational for DISCOM review, never accusatory.'}
        </p>
      </div>
    </div>
  );
};
