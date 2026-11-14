import React, { useState } from 'react';
import { SAMPLE_BILLS } from './data/sampleBills';
import { BillData } from './types/billing';
import { Language } from './services/languageService';

// Screens & Components
import { Header } from './components/Header';
import { ConsentUploadScreen } from './components/ConsentUploadScreen';
import { VerificationScreen } from './components/VerificationScreen';
import { ExplainScreen } from './components/ExplainScreen';
import { TraceWaterfallScreen } from './components/TraceWaterfallScreen';
import { ForecastScenarioScreen } from './components/ForecastScenarioScreen';

export function App() {
  const [lang, setLang] = useState<Language>('te');
  const [activeTab, setActiveTab] = useState<string>('explain');
  const [currentBill, setCurrentBill] = useState<BillData>(SAMPLE_BILLS[0]);
  const [isBillUploaded, setIsBillUploaded] = useState<boolean>(true);

  const isTe = lang === 'te';

  const handleBillReady = (bill: BillData) => {
    setCurrentBill(bill);
    setIsBillUploaded(true);
    setActiveTab('explain');
  };

  const handleVerifyConfirm = (updatedBill: BillData) => {
    setCurrentBill(updatedBill);
    setActiveTab('explain');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F7] text-[#111827] flex flex-col font-sans">
      {/* Persistent Top Header (Without Challenge 31 / Govt at top, clean utility style) */}
      <Header
        lang={lang}
        onLanguageChange={(newLang) => setLang(newLang)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        isBillUploaded={isBillUploaded}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Screen Routing */}
        {activeTab === 'upload' && (
          <ConsentUploadScreen
            lang={lang}
            onBillReady={handleBillReady}
          />
        )}

        {activeTab === 'verify' && (
          <VerificationScreen
            bill={currentBill}
            lang={lang}
            onConfirm={handleVerifyConfirm}
          />
        )}

        {activeTab === 'explain' && (
          <ExplainScreen
            bill={currentBill}
            lang={lang}
          />
        )}

        {activeTab === 'trace' && (
          <TraceWaterfallScreen
            lang={lang}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastScenarioScreen
            lang={lang}
          />
        )}
      </main>

      {/* Subtle Informational Disclaimer Banner at the Bottom */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 px-4 text-center text-xs text-[#4B5563]">
        <div className="max-w-2xl mx-auto space-y-1">
          <p className="font-medium text-[#111827]">
            {isTe
              ? 'సమాచార సహాయక వ్యవస్థ • అధికారిక డిస్కం బిల్లు మాత్రమే తుది ప్రామాణికం'
              : 'Informational assistance • The official DISCOM bill remains authoritative'}
          </p>
          <p className="text-[11px] text-[#6B7280]">
            {isTe
              ? 'బిల్లు వ్యత్యాసాలు ధృవీకరణ కోసం మాత్రమే, ఓవర్‌ఛార్జింగ్ కాదు. DPDP చట్టం 2023 గోప్యతా రక్షణలు వర్తిస్తాయి.'
              : 'Bill variances are provided for verification, never as an accusation of overcharging. DPDP Act 2023 privacy protections apply.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
