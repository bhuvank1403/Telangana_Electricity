import React, { useState } from 'react';
import { BillData } from '../types/billing';
import { Language, playAudio, pauseAudio, resumeAudio, stopAudio, getAudioScript } from '../services/languageService';
import { CertaintyBadge } from './CertaintyBadge';
import { ChevronDown, ChevronUp, Play, Pause, RotateCcw, Volume2, ShieldCheck, Zap } from 'lucide-react';

interface ExplainScreenProps {
  bill: BillData;
  lang: Language;
}

export const ExplainScreen: React.FC<ExplainScreenProps> = ({ bill, lang }) => {
  const isTe = lang === 'te';

  // State for pinned collapsible preview
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(true);
  const [selectedChargeField, setSelectedChargeField] = useState<string | null>(null);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const audioScript = getAudioScript(
    bill.unitsConsumed,
    bill.netAmountPayable,
    bill.billingDays,
    bill.dueDate,
    lang
  );

  const handleAudioPlayToggle = () => {
    if (isPlaying) {
      pauseAudio();
      setIsPlaying(false);
    } else {
      playAudio(audioScript, lang, playbackSpeed, () => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handleRewind10 = () => {
    stopAudio();
    playAudio(audioScript, lang, playbackSpeed, () => setIsPlaying(false));
    setIsPlaying(true);
  };

  const toggleSpeed = () => {
    const nextSpeed = playbackSpeed === 1.0 ? 0.85 : 1.0;
    setPlaybackSpeed(nextSpeed);
    if (isPlaying) {
      stopAudio();
      playAudio(audioScript, lang, nextSpeed, () => setIsPlaying(false));
    }
  };

  // Gruha Jyothi tracker calculations
  const threshold = 200;
  const isWithinGruhaJyothi = bill.unitsConsumed <= threshold;
  const progressPct = Math.min(100, (bill.unitsConsumed / threshold) * 100);

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-20">
      {/* 1. Pinned Collapsible Bill Preview */}
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          className="w-full p-3.5 flex items-center justify-between text-left border-b border-[#E2E8F0] bg-[#F7F8F7] hover:bg-[#F0F2F0] min-touch transition-colors"
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#111827]">
              {isTe ? 'అసలు విద్యుత్ బిల్లు నమూనా (Bill Preview)' : 'Original Bill Preview & Field Locations'}
            </span>
            <span className="text-[11px] font-mono text-[#4B5563]">
              {bill.discom} • #{bill.uscno.slice(-5)}
            </span>
          </div>
          {isPreviewOpen ? (
            <ChevronUp className="w-4 h-4 text-[#4B5563]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          )}
        </button>

        {isPreviewOpen && (
          <div className="p-4 bg-[#F7F8F7] relative flex justify-center">
            {/* The physical bill paper representation */}
            <div
              className={`relative w-full max-w-sm bg-white p-4 rounded-lg border border-[#CBD5E1] shadow-sm font-mono text-[10px] text-[#111827] transition-opacity duration-200 ${
                selectedChargeField ? 'opacity-90' : 'opacity-100'
              }`}
            >
              {/* Header */}
              <div className="border-b border-[#111827] pb-2 mb-2 flex justify-between">
                <div>
                  <span className="font-bold block text-[11px]">{bill.discom}</span>
                  <span className="text-[9px] text-[#4B5563]">DOMESTIC LT-1</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{bill.billDate}</span>
                </div>
              </div>

              {/* USCNO & Name */}
              <div
                className={`p-1.5 rounded transition-all duration-200 mb-2 ${
                  selectedChargeField === 'uscno'
                    ? 'border-2 border-[#0F5C54] bg-[#E6F4F2]'
                    : 'border border-transparent'
                }`}
              >
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">USCNO:</span>
                  <span className="font-bold">{bill.uscno}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">Consumer:</span>
                  <span className="font-bold">{bill.consumerName}</span>
                </div>
              </div>

              {/* Readings & Units */}
              <div
                className={`p-1.5 rounded transition-all duration-200 mb-2 bg-[#F7F8F7] border ${
                  selectedChargeField === 'units'
                    ? 'border-2 border-[#0F5C54] bg-[#E6F4F2]'
                    : 'border-[#E2E8F0]'
                }`}
              >
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">Prev: {bill.previousReading} | Curr: {bill.currentReading}</span>
                  <span className="font-bold text-[#0F5C54]">{bill.unitsConsumed} kWh</span>
                </div>
              </div>

              {/* Charge rows with bounding box simulation */}
              <div className="space-y-1 border-t border-dashed border-[#CBD5E1] pt-1.5 mb-2">
                <div
                  className={`flex justify-between p-1 rounded transition-all duration-200 ${
                    selectedChargeField === 'energy'
                      ? 'border-2 border-[#0F5C54] bg-[#E6F4F2]'
                      : 'border border-transparent'
                  }`}
                >
                  <span>1. Energy Charges:</span>
                  <span className="font-bold">₹{bill.energyCharges.toFixed(2)}</span>
                </div>
                <div
                  className={`flex justify-between p-1 rounded transition-all duration-200 ${
                    selectedChargeField === 'customer'
                      ? 'border-2 border-[#0F5C54] bg-[#E6F4F2]'
                      : 'border border-transparent'
                  }`}
                >
                  <span>2. Customer Charges:</span>
                  <span className="font-bold">₹{bill.customerCharges.toFixed(2)}</span>
                </div>
                <div
                  className={`flex justify-between p-1 rounded transition-all duration-200 ${
                    selectedChargeField === 'duty'
                      ? 'border-2 border-[#0F5C54] bg-[#E6F4F2]'
                      : 'border border-transparent'
                  }`}
                >
                  <span>3. Electricity Duty:</span>
                  <span className="font-bold">₹{bill.electricityDuty.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Row */}
              <div
                className={`flex justify-between p-2 rounded bg-[#111827] text-white transition-all duration-200 ${
                  selectedChargeField === 'total'
                    ? 'ring-2 ring-[#0F5C54] ring-offset-2'
                    : ''
                }`}
              >
                <span className="font-bold">TOTAL PAYABLE:</span>
                <span className="font-bold text-[#ECFDF5]">₹{bill.netAmountPayable.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Neutral Gruha Jyothi Consumption Tracker Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F5C54]" />
            <h3 className="text-xs font-bold text-[#111827]">
              {isTe ? 'గృహ జ్యోతి వినియోగ సూచిక (Gruha Jyothi Tracker)' : 'Gruha Jyothi Consumption Tracker'}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#111827]">
            {bill.unitsConsumed} / 200 units
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden mb-2">
          <div
            style={{ width: `${progressPct}%` }}
            className={`h-full rounded-full transition-all duration-300 ${
              isWithinGruhaJyothi ? 'bg-[#0F5C54]' : 'bg-[#B45309]'
            }`}
          />
        </div>

        <p className="text-[11px] text-[#4B5563] leading-relaxed">
          {isWithinGruhaJyothi
            ? (isTe
                ? `మీ వినియోగం 200 యూనిట్ల లోపు (${bill.unitsConsumed} units) ఉంది. పథకం నిబంధనల ప్రకారం అర్హత కలిగిన గృహాలకు సున్నా బిల్లు వర్తిస్తుంది.`
                : `Current consumption is within the 200-unit ceiling (${bill.unitsConsumed} units). Eligible enrolled households receive zero-bill benefit under G.O. Ms. No. 4.`)
            : (isTe
                ? `మీ వినియోగం 200 యూనిట్లు దాటింది (${bill.unitsConsumed} units). ఈ నెలకు సాధారణ స్లాబ్ ఛార్జీలు వర్తిస్తాయి.`
                : `Consumption exceeds the 200-unit ceiling (${bill.unitsConsumed} units). Standard tariff slabs apply for this cycle.`)}
        </p>
      </div>

      {/* 3. Interactive Itemized Charge Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
            {isTe ? 'ఛార్జీల వివరణ (ఖాతా వివరాలు):' : 'Itemised Charge Breakdown:'}
          </h3>
          <span className="text-[11px] text-[#4B5563]">
            {isTe ? 'కార్డుపై నొక్కితే బిల్లులో గుర్తించబడుతుంది' : 'Tap any card to locate on bill'}
          </span>
        </div>

        {/* Energy Charges Card */}
        <div
          onClick={() => setSelectedChargeField(selectedChargeField === 'energy' ? null : 'energy')}
          className={`p-4 rounded-[12px] border transition-all cursor-pointer min-touch ${
            selectedChargeField === 'energy'
              ? 'bg-[#E6F4F2] border-[#0F5C54] shadow-sm'
              : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-bold text-[#111827]">
              {isTe ? '1. శక్తి ఛార్జీలు (Energy Charges)' : '1. Energy Charges'}
            </span>
            <div className="flex items-center space-x-2">
              <CertaintyBadge type="CALCULATED" lang={lang} />
              <span className="text-base font-bold font-mono text-[#111827] tabular-nums">
                ₹{bill.energyCharges.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            {isTe
              ? `మీరు వాడిన ${bill.unitsConsumed} యూనిట్లకు TGERC అధికారిక స్లాబ్ రేట్ల ప్రకారం లెక్కించిన మొత్తం (1-100u @ ₹3.40, 101-200u @ ₹4.80).`
              : `Billed consumption of ${bill.unitsConsumed} units computed against official TGERC slabs (1-100u @ ₹3.40, 101-200u @ ₹4.80).`}
          </p>
        </div>

        {/* Customer Charges Card */}
        <div
          onClick={() => setSelectedChargeField(selectedChargeField === 'customer' ? null : 'customer')}
          className={`p-4 rounded-[12px] border transition-all cursor-pointer min-touch ${
            selectedChargeField === 'customer'
              ? 'bg-[#E6F4F2] border-[#0F5C54] shadow-sm'
              : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-bold text-[#111827]">
              {isTe ? '2. కస్టమర్ ఛార్జీలు (Customer Charges)' : '2. Customer Charges'}
            </span>
            <div className="flex items-center space-x-2">
              <CertaintyBadge type="CALCULATED" lang={lang} />
              <span className="text-base font-bold font-mono text-[#111827] tabular-nums">
                ₹{bill.customerCharges.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            {isTe
              ? `మీటర్ రీడింగ్, బిల్లింగ్ నెట్‌వర్క్ మరియు లైన్ల నిర్వహణ కోసం ప్రతినెలా వసూలు చేసే నిర్ణీత మొత్తం.`
              : `Monthly fixed statutory service charge for meter upkeep, line maintenance, and billing network.`}
          </p>
        </div>

        {/* Electricity Duty Card */}
        <div
          onClick={() => setSelectedChargeField(selectedChargeField === 'duty' ? null : 'duty')}
          className={`p-4 rounded-[12px] border transition-all cursor-pointer min-touch ${
            selectedChargeField === 'duty'
              ? 'bg-[#E6F4F2] border-[#0F5C54] shadow-sm'
              : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-bold text-[#111827]">
              {isTe ? '3. విద్యుత్ సుంకం (Electricity Duty)' : '3. Electricity Duty'}
            </span>
            <div className="flex items-center space-x-2">
              <CertaintyBadge type="CALCULATED" lang={lang} />
              <span className="text-base font-bold font-mono text-[#111827] tabular-nums">
                ₹{bill.electricityDuty.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            {isTe
              ? `తెలంగాణ రాష్ట్ర ప్రభుత్వ నిబంధనల ప్రకారం ప్రతి యూనిట్‌కు 6 పైసల చొప్పున విధించే చట్టబద్ధమైన పన్ను.`
              : `Statutory government duty levied at 6 paise per unit consumed (${bill.unitsConsumed} units × ₹0.06).`}
          </p>
        </div>

        {/* Total Payable Card */}
        <div
          onClick={() => setSelectedChargeField(selectedChargeField === 'total' ? null : 'total')}
          className={`p-4 rounded-[12px] border-2 transition-all cursor-pointer min-touch ${
            selectedChargeField === 'total'
              ? 'border-[#0F5C54] bg-[#E6F4F2]'
              : 'border-[#111827] bg-[#F7F8F7]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-[#111827]">
              {isTe ? 'మొత్తం చెల్లించవలసినది (Net Total Payable)' : 'Net Amount Payable'}
            </span>
            <div className="flex items-center space-x-2">
              <CertaintyBadge type="VERIFIED" lang={lang} />
              <span className="text-lg font-bold font-mono text-[#0F5C54] tabular-nums">
                ₹{bill.netAmountPayable.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-[#4B5563]">
            <span>{isTe ? `గడువు తేదీ: ${bill.dueDate}` : `Due date: ${bill.dueDate}`}</span>
            <span>{bill.billingDays} {isTe ? 'రోజుల బిల్లు' : 'days billed'}</span>
          </div>
        </div>
      </div>

      {/* 4. Sticky 56px Bottom Audio Player */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#E2E8F0] shadow-md">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Play/Pause Button */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleAudioPlayToggle}
              className="w-10 h-10 rounded-full bg-[#0F5C54] text-white flex items-center justify-center min-touch hover:bg-[#0B4741] transition-colors shadow-sm"
              title={isPlaying ? 'Pause' : 'Play audio explanation'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div>
              <span className="text-xs font-bold text-[#111827] block">
                {isTe ? 'వాయిస్ వివరణ (Telugu Voice)' : 'Voice Explanation (English)'}
              </span>
              <span className="text-[10px] text-[#4B5563] block">
                {isPlaying ? (isTe ? 'ప్లే అవుతోంది...' : 'Speaking...') : (isTe ? 'వినడానికి ప్లే చేయండి' : 'Tap play to listen')}
              </span>
            </div>
          </div>

          {/* Controls: -10s rewind & 1x/0.85x speed toggle */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleRewind10}
              className="p-2 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] min-touch flex items-center justify-center text-xs font-bold"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4 mr-0.5" />
              <span className="text-[11px]">-10s</span>
            </button>

            <button
              type="button"
              onClick={toggleSpeed}
              className="px-2.5 py-1 rounded-md bg-[#F3F4F6] border border-[#E2E8F0] text-xs font-bold text-[#0F5C54] min-touch flex items-center justify-center"
              title="Toggle playback speed"
            >
              {playbackSpeed}x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
