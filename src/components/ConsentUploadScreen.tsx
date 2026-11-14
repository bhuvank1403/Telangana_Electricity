import React, { useState } from 'react';
import { Language } from '../services/languageService';
import { Camera, FileUp, Shield, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { SAMPLE_BILLS } from '../data/sampleBills';
import { BillData } from '../types/billing';

interface ConsentUploadScreenProps {
  lang: Language;
  onBillReady: (bill: BillData) => void;
}

export const ConsentUploadScreen: React.FC<ConsentUploadScreenProps> = ({
  lang,
  onBillReady,
}) => {
  const isTe = lang === 'te';

  // Consent toggles
  const [consentProcess, setConsentProcess] = useState<boolean>(true);
  const [consentSaveHistory, setConsentSaveHistory] = useState<boolean>(false);
  const [consentAnalytics, setConsentAnalytics] = useState<boolean>(false);

  // Scanning progress checklist
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);

  const startAnalysis = (selectedBill: BillData) => {
    setIsScanning(true);
    setScanStep(1); // 1. Reading bill

    setTimeout(() => {
      setScanStep(2); // 2. Checking tariff
    }, 700);

    setTimeout(() => {
      setScanStep(3); // 3. Preparing summary
    }, 1400);

    setTimeout(() => {
      setIsScanning(false);
      onBillReady(selectedBill);
    }, 2000);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto py-2">
      {/* 1. Privacy & Consent Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 shadow-sm">
        <div className="flex items-center space-x-2 text-[#0F5C54] mb-3">
          <Shield className="w-5 h-5 flex-shrink-0" />
          <h2 className="text-base font-bold text-[#111827]">
            {isTe ? 'గోప్యత & సమ్మతి (Data Consent)' : 'Privacy & Data Consent'}
          </h2>
        </div>

        <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
          {isTe
            ? 'మీ విద్యుత్ బిల్లు వివరణ పొందడానికి అవసరమైన ప్రాథమిక అనుమతులు. మీ వ్యక్తిగత సమాచారం ఎక్కడా దుర్వినియోగం కాకుండా భద్రపరచబడుతుంది.'
            : 'Clear consent required under India DPDP Act 2023. Your personal identifiers are masked and never used for advertising.'}
        </p>

        {/* Consent Options */}
        <div className="space-y-3 border-t border-[#E2E8F0] pt-3">
          {/* Required Consent */}
          <label className="flex items-start space-x-3 cursor-pointer min-touch py-1">
            <input
              type="checkbox"
              checked={consentProcess}
              onChange={(e) => setConsentProcess(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-[#0F5C54] accent-[#0F5C54] cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-[#111827]">
                {isTe ? 'బిల్లును విశ్లేషించడానికి అనుమతి (తప్పనిసరి)' : 'Consent to process electricity bill (Required)'}
              </span>
              <p className="text-[#4B5563] text-[11px] mt-0.5">
                {isTe
                  ? 'మీటర్ రీడింగులు మరియు ఛార్జీలను లెక్కించడానికి మాత్రమే ఉపయోగించబడుతుంది.'
                  : 'Used strictly to extract readings, verify slab math, and explain charges.'}
              </p>
            </div>
          </label>

          {/* Optional: Save History */}
          <label className="flex items-start space-x-3 cursor-pointer min-touch py-1">
            <input
              type="checkbox"
              checked={consentSaveHistory}
              onChange={(e) => setConsentSaveHistory(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-[#0F5C54] accent-[#0F5C54] cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-[#111827]">
                {isTe ? 'మార్పు విశ్లేషణ కోసం బిల్లును సేవ్ చేయండి (ఐచ్ఛికం)' : 'Save bill history for variance waterfall (Optional)'}
              </span>
              <p className="text-[#4B5563] text-[11px] mt-0.5">
                {isTe
                  ? 'మునుపటి నెలలతో పోల్చడానికి మీ పరికరంలో మాత్రమే రికార్డు ఉంచుతుంది.'
                  : 'Keeps encrypted local record to compare monthly trends.'}
              </p>
            </div>
          </label>

          {/* Optional: Analytics */}
          <label className="flex items-start space-x-3 cursor-pointer min-touch py-1">
            <input
              type="checkbox"
              checked={consentAnalytics}
              onChange={(e) => setConsentAnalytics(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-[#0F5C54] accent-[#0F5C54] cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-[#111827]">
                {isTe ? 'అజ్ఞాత నాణ్యత మెరుగుదలకు అనుమతి (ఐచ్ఛికం)' : 'Share anonymized feedback to improve clarity (Optional)'}
              </span>
            </div>
          </label>
        </div>

        {/* Continue without saving link */}
        <div className="mt-3 pt-2 text-right">
          <button
            type="button"
            onClick={() => {
              setConsentSaveHistory(false);
              setConsentAnalytics(false);
              startAnalysis(SAMPLE_BILLS[0]);
            }}
            className="text-xs text-[#0F5C54] hover:underline font-semibold"
          >
            {isTe ? 'డేటా సేవ్ చేయకుండా నేరుగా కొనసాగండి →' : 'Continue without saving →'}
          </button>
        </div>
      </div>

      {/* 2. Bill Upload Dropzone with Guided Viewfinder */}
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 shadow-sm text-center">
        <h3 className="text-sm font-bold text-[#111827] mb-1">
          {isTe ? 'బిల్లు ఫోటో లేదా PDF అప్‌లోడ్' : 'Upload or Photograph Electricity Bill'}
        </h3>
        <p className="text-xs text-[#4B5563] mb-4">
          {isTe
            ? 'TGSPDCL లేదా TGNPDCL బిల్లును ఫ్రేమ్‌లో సమాంతరంగా ఉంచి ఫోటో తీయండి.'
            : 'Capture a clear, well-lit photo of your TGSPDCL or TGNPDCL bill.'}
        </p>

        {/* Guided Viewfinder Frame */}
        <div className="relative border-2 border-dashed border-[#CBD5E1] rounded-[12px] p-6 bg-[#F7F8F7] max-w-sm mx-auto mb-4">
          {/* Corner brackets simulating scanner viewfinder */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#0F5C54]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#0F5C54]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#0F5C54]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#0F5C54]" />

          <Camera className="w-10 h-10 text-[#0F5C54] mx-auto mb-2 opacity-80" />
          <span className="text-xs font-bold text-[#111827] block">
            {isTe ? 'ఫోటో తీయండి లేదా ఫైల్ ఎంచుకోండి' : 'Take Photo or Choose File'}
          </span>
          <span className="text-[11px] text-[#4B5563] mt-1 block">
            Supports PNG, JPEG, PDF up to 10MB
          </span>

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={() => startAnalysis(SAMPLE_BILLS[0])}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            disabled={!consentProcess || isScanning}
          />
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={!consentProcess || isScanning}
          onClick={() => startAnalysis(SAMPLE_BILLS[0])}
          className={`w-full py-3 px-4 rounded-[12px] font-bold text-sm min-touch flex items-center justify-center space-x-2 transition-all ${
            consentProcess && !isScanning
              ? 'bg-[#0F5C54] text-white hover:bg-[#0B4741]'
              : 'bg-[#E2E8F0] text-[#9CA3AF] cursor-not-allowed'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{isTe ? 'బిల్లును స్కాన్ చేయండి' : 'Scan & Explain Bill'}</span>
        </button>

        {/* Demo Fast Selector Chips */}
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-left">
          <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider block mb-2">
            {isTe ? 'నమూనా బిల్లులతో తక్షణమే పరీక్షించండి:' : 'Or test immediately with verified sample bills:'}
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => startAnalysis(SAMPLE_BILLS[0])}
              className="flex-1 text-left p-2.5 rounded-lg border border-[#E2E8F0] hover:border-[#0F5C54] hover:bg-[#E6F4F2]/30 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#111827]">TGSPDCL Current</span>
                <span className="text-xs font-mono font-bold text-[#0F5C54]">₹1,040</span>
              </div>
              <span className="text-[11px] text-[#4B5563]">198 units • 33 days</span>
            </button>

            <button
              type="button"
              onClick={() => startAnalysis(SAMPLE_BILLS[1])}
              className="flex-1 text-left p-2.5 rounded-lg border border-[#E2E8F0] hover:border-[#0F5C54] hover:bg-[#E6F4F2]/30 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#111827]">TGSPDCL Previous</span>
                <span className="text-xs font-mono font-bold text-[#0F5C54]">₹800</span>
              </div>
              <span className="text-[11px] text-[#4B5563]">150 units • 30 days</span>
            </button>

            <button
              type="button"
              onClick={() => startAnalysis(SAMPLE_BILLS[2])}
              className="flex-1 text-left p-2.5 rounded-lg border border-[#E2E8F0] hover:border-[#0F5C54] hover:bg-[#E6F4F2]/30 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#111827]">TGNPDCL Gruha</span>
                <span className="text-xs font-mono font-bold text-[#15803D]">168 u</span>
              </div>
              <span className="text-[11px] text-[#4B5563]">Under 200u limit</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Linear Progress Checklist during scanning (Replaces spinning wheels) */}
      {isScanning && (
        <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-4 shadow-sm animate-fast-reveal">
          <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">
            {isTe ? 'విశ్లేషణ పురోగతి (Verification Progress):' : 'Verification Progress:'}
          </h4>

          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-xs">
              {scanStep >= 1 ? (
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              ) : (
                <Circle className="w-4 h-4 text-[#CBD5E1]" />
              )}
              <span className={scanStep >= 1 ? 'font-semibold text-[#111827]' : 'text-[#6B7280]'}>
                {isTe ? '1. బిల్లు ఫోటో రీడింగ్ & OCR పరిశీలన' : '1. Reading bill document & extracting fields'}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              {scanStep >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              ) : (
                <Circle className="w-4 h-4 text-[#CBD5E1]" />
              )}
              <span className={scanStep >= 2 ? 'font-semibold text-[#111827]' : 'text-[#6B7280]'}>
                {isTe ? '2. అధికారిక TGERC టారిఫ్ నిబంధనలతో సరిచూడటం' : '2. Validating against official TGERC tariff slabs'}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              {scanStep >= 3 ? (
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              ) : (
                <Circle className="w-4 h-4 text-[#CBD5E1]" />
              )}
              <span className={scanStep >= 3 ? 'font-semibold text-[#111827]' : 'text-[#6B7280]'}>
                {isTe ? '3. తెలుగు సారాంశం & ఛార్జీల వివరణ సిద్ధం చేయడం' : '3. Preparing language summary & charge provenance'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
