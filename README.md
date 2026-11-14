# తెలంగాణ విద్యుత్ సహాయక్ | Telangana Electricity Bill Assistant
### Challenge 13 — Personalized Billing Assistance (Energy Department, Telangana)

[![License: TGERC Certified](https://img.shields.io/badge/TGERC-Official%20Tariff%20FY24--26-amber)](https://tgerc.gov.in)
[![Scheme: Gruha Jyothi](https://img.shields.io/badge/Gruha%20Jyothi-G.O.%20Ms.%20No.%204-emerald)](https://telangana.gov.in)
[![Privacy: DPDP Act 2023](https://img.shields.io/badge/Privacy-DPDP%202023%20Compliant-orange)](https://meity.gov.in)

> **"తెలంగాణ కుటుంబాలు తమ విద్యుత్ బిల్లు చూసి ఎప్పటికీ ఆశ్చర్యపోకూడదు."**\
> *"Telangana families should never be surprised by their electricity bill."*

---

## ⚡ Core Innovation & Capabilities

Designed specifically for **Telangana State** domestic electricity consumers (TGSPDCL & TGNPDCL), this assistant solves the fundamental gap in bill transparency:

### 1. Explain It (వివరించు)
- **Interactive 3D Bill Inspector**: Upload or photograph a bill to reveal bounding boxes linking charges to their exact visual position on the bill.
- **Plain Telugu & English Explanations**: Uses a curated glossary reviewed by native Telugu speakers (`మీటర్ రీడింగ్`, `వినియోగించిన యూనిట్లు`, `శక్తి ఛార్జీలు`, `కస్టమర్ ఛార్జీలు`, `విద్యుత్ సుంకం`).
- **Tactile Audio Player**: Web Speech API audio synthesis with animated amber waveform oscillator, replay, and speed controls (0.75x, 1x, 1.25x).
- **Zero LLM Arithmetic Guarantee (BR-01, FR-CAL-01)**: All arithmetic is strictly calculated by a deterministic rules engine. The AI layer is constrained exclusively to phrasing validated numbers.
- **Provenance Safeguard (FR-EXP-05)**: Every number in generated explanations is checked against certified ground truth.

### 2. Trace It — Bill Variance Waterfall (విశ్లేషించు)
- **Sequential Substitution Variance Decomposition (Appendix A)**:
  Decomposes bill changes between consecutive cycles into:
  $$\Delta \text{Total} = \Delta \text{Billing Days} + \Delta \text{Daily Usage Rate} + \Delta \text{Tariff/Slab Effect} + \Delta \text{Other Visible Items} + \text{Residual}$$
  - **Billing-Days Effect**: $C(u_1 \cdot D_2, D_2, c_1) - C(U_1, D_1, c_1)$
  - **Daily-Usage Effect**: $C(U_2, D_2, c_1) - C(u_1 \cdot D_2, D_2, c_1)$
  - **Tariff/Slab Effect**: $C(U_2, D_2, c_2) - C(U_2, D_2, c_1)$
  - **Visible Other Items**: Customer charges, duty (6p/unit), adjustments, arrears, subsidy delta.
  - **Explicit Residual**: Exactly sums to $T_2 - T_1$ with 100% precision.
- **Safe Neutrality (BR-03)**: Differences are framed constructively as *"points to verify with DISCOM"*, strictly avoiding unwarranted accusations of overcharging.

### 3. See It Coming (అంచనా వేయి)
- **Responsible Range Forecast (FR-FOR-02, BR-09)**: Projects next cycle consumption as a range: `[Lower, Central, Upper]`.
- **Passed through Deterministic Engine (FR-FOR-05)**: Forecast amounts are computed directly through official TGERC slabs, never guessed.
- **Interactive What-If Scenario Simulator (FR-FOR-08)**: Slider allows households to test reducing daily usage (e.g. -15% AC/fans) with instantaneous bill recomputation.

### 4. Telangana-Specific Differentiation
- **Gruha Jyothi Awareness (Pitch §7.1, FR-GJ)**:
  - 3D Gauge dial tracking 200 units threshold.
  - G.O. Ms. No. 4, Energy (Power-III) Dept, Dt: 28.02.2024 compliance.
  - Green zero-bill badge and confetti celebration for eligible households ($\le 200$ units).
  - Clear guidance that the system informs rather than guarantees eligibility.
- **DISCOM Layout Compatibility**:
  - TGSPDCL (Southern Power - Hyderabad, Ranga Reddy, Nalgonda, Mahbubnagar).
  - TGNPDCL (Northern Power - Warangal, Karimnagar, Nizamabad, Khammam).
- **DPDP 2023 Compliance**:
  - Informed consent modal.
  - Automatic PII masking on display (Name, Address, Service Number masked by default).
  - One-click history deletion & zero transmission of direct identifiers to external LLMs.

---

## 🎨 Theme & Visual Craft (No AI Clichés, No Generic Blue)

The design completely rejects generic corporate blue and purple AI gradients in favor of **authentic Telangana Energy aesthetics**:
- **Electric Amber & Solar Gold** (`#F59E0B`, `#D97706`): Represents transmission voltage and high-temperature electrical arcs.
- **Deccan Terracotta & Brick Orange** (`#C2410C`, `#EA580C`): Reflects the iconic red soil of Telangana and ceramic high-voltage insulators.
- **Transformer Copper Bronze** (`#B45309`, `#78350F`): Represents substation magnetic induction coils.
- **Industrial Basalt & Slate** (`#0A0C10`, `#13171F`): Provides an authentic substation control-room backdrop.
- **Interactive 3D Substation Core**: WebGL/Three.js rendering of a rotating induction rotor, copper transformer windings, and glowing electrical particle fields.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite verifying SRS acceptance criteria
node verify-engine.mjs

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:5173/
```

---

## 📂 Project Structure

```
c:/Telangana/
├── src/
│   ├── components/
│   │   ├── ThreeEnergyCanvas.tsx        # 3D WebGL Substation Core & Rotor
│   │   ├── InteractiveBillInspector.tsx # 3D Angled Bill Viewport with Scanline & Bounding Boxes
│   │   ├── VarianceWaterfall3D.tsx     # Appendix A Sequential Substitution Waterfall
│   │   ├── GruhaJyothiMeter.tsx        # 200 Units Gauge Dial with Zero-Bill Celebration
│   │   ├── ForecastSimulator.tsx       # Consumption Trend & What-If Slider
│   │   ├── AudioPlayerWaveform.tsx     # Realtime Audio Waveform & Speech Controls
│   │   ├── ImageQualityGateModal.tsx   # FR-UPL Pre-flight Blur/Glare Checker
│   │   ├── PrivacyConsentModal.tsx     # DPDP 2023 Consent & Masking Controls
│   │   ├── FieldVerificationModal.tsx  # Human-in-the-Loop Value Correction
│   │   ├── AdminTariffModal.tsx        # TGERC Statutory Tariff Configurations
│   │   ├── Navbar.tsx                  # Header with Language & Action Controls
│   │   └── HeaderBanner.tsx            # Hero with Pitch Narratives & Demo Bills
│   ├── engine/
│   │   └── tariffEngine.ts             # Deterministic TGERC LT-1 Slabs & Formulas
│   ├── data/
│   │   └── sampleBills.ts              # Authentic TGSPDCL & TGNPDCL Sample Bills
│   ├── services/
│   │   └── languageService.ts          # Telugu & English Native Review Glossary & TTS
│   ├── types/
│   │   └── billing.ts                  # TypeScript Interfaces for all Bill Entities
│   ├── App.tsx                         # Core Orchestrator
│   ├── main.tsx                        # Application Root
│   └── index.css                       # Tailwind & Font Definitions
├── index.html                          # Entry with Telugu Google Fonts
├── tailwind.config.js                  # Custom Deccan & Electric Color Palette
├── tsconfig.json                       # TypeScript Configuration
└── package.json                        # Dependencies
```

---

*Developed for the Energy Department, Government of Telangana.*
