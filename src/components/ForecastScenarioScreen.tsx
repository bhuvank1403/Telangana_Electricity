import React, { useState } from 'react';
import { Language } from '../services/languageService';
import { CertaintyBadge } from './CertaintyBadge';
import { ChevronDown, ChevronUp, Sliders, Info, Zap } from 'lucide-react';

interface ForecastScenarioScreenProps {
  lang: Language;
}

export const ForecastScenarioScreen: React.FC<ForecastScenarioScreenProps> = ({ lang }) => {
  const isTe = lang === 'te';

  // Historical cycles data
  const history = [
    { month: 'Jan', units: 140 },
    { month: 'Feb', units: 145 },
    { month: 'Mar', units: 150 },
    { month: 'Apr', units: 168 },
    { month: 'May', units: 198 },
  ];

  // Base range at 0% adjustment (matches prompt ₹980 – ₹1,140)
  const baseLower = 980;
  const baseUpper = 1140;

  // Continuous slider: -30% to +30%
  const [sliderPct, setSliderPct] = useState<number>(0);
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState<boolean>(false);

  // Live recalculation (0ms lag)
  const factor = 1 + sliderPct / 100;
  const calculatedLower = Math.round(baseLower * factor);
  const calculatedUpper = Math.round(baseUpper * factor);

  const maxUnits = 240;

  return (
    <div className="space-y-4 max-w-xl mx-auto py-2">
      {/* 1. Forecast Range Hero Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 shadow-sm text-center">
        <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider block mb-1">
          {isTe ? 'వచ్చే నెల ఆశించిన బిల్లు శ్రేణి' : 'Projected Next Bill Range'}
        </span>

        {/* Range Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 my-2 rounded-full bg-[#F7F8F7] border border-[#CBD5E1]">
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#0F5C54] tabular-nums">
            ₹{calculatedLower.toLocaleString('en-IN')} – ₹{calculatedUpper.toLocaleString('en-IN')}
          </span>
          <CertaintyBadge type="ESTIMATED" lang={lang} />
        </div>

        <p className="text-xs text-[#4B5563] mt-1">
          {isTe
            ? 'గత 5 నెలల వినియోగ సగటు మరియు 30 రోజుల బిల్లింగ్ వ్యవధి ఆధారంగా అంచనా.'
            : 'Statistical projection across 5 historical billing cycles for 30 days.'}
        </p>

        {/* Collapsible Assumptions Used Drawer */}
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-left">
          <button
            type="button"
            onClick={() => setIsAssumptionsOpen(!isAssumptionsOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-[#0F5C54] hover:text-[#0B4741] py-1 min-touch"
          >
            <span>{isTe ? 'ఉపయోగించిన అంచనా సూత్రాలు (Assumptions used)' : 'Assumptions & Method Details'}</span>
            {isAssumptionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isAssumptionsOpen && (
            <div className="mt-2 p-3 rounded-lg bg-[#F7F8F7] border border-[#E2E8F0] text-xs text-[#4B5563] space-y-1.5 animate-fast-reveal">
              <div className="flex justify-between">
                <span>Cycles Sampled:</span>
                <span className="font-mono font-bold text-[#111827]">5 cycles (Jan – May 2026)</span>
              </div>
              <div className="flex justify-between">
                <span>Billing Days Assumed:</span>
                <span className="font-mono font-bold text-[#111827]">30 standard days</span>
              </div>
              <div className="flex justify-between">
                <span>Tariff Schedule:</span>
                <span className="font-mono font-bold text-[#111827]">TGERC Domestic LT-I(B)</span>
              </div>
              <div className="flex justify-between">
                <span>Uncertainty Margin:</span>
                <span className="font-mono font-bold text-[#111827]">±8% statistical variance</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Simple Multi-Cycle Unit Consumption Bar Chart */}
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
            {isTe ? 'నెలవారీ యూనిట్ల వినియోగ ట్రెండ్' : 'Monthly Consumption History (kWh)'}
          </h3>
          <span className="text-[11px] text-[#4B5563]">5 cycles</span>
        </div>

        {/* Bar chart */}
        <div className="grid grid-cols-6 gap-2 items-end h-32 pt-4 px-2 border-b border-[#E2E8F0]">
          {history.map((item, idx) => {
            const heightPct = (item.units / maxUnits) * 100;
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end">
                <span className="text-[10px] font-mono font-semibold text-[#111827] mb-1">
                  {item.units}u
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full max-w-[32px] bg-[#0F5C54] rounded-t-sm"
                />
                <span className="text-[11px] text-[#4B5563] font-medium mt-1">
                  {item.month}
                </span>
              </div>
            );
          })}

          {/* Forecast bar */}
          <div className="flex flex-col items-center h-full justify-end border-l border-dashed border-[#CBD5E1] pl-2">
            <span className="text-[10px] font-mono font-bold text-[#0F5C54] mb-1">
              ~180u
            </span>
            <div
              style={{ height: '75%' }}
              className="w-full max-w-[32px] bg-[#E6F4F2] border-2 border-dashed border-[#0F5C54] rounded-t-sm"
            />
            <span className="text-[11px] font-bold text-[#0F5C54] mt-1">
              NEXT
            </span>
          </div>
        </div>
      </div>

      {/* 3. Interactive What-If Scenario Slider (-30% to +30%) */}
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-[#0F5C54]" />
            <h3 className="text-xs font-bold text-[#111827]">
              {isTe ? 'ఏమి జరిగితే? (వాడకం సర్దుబాటు)' : 'What-If Usage Simulation'}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#0F5C54]">
            {sliderPct > 0 ? `+${sliderPct}%` : `${sliderPct}%`}
          </span>
        </div>

        {/* Continuous Slider */}
        <input
          type="range"
          min="-30"
          max="30"
          step="1"
          value={sliderPct}
          onChange={(e) => setSliderPct(parseInt(e.target.value))}
          className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0F5C54] my-2"
        />

        <div className="flex justify-between text-[11px] font-mono text-[#4B5563] mb-3">
          <span>-30%</span>
          <span>Baseline (0%)</span>
          <span>+30%</span>
        </div>

        {/* Quick Chip: -1 unit/day */}
        <div className="flex items-center space-x-2 pt-1 border-t border-[#E2E8F0]">
          <span className="text-[11px] text-[#4B5563]">
            {isTe ? 'త్వరిత ఎంపిక:' : 'Quick chip:'}
          </span>
          <button
            type="button"
            onClick={() => setSliderPct(-15)}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-[#E6F4F2] text-[#0F5C54] border border-[#0F5C54]/30 hover:bg-[#0F5C54] hover:text-white transition-colors"
          >
            -1 unit/day (~ -15%)
          </button>
          <button
            type="button"
            onClick={() => setSliderPct(0)}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Scenario - Not a Prediction Label */}
        <div className="mt-3 p-2.5 rounded-lg bg-[#F7F8F7] border border-dashed border-[#CBD5E1] flex items-center justify-between text-xs">
          <span className="text-[#374151] font-semibold">
            {isTe ? 'దృశ్యాంశం — ఇది అధికారిక అంచనా కాదు' : 'Scenario — Not a prediction'}
          </span>
          <CertaintyBadge type="ESTIMATED" lang={lang} />
        </div>
      </div>
    </div>
  );
};
