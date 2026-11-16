import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
import pypdf

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#4B5563"))
        
        # Header (pages 1 to 5)
        self.drawString(36, 756, "ENERPROOF  /  CECECO CLEAN ENERGY HACKATHON 2027")
        self.drawRightString(576, 756, f"FIZULI HASANOV  •  PROJECT PROPOSAL  |  {self._pageNumber}")
        self.setStrokeColor(colors.HexColor("#D1D5DB"))
        self.setLineWidth(0.5)
        self.line(36, 750, 576, 750)
        
        # Footer
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.line(36, 32, 576, 32)
        self.drawString(36, 22, "https://enerproof.vercel.app  •  CECECO Clean Energy Hackathon 2027  •  Track: Bringing Clean Energy to Everyday Life")
        self.drawRightString(576, 22, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_proposal_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=40,
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    sec_num_style = ParagraphStyle(
        'SecNum',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=10,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=2,
    )
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=22,
        textColor=colors.HexColor("#111827"),
        spaceAfter=1,
    )
    
    tagline_style = ParagraphStyle(
        'Tagline',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=11,
        leading=13,
        textColor=colors.HexColor("#164E3A"),
        spaceAfter=4,
    )
    
    byline_style = ParagraphStyle(
        'Byline',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#4B5563"),
        spaceAfter=6,
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=12.5,
        textColor=colors.HexColor("#111827"),
        spaceBefore=5,
        spaceAfter=3,
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.1,
        leading=10.6,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=4.5,
    )
    
    body_bold = ParagraphStyle(
        'Body_Bold',
        parent=body_style,
        fontName='Helvetica-Bold',
    )
    
    caption_style = ParagraphStyle(
        'Caption_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.2,
        leading=9.2,
        textColor=colors.HexColor("#4B5563"),
        spaceAfter=3,
    )

    story = []

    # =========================================================================
    # PAGE 1: PROBLEM STATEMENT & REAL DATA AUDIT
    # =========================================================================
    story.append(Paragraph("01 / PROBLEM STATEMENT", sec_num_style))
    story.append(Paragraph("EnerProof", title_style))
    story.append(Paragraph("Energy efficiency you can prove.", tagline_style))
    story.append(Paragraph(
        "Fizuli Hasanov &nbsp;|&nbsp; Azerbaijan &nbsp;|&nbsp; Bringing Clean Energy to Everyday Life &nbsp;|&nbsp; November 2026",
        byline_style
    ))
    
    # URL Banner
    banner_data = [[
        Paragraph(
            "<b>Production Platform:</b> <font color='#164E3A'><u>https://enerproof.vercel.app</u></font> &nbsp;•&nbsp; "
            "<b>Judge Review (3 Min):</b> <font color='#164E3A'><u>https://enerproof.vercel.app/judge</u></font> &nbsp;•&nbsp; "
            "<b>GitHub:</b> <font color='#164E3A'><u>https://github.com/fizuli20/enerproof</u></font>",
            body_style
        )
    ]]
    banner_table = Table(banner_data, colWidths=[540])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#BBF7D0")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 4))

    story.append(Paragraph(
        "EnerProof is a deterministic Measurement & Verification (M&V) decision support platform engineered for energy auditors, ESCOs, and the Azerbaijan Energy Efficiency Fund. It enables practitioners to identify bounded energy conservation measures, select an appropriate IPMVP measurement boundary before capital outlay, and verify post-intervention claims using building-specific statistical thresholds. Crucially, EnerProof refuses to fabricate causal savings claims when real data is confounded by baseline noise, missing intervals, or unverified operational shifts.",
        body_style
    ))

    story.append(Paragraph("The clean-energy challenge", h1_style))
    story.append(Paragraph(
        "Energy efficiency represents the fastest, most capital-effective pathway to mitigate greenhouse gas emissions and optimize grid load. The International Energy Agency (IEA) estimates Azerbaijan possesses approximately 23 million m² of non-residential building stock with an average energy intensity of ~220 kWh/m² per annum, highlighting a pervasive shortage of verified interval data [2]. A 2026 national AI-energy playbook published by 4SIM and the World Economic Forum documents an administrative facility with 100 independently operated split-system AC units and a commercial supermarket with 50 units where centralized building management systems (BMS) proved economically and physically infeasible [3, p.14]. EnerProof directly addresses this un-automated segment through rigorous pre-intervention audits and targeted sub-circuit metering.",
        body_style
    ))

    # 3 Metrics Callouts
    kpi_data = [
        [
            Paragraph("<b>23M m²</b><br/><font size=6.5 color='#4B5563'>Estimated non-residential floor area in Azerbaijan [2]</font>", body_style),
            Paragraph("<b>100 units</b><br/><font size=6.5 color='#4B5563'>Independent HVAC split units in one pilot facility [3]</font>", body_style),
            Paragraph("<b>0.125 AZN</b><br/><font size=6.5 color='#4B5563'>Illustrative non-residential electricity tariff per kWh [6]</font>", body_style)
        ]
    ]
    kpi_table = Table(kpi_data, colWidths=[180, 180, 180])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F9FAFB")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 4))

    story.append(Paragraph("Local case study: Baku Higher Oil School (BHOS) public data audit", h1_style))
    story.append(Paragraph(
        "To evaluate real-world audit mechanics, EnerProof screened the published 3-year sustainability reports (2022–2024) of Baku Higher Oil School (BHOS), which report 995,575 kWh of combined campus/Khatai electricity and 602,889 m³ of boiler gas [4–5]. EnerProof’s automated data quality engine uncovered two critical provenance findings: (1) <i>Temporal Duplication:</i> Exactly 36 out of 36 monthly readings across all three series in 2024 match 2023 figures identically (100% duplicate rate), proving a copy-forward reporting artifact rather than true operational constancy; and (2) <i>Emissions Arithmetic Discrepancy:</i> The published report applies the national factor of 0.5 kg CO₂/kWh to 995,575 kWh but reports ~4,978 metric tonnes CO₂—an exact 10x arithmetic scaling error (the true product is 497.79 metric tonnes). EnerProof handles these findings neutrally as objective data-quality flags requiring meter remediation.",
        body_style
    ))

    story.append(Paragraph("Intended users and market beneficiaries", h1_style))
    story.append(Paragraph(
        "<b>Primary Users:</b> Certified energy auditors, energy service companies (ESCOs), municipal facility directors, and the Azerbaijan Energy Efficiency Fund. The initial implementation focus is university campuses and student dormitories, where high occupancy, fixed equipment schedules, and active heating/cooling create fertile ground for verifiable energy conservation. Building owners achieve audit clarity, occupants maintain verified thermal comfort, and financiers secure defensible evidence before releasing capital.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: SOLUTION, EVIDENCE GATE & RETROFIT EXAMPLE
    # =========================================================================
    story.append(Paragraph("02 / PROJECT PROPOSAL", sec_num_style))
    story.append(Paragraph("Solution and workflow architecture", h1_style))
    story.append(Paragraph(
        "EnerProof unifies energy time-series auditing, engineering physics calculations, IPMVP measurement boundary design, and financial lifecycle accounting into one cohesive client-side workflow. It requires no proprietary IoT hardware or intrusive cloud integrations, executing entirely in browser memory for complete client privacy.",
        body_style
    ))

    # Workflow table
    wf_data = [
        [Paragraph("<b>Stage</b>", body_style), Paragraph("<b>Platform Engine Action</b>", body_style), Paragraph("<b>User Output & Evidence Asset</b>", body_style)],
        [Paragraph("<b>01 Audit</b>", body_style), Paragraph("Screens gaps, duplicate profiles, zero-runs, and emissions arithmetic.", body_style), Paragraph("Data quality scorecard and remediation log.", body_style)],
        [Paragraph("<b>02 Plan</b>", body_style), Paragraph("Calculates bounded physics models for lighting, HVAC, plug load, water, boilers.", body_style), Paragraph("Ranked ECM matrix, capital costs, safe payback.", body_style)],
        [Paragraph("<b>03 Measure</b>", body_style), Paragraph("Selects IPMVP Option A/B (isolated circuits) vs Option C (counterfactual).", body_style), Paragraph("Measurement boundary specification and logging schedule.", body_style)],
        [Paragraph("<b>04 Verify</b>", body_style), Paragraph("Evaluates savings against building-specific noise threshold & ASHRAE 14 FSU.", body_style), Paragraph("Deterministic Evidence Gate classification.", body_style)],
        [Paragraph("<b>05 Decide</b>", body_style), Paragraph("Aggregates lifecycle cash flows, utility tariffs, and remaining uncertainties.", body_style), Paragraph("Exportable investment-grade PDF/CSV audit reports.", body_style)],
    ]
    wf_table = Table(wf_data, colWidths=[65, 275, 200])
    wf_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(wf_table)
    story.append(Spacer(1, 4))

    story.append(Paragraph("The Evidence Gate: Building-specific statistical refusal", h1_style))
    story.append(Paragraph(
        "Unlike conventional energy dashboards that apply arbitrary rules-of-thumb or universal cohort thresholds, EnerProof features a building-specific Evidence Gate. It calculates a customized noise floor based on each building’s empirical baseline variance (CV(RMSE)), calibration sample size ($m$), reporting observations ($n$), and lag-1 residual autocorrelation ($r_1$). If empirical data is insufficient to compute a statistically defensible threshold, it returns <b>UNESTABLISHED</b>. It issues one of three deterministic verdicts:",
        body_style
    ))

    gate_data = [
        [Paragraph("<b>Gate Status</b>", body_style), Paragraph("<b>Operational Meaning & Protocol Action</b>", body_style)],
        [
            Paragraph("<font color='#164E3A'><b>EVIDENCE_SUPPORTS_ESTIMATE</b></font>", body_style),
            Paragraph("Apparent reduction clears building-specific threshold and Fractional Savings Uncertainty (FSU) &le; 50%. Engineering estimate supported under stated boundary. Not a regulatory certification.", body_style)
        ],
        [
            Paragraph("<font color='#B45309'><b>ADDITIONAL_MEASUREMENT_REQUIRED</b></font>", body_style),
            Paragraph("Intervention is physically plausible, but post-intervention duration is too short or FSU exceeds 50%. Recommends submetering or extended logging before asserting savings.", body_style)
        ],
        [
            Paragraph("<font color='#991B1B'><b>INSUFFICIENT_EVIDENCE</b></font>", body_style),
            Paragraph("Observed reduction fails to clear the building's modeled baseline error floor, data quality failed, or net savings are non-positive. Firmly blocks positive savings assertion.", body_style)
        ],
    ]
    gate_table = Table(gate_data, colWidths=[180, 360])
    gate_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(gate_table)
    story.append(Spacer(1, 4))

    story.append(Paragraph("Concrete demonstration: University student residence LED retrofit", h1_style))
    story.append(Paragraph(
        "Consider a 500-occupant university dormitory in Baku. Common areas and corridors contain 500 outdated 64W fluorescent fixtures operating 12 hours/day, 300 days/year. Replacing them with 24W sensor-equipped LED fixtures saves 40W per fixture (72,000 kWh/year). At the illustrative non-residential tariff of 0.125 AZN/kWh, gross annual savings are 9,000 AZN. With a fixture capital cost of 35 AZN (17,500 AZN total investment), simple payback is achieved in 1.9 years. Under IPMVP Option A (Retrofit Isolation), 15-minute circuit logging over 30 days verifies runtime hours with spot wattage checks, keeping FSU within 12.5% without exposing the measurement to whole-building weather noise.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: TECHNICAL APPROACH, MATHEMATICS & VALIDATION
    # =========================================================================
    story.append(Paragraph("03 / PROJECT PROPOSAL", sec_num_style))
    story.append(Paragraph("Technical approach, mathematical formulation & empirical validation", h1_style))
    story.append(Paragraph(
        "EnerProof replaces unverified assertions with rigorous applied statistics and building physics. The platform enforces strict chronological partitioning, transparent regularized degree-day baselines, and documented autocorrelation corrections.",
        body_style
    ))

    story.append(Paragraph("1. Chronological Train-Calibrate Separation & Baseline Regression", body_bold))
    story.append(Paragraph(
        "To avoid lookahead bias and synthetic data leakage, EnerProof splits pre-intervention intervals into strictly chronological partitions: <b>Train</b> ($T_1$ to $T_{\\text{train}}$, e.g. 180 days) and an independent <b>Calibration</b> window ($T_{\\text{train}+1}$ to $T_{\\text{base}}$, e.g. 30 days). The baseline regression models daily energy as a function of heating and cooling degree-days:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>E<sub>pred, t</sub> = &beta;<sub>0</sub> + &beta;<sub>1</sub> &times; HDD<sub>18, t</sub> + &beta;<sub>2</sub> &times; CDD<sub>18, t</sub> + &beta;<sub>3</sub> &times; I<sub>occ, t</sub></b><br/>"
        "The model reports out-of-sample CV(RMSE) and unclipped $R^2$. If the independent calibration window contains fewer than 14 observations, out-of-sample reliability cannot be established, and the threshold is classified as <b>UNESTABLISHED</b>.",
        body_style
    ))

    story.append(Paragraph("2. Building-Specific Statistical Noise Floor & Autocorrelation", body_bold))
    story.append(Paragraph(
        "Whole-building counterfactual evaluation (IPMVP Option C) evaluates whether apparent savings clear the building's own empirical noise threshold at confidence level $(1 - \\alpha)$:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>Threshold<sub>building</sub> = z<sub>1-&alpha;</sub> &times; CV(RMSE) &times; &radic;[ (1/m + 1/n) &times; (1 + r<sub>1</sub>)/(1 - r<sub>1</sub>) ] &times; 100%</b><br/>"
        "where $m$ is the calibration sample size, $n$ is the reporting-period sample size, and $r_1$ is the empirical lag-1 residual autocorrelation. Fractional Savings Uncertainty (FSU) is computed in accordance with ASHRAE Guideline 14 Annex B:",
        body_style
    ))

    # Formula Callout
    eq_data = [[
        Paragraph(
            "<b>ASHRAE Guideline 14 Annex B Fractional Savings Uncertainty (FSU):</b><br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;<b>FSU = [ z<sub>1-&alpha;/2</sub> &times; (CV(RMSE) / f<sub>sav</sub>) &times; &radic;[ (1/m + 1/n) &times; (1 + r<sub>1</sub>)/(1 - r<sub>1</sub>) ] ] &times; 100%</b><br/>"
            "<font size=7 color='#4B5563'>Where f<sub>sav</sub> = apparent savings fraction. If FSU &gt; 50%, the Evidence Gate returns ADDITIONAL_MEASUREMENT_REQUIRED.</font>",
            body_style
        )
    ]]
    eq_table = Table(eq_data, colWidths=[540])
    eq_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F9FAFB")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(eq_table)
    story.append(Spacer(1, 4))

    story.append(Paragraph("3. Equipment Isolation (IPMVP Option A/B) vs Whole-Building (Option C)", body_bold))
    story.append(Paragraph(
        "A central architectural insight of EnerProof is boundary selection. When a building’s baseline CV(RMSE) is 15% and an ECM yields 3% whole-building reduction, whole-building counterfactuals (Option C) are mathematically incapable of distinguishing savings from weather/occupancy noise. EnerProof’s M&V planner automatically recommends IPMVP Option A/B (isolated submetering of lighting or HVAC circuits), eliminating whole-building variance noise and reducing FSU to &le; 15%.",
        body_style
    ))

    story.append(Paragraph("4. Multi-Building Portfolio Aggregation: Uncertainty vs Residual Correlation Floor", body_bold))
    story.append(Paragraph(
        "In ESCO and Energy Efficiency Fund portfolio pooling, independent error cancellation is often naively assumed (&sigma;<sub>P</sub> = &sigma; / &radic;K). EnerProof enforces mathematical integrity: in the User Portfolio Calculator, if empirical cross-building error covariance &Sigma; is missing, portfolio uncertainty is returned as <b>UNESTABLISHED</b>. In the Research Benchmark Explorer, EnerProof incorporates the archived Building Data Genome 2 (BDG2) empirical correlation floor (&rho; &asymp; 0.33), proving that portfolio noise never cancels to zero as K &rarr; &infin;, establishing an asymptotic portfolio uncertainty floor of ~4.2%.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: EXPECTED ENERGY, FINANCIAL & USER IMPACT
    # =========================================================================
    story.append(Paragraph("04 / PROJECT PROPOSAL", sec_num_style))
    story.append(Paragraph("Expected energy, financial and lifecycle impact", h1_style))
    story.append(Paragraph(
        "EnerProof empowers auditors to engineer actionable interventions with full lifecycle cost-benefit transparency. Savings figures represent physical engineering models, not unsubstantiated estimates.",
        body_style
    ))

    story.append(Paragraph("Five verified ECM calculators for educational and living facilities", h1_style))
    
    # ECM Table
    ecm_data = [
        [
            Paragraph("<b>Energy Conservation Measure (ECM)</b>", body_style),
            Paragraph("<b>Annual Savings</b>", body_style),
            Paragraph("<b>Gross AZN</b>", body_style),
            Paragraph("<b>Capital Cost</b>", body_style),
            Paragraph("<b>M&V Cost</b>", body_style),
            Paragraph("<b>Net AZN/yr</b>", body_style),
            Paragraph("<b>Simple Payback</b>", body_style),
        ],
        [
            Paragraph("<b>1. LED Lighting & Controls:</b> 500 fixtures, 40W delta, 12h/d", body_style),
            Paragraph("72,000 kWh", body_style),
            Paragraph("9,000 AZN", body_style),
            Paragraph("17,500 AZN", body_style),
            Paragraph("300 AZN", body_style),
            Paragraph("8,700 AZN", body_style),
            Paragraph("2.0 yrs", body_style),
        ],
        [
            Paragraph("<b>2. HVAC Scheduling:</b> 120 kW cooling, 25h/wk reduction", body_style),
            Paragraph("46,200 kWh", body_style),
            Paragraph("5,775 AZN", body_style),
            Paragraph("4,500 AZN", body_style),
            Paragraph("400 AZN", body_style),
            Paragraph("5,375 AZN", body_style),
            Paragraph("0.8 yrs", body_style),
        ],
        [
            Paragraph("<b>3. Plug Load Management:</b> 250 workstations, 12h/d cutoff", body_style),
            Paragraph("18,000 kWh", body_style),
            Paragraph("2,250 AZN", body_style),
            Paragraph("2,800 AZN", body_style),
            Paragraph("150 AZN", body_style),
            Paragraph("2,100 AZN", body_style),
            Paragraph("1.3 yrs", body_style),
        ],
        [
            Paragraph("<b>4. Solar Thermal Pre-Heat:</b> 500 occupants, 10°C lift", body_style),
            Paragraph("14,400 m³ gas", body_style),
            Paragraph("4,104 AZN", body_style),
            Paragraph("14,000 AZN", body_style),
            Paragraph("350 AZN", body_style),
            Paragraph("3,754 AZN", body_style),
            Paragraph("3.7 yrs", body_style),
        ],
        [
            Paragraph("<b>5. Boiler Optimization:</b> 1,500 kW boiler, 3.0% seasonal gain", body_style),
            Paragraph("18,087 m³ gas", body_style),
            Paragraph("5,155 AZN", body_style),
            Paragraph("6,200 AZN", body_style),
            Paragraph("300 AZN", body_style),
            Paragraph("4,855 AZN", body_style),
            Paragraph("1.3 yrs", body_style),
        ],
        [
            Paragraph("<b>Total Combined Facility Package</b>", body_bold),
            Paragraph("<b>136.2 MWh + 32.5k m³</b>", body_bold),
            Paragraph("<b>26,284 AZN</b>", body_bold),
            Paragraph("<b>45,000 AZN</b>", body_bold),
            Paragraph("<b>1,500 AZN</b>", body_bold),
            Paragraph("<b>24,784 AZN</b>", body_bold),
            Paragraph("<b>1.8 yrs</b>", body_bold),
        ],
    ]
    ecm_table = Table(ecm_data, colWidths=[175, 75, 55, 60, 50, 60, 65])
    ecm_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 3),
        ('RIGHTPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(ecm_table)
    story.append(Spacer(1, 4))

    story.append(Paragraph("Lifecycle financial safeguards and safe payback enforcement", h1_style))
    story.append(Paragraph(
        "EnerProof incorporates full lifecycle cost accounting: <i>Net Annual Savings = Gross Utility Savings &minus; Recurring Maintenance &minus; Annual Measurement & Verification Costs</i>. If net annual savings are non-positive (&le; 0), EnerProof strictly returns <b>null</b> and displays <i>'No positive payback'</i> rather than fabricating arbitrary 999-year values. HVAC calculations enforce an explicit dormitory ventilation compliance check (minimum 8 L/s per person) before allowing runtime curtailment.",
        body_style
    ))

    story.append(Paragraph("Macro scenarios using published university energy baselines", h1_style))
    story.append(Paragraph(
        "Applying verified efficiency gains to the published BHOS 2023 electricity baseline (995,575 kWh) and natural gas baseline (602,889 m³) illustrates substantial national potential at 0.125 AZN/kWh electricity and 0.285 AZN/m³ gas:",
        body_style
    ))

    macro_data = [
        [Paragraph("<b>Intervention Scenario</b>", body_style), Paragraph("<b>Electricity Saved</b>", body_style), Paragraph("<b>Elec Savings (AZN)</b>", body_style), Paragraph("<b>Gas Saved (m³)</b>", body_style), Paragraph("<b>Gas Savings (AZN)</b>", body_style), Paragraph("<b>CO₂ Avoided (t/yr)</b>", body_style)],
        [Paragraph("1% Baseline Reduction", body_style), Paragraph("9,956 kWh", body_style), Paragraph("1,244 AZN", body_style), Paragraph("6,029 m³", body_style), Paragraph("1,718 AZN", body_style), Paragraph("16.4 tCO₂", body_style)],
        [Paragraph("3% Targeted Retrofit", body_style), Paragraph("29,867 kWh", body_style), Paragraph("3,733 AZN", body_style), Paragraph("18,087 m³", body_style), Paragraph("5,155 AZN", body_style), Paragraph("49.3 tCO₂", body_style)],
        [Paragraph("5% Comprehensive Package", body_style), Paragraph("49,779 kWh", body_style), Paragraph("6,222 AZN", body_style), Paragraph("30,144 m³", body_style), Paragraph("8,591 AZN", body_style), Paragraph("82.2 tCO₂", body_style)],
    ]
    macro_table = Table(macro_data, colWidths=[120, 85, 85, 80, 85, 85])
    macro_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 3),
        ('RIGHTPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(macro_table)
    story.append(Spacer(1, 2))
    story.append(Paragraph("<font size=6.5 color='#4B5563'><i>Note: Macro scenarios represent discrete analytical benchmarks. Avoided emissions assume 0.5 kg CO₂/kWh grid factor and 1.9 kg CO₂/m³ gas factor.</i></font>", caption_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: FEASIBILITY, COMMERCIAL ROADMAP, TEAM & REFERENCES
    # =========================================================================
    story.append(Paragraph("05 / PROJECT PROPOSAL", sec_num_style))
    story.append(Paragraph("Feasibility, commercialization, delivery roadmap & production readiness", h1_style))
    story.append(Paragraph(
        "EnerProof has transitioned from research proof-of-concept into a fully deployed production platform. It provides an immediate, zero-friction verification engine aligned with Azerbaijan’s evolving regulatory frameworks.",
        body_style
    ))

    story.append(Paragraph("Implementation pilot plan and 8-week field schedule", body_bold))
    story.append(Paragraph(
        "<b>Weeks 1–2 (Baseline & Comfort Audit):</b> Install 15-minute loggers on isolated dormitory lighting and HVAC circuits; inventory fixture counts and measure baseline spot wattages; verify indoor air quality and minimum ventilation requirements.<br/>"
        "<b>Weeks 3–4 (M&V Boundary Design):</b> Formulate IPMVP Option A/B measurement plan; conduct pre-intervention data screening in EnerProof to confirm temporal independence and lack of duplicate profiles.<br/>"
        "<b>Weeks 5–8 (Intervention & Evidence Verification):</b> Execute low-risk LED retrofit or HVAC setback; log post-intervention runtime; execute Evidence Gate assessment and generate exportable investment-grade reports.<br/>"
        "<b>Indicative Pilot Budget:</b> 250 AZN platform setup, 250 AZN temporary metering loggers, 400 AZN professional engineering oversight, 100 AZN contingency = <b>1,000 AZN total pilot expenditure</b> (excluding capital hardware).",
        body_style
    ))

    story.append(Paragraph("Commercial pathway: Alignment with Azerbaijan Energy Efficiency Fund", body_bold))
    story.append(Paragraph(
        "Law No. 359-VIQ on the Efficient Use of Energy Resources mandates certified energy managers for large non-residential facilities and establishes the Energy Efficiency Fund [11–12]. EnerProof targets licensed energy auditors and ESCOs through a B2B SaaS model: 100–250 AZN per building assessment or 600–1,200 AZN/year professional license. Regional expansion targets CECECO member states by adapting localized degree-day baselines, tariffs, and language packs.",
        body_style
    ))

    story.append(Paragraph("Production release status & founder credentials", body_bold))
    story.append(Paragraph(
        "<b>Production Release:</b> The complete V2 platform is live at <b>https://enerproof.vercel.app</b> with a dedicated 3-minute hackathon judge experience at <b>https://enerproof.vercel.app/judge</b>. The open-source repository is available at <b>https://github.com/fizuli20/enerproof</b> (Release Tag: <code>v2.0.0-cececo</code>). The codebase contains 23/23 passing automated Vitest unit tests and 6/6 verified Playwright end-to-end workflows.<br/>"
        "<b>Founder Experience:</b> Fizuli Hasanov possesses professional sustainability research experience at Deloitte Azerbaijan, climate-tech product leadership through Carboryn (1st Place, GreenTech Festival III), and engineering experience building FVeda and AISE.",
        body_style
    ))

    story.append(Paragraph("References and standards attribution", h1_style))
    ref_text = (
        "[1] CECECO. Clean Energy Hackathon 2027 Official Rules & Evaluation Criteria (2026).<br/>"
        "[2] International Energy Agency (IEA). Energy Efficiency Policy in Azerbaijan: A Roadmap (2024).<br/>"
        "[3] 4SIM / World Economic Forum (WEF). Piloting Buildings of the Future: Azerbaijan’s AI-Energy Playbook (2026), p.14.<br/>"
        "[4] Baku Higher Oil School (BHOS). Green House Gas Emission Report 2023, pp.9–10, 12.<br/>"
        "[5] Baku Higher Oil School (BHOS). Green House Gas Emission Report 2024, pp.9–10, 24.<br/>"
        "[6] Azerbaijan Tariff Council (AERA). Domestic & Non-Residential Electricity and Natural Gas Tariffs (Dec 2024).<br/>"
        "[7] Miller et al. The Building Data Genome Project 2. Nature Scientific Data 7, 368 (2020).<br/>"
        "[8] Efficiency Valuation Organization (EVO). International Performance Measurement & Verification Protocol (IPMVP Core Concepts).<br/>"
        "[9] ASHRAE. Guideline 14-2014: Measurement of Energy, Demand, and Water Savings (Annex B: Uncertainty Analysis).<br/>"
        "[10] EnerProof Scientific Research Package (Experiment 2 Review & V2 Calibration Engine, 16 Nov 2026).<br/>"
        "[11] Azerbaijan Ministry of Energy. Law No. 359-VIQ on Energy Manager Certification & Mandatory Audits (2025).<br/>"
        "[12] Azerbaijan Energy Regulatory Agency (AERA). Energy Efficiency Fund Operational Framework & Criteria (2026)."
    )
    story.append(Paragraph(ref_text, caption_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph(
        "<font size=6 color='#6B7280'><i>Tools acknowledged: Next.js, TypeScript, Tailwind CSS, Python, scikit-learn, Vitest, Playwright, ChatGPT, Claude, Gemini, and Antigravity. All calculations, figures, and code are project-generated.</i></font>",
        caption_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    
    # Verify exact page count
    reader = pypdf.PdfReader(output_path)
    print(f"Generated {output_path} with {len(reader.pages)} pages.")
    return len(reader.pages)

if __name__ == "__main__":
    out_pdf = "/Users/fizuli.050icloud.com/Downloads/enerproof/submission/final/00_EnerProof_CECECO_Proposal_Final.pdf"
    pages = build_proposal_pdf(out_pdf)
    if pages != 5:
        print(f"ERROR: Expected exactly 5 pages, but got {pages} pages!")
        sys.exit(1)
    else:
        print("SUCCESS: Proposal is exactly 5 pages!")
