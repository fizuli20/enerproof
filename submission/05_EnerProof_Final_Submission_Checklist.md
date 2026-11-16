# EnerProof: CECECO Clean Energy Hackathon 2027 Final Submission Checklist

**Project Name:** EnerProof  
**Tagline:** Energy efficiency you can prove.  
**Track:** Bringing Clean Energy to Everyday Life  
**Founder:** Fizuli Hasanov  
**Production URL:** [https://enerproof.vercel.app](https://enerproof.vercel.app)  
**GitHub Repository:** [https://github.com/fizuli20/enerproof](https://github.com/fizuli20/enerproof)  

---

## 1. Product Development & Engineering Verification

- [x] **Next.js 16 (App Router) + TypeScript + Tailwind CSS** production codebase in separate isolated repository `enerproof`.
- [x] **Design Tokens & Brand:** Implemented exact design system (`#F8F9F7` background, `#245C43` primary green, `#18211C` text, `#DFE5E0` borders).
- [x] **Zero Server Storage / Full Client Privacy:** CSV uploads and degree-day regressions run entirely in browser memory.
- [x] **Automated Unit Testing:** 19/19 Vitest unit tests passing cleanly in 114ms (`npm test`).
- [x] **Production Build:** Static page generation (17/17 routes) compiled without errors (`npm run build`).

---

## 2. Scientific & Statistical Integrity Gate

- [x] **Pre-Test Cohort Screening:** 152 buildings (82 lodging, 70 education) from BDG2 screened without test-period peaking.
- [x] **Evaluation Abstentions:** 9 test-period dropouts recorded as abstentions (`outputs/metrics/cohort_abstentions.csv`).
- [x] **Hourly-First Simulation:** Interventions applied at hourly resolution, aggregated via exact mathematical sums to daily and monthly.
- [x] **Restricted Imputation:** Replaced unrestricted forward/backward fills with strict $\le 3$h imputation.
- [x] **Standardized Baselines:** Implemented Ridge weather regression and HistGradientBoostingRegressor with documented monthly fallbacks.
- [x] **Repeated Synthetic Controls:** 50 repeated draws with centered residuals ($\mathbb{E}[e] = 0$).
- [x] **Power-Based MDE:** Replaced binary detection with minimum detected simulated reduction; established cohort daily MDE at 15.0%.
- [x] **Deterministic Evidence Gate:** Evaluates apparent savings against empirical noise floors and ASHRAE Guideline 14 Annex B Fractional Savings Uncertainty ($FSU \le 50\%$), issuing:
  - `EVIDENCE_SUPPORTS_ESTIMATE`
  - `ADDITIONAL_MEASUREMENT_REQUIRED`
  - `INSUFFICIENT_EVIDENCE`
- [x] **Cross-Building Residual Correlation:** Accounted for intra-site correlation ($\rho = 0.33$) in ESCO portfolio noise pooling.
- [x] **Transparent Disclaimers:** Every report and UI screen includes the required notice: *"Evidence assessments are analytical decision-support outputs based on modeled counterfactual baselines. They do not constitute formal regulatory certification or prove causal attribution."*

---

## 3. Demonstration Tracks

- [x] **Demo Track A: Baku Higher Oil School Public Filing Audit**
  - Gate 1: Detects 100% duplicate monthly readings across 2023–2024 (36 of 36 values).
  - Gate 2: Flags exact 10x GHG calculation discrepancy (497.79 t calculated vs ~4,978 t reported).
  - Gate 3: Flags bulk campus boundary meter and lack of dormitory submetering.
- [x] **Demo Track B: Student Residence Deep Energy Retrofit**
  - 5 interactive ECM calculators: LED lighting, HVAC night setback, plug load cutoffs, solar thermal hot water, boiler optimization.
  - Interactive Azerbaijan utility tariffs (default: 0.125 AZN/kWh).
  - Client-side investment-grade PDF export.
- [x] **Demo Track C: Building Energy Research Lab**
  - Interactive portfolio pooling from $K=1$ to $K=50$ buildings.
  - Empirical detection power curves vs simulated savings.
  - 10 research figures gallery.

---

## 4. Deployment & Submission Assets

- [x] **GitHub Repository:** Publicly available at [https://github.com/fizuli20/enerproof](https://github.com/fizuli20/enerproof) under account `fizuli20`.
- [x] **Vercel Production Deployment:** Live at [https://enerproof.vercel.app](https://enerproof.vercel.app) with HTTP/2 200 response.
- [x] **Submission Package (`submission/`):**
  - `01_EnerProof_Prototype_and_Demo_Access.pdf` (1-page quick start with scannable QR code)
  - `02_EnerProof_Technical_Validation.pdf` (comprehensive multi-page research dossier)
  - `03_EnerProof_Demo_Walkthrough.pdf` (step-by-step judge walkthrough)
  - `04_EnerProof_Submission_Links.txt` (plain-text competition links)
  - `05_EnerProof_Final_Submission_Checklist.md` (this audit checklist)
