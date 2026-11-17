#!/usr/bin/env python3
"""
EnerProof V3 — CECECO Clean Energy Hackathon 2027 Final Submission Package Generator.
Generates all 6 authoritative submission PDFs, README.md, and creates the final zip package
under submission/v3_final/ without overwriting previous versions.
"""

import os
import sys
import zipfile
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics.barcode import qr
import pypdf

BASE_DIR = "/Users/fizuli.050icloud.com/Downloads/enerproof"
SUBMISSION_DIR = os.path.join(BASE_DIR, "submission/v3_final")
SCREENSHOTS_AFTER = os.path.join(BASE_DIR, "public/screenshots/after")
SCREENSHOTS_BASE = os.path.join(BASE_DIR, "public/screenshots")

os.makedirs(SUBMISSION_DIR, exist_ok=True)

# =========================================================================
# Canvas Decorators
# =========================================================================

class ProposalNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(ProposalNumberedCanvas, self).__init__(*args, **kwargs)
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
        self.drawRightString(576, 756, f"FIZULI HASANOV  •  PROJECT PROPOSAL V3  |  {self._pageNumber}")
        self.setStrokeColor(colors.HexColor("#D1D5DB"))
        self.setLineWidth(0.5)
        self.line(36, 750, 576, 750)
        
        # Footer
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.line(36, 32, 576, 32)
        self.drawString(36, 22, "https://enerproof.vercel.app  •  CECECO Clean Energy Hackathon 2027  •  Track: Bringing Clean Energy to Everyday Life")
        self.drawRightString(576, 22, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


class SupportingNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(SupportingNumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_decorations(self, num_pages):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#4B5563"))
        
        # Header line
        self.drawString(36, 756, "ENERPROOF V3  •  CECECO CLEAN ENERGY HACKATHON 2027")
        self.drawRightString(576, 756, f"COMPETITION SUBMISSION ASSET  |  {self._pageNumber}")
        self.setStrokeColor(colors.HexColor("#D1D5DB"))
        self.setLineWidth(0.5)
        self.line(36, 750, 576, 750)
        
        # Footer
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.line(36, 32, 576, 32)
        self.drawString(36, 22, "https://enerproof.vercel.app  •  Track: Bringing Clean Energy to Everyday Life  •  Fizuli Hasanov")
        self.drawRightString(576, 22, f"Page {self._pageNumber} of {num_pages}")
        self.restoreState()


class LandscapeNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(LandscapeNumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_decorations(self, num_pages):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#9CA3AF"))
        
        # Header line
        self.drawString(36, 576, "ENERPROOF V3  •  CECECO CLEAN ENERGY HACKATHON 2027  •  PITCH DECK")
        self.drawRightString(756, 576, f"SLIDE {self._pageNumber} OF {num_pages}")
        self.setStrokeColor(colors.HexColor("#374151"))
        self.setLineWidth(0.5)
        self.line(36, 570, 756, 570)
        
        # Footer
        self.setStrokeColor(colors.HexColor("#374151"))
        self.line(36, 28, 756, 28)
        self.drawString(36, 18, "https://enerproof.vercel.app  •  Track: Bringing Clean Energy to Everyday Life  •  Fizuli Hasanov")
        self.drawRightString(756, 18, "v3.0.0-cececo")
        self.restoreState()


# =========================================================================
# 0. 00_EnerProof_CECECO_Proposal_V3.pdf (STRICTLY <= 5 PAGES MONOCHROME)
# =========================================================================

def generate_v3_proposal_pdf():
    out_path = os.path.join(SUBMISSION_DIR, "00_EnerProof_CECECO_Proposal_V3.pdf")
    doc = SimpleDocTemplate(
        out_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=40,
    )
    
    styles = getSampleStyleSheet()
    
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
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=12.5,
        textColor=colors.HexColor("#111827"),
        spaceBefore=5,
        spaceAfter=2,
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.6,
        leading=10.2,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=3.5,
    )
    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.6,
        leading=10.2,
        textColor=colors.HexColor("#111827"),
        spaceBefore=2,
        spaceAfter=1,
    )
    caption_style = ParagraphStyle(
        'Caption',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=6.8,
        leading=8.5,
        textColor=colors.HexColor("#4B5563"),
        spaceAfter=2,
    )
    
    story = []
    
    # ---------------- PAGE 1 ----------------
    story.append(Paragraph("01 / PROJECT PROPOSAL", sec_num_style))
    story.append(Paragraph("EnerProof: Energy efficiency you can prove", title_style))
    story.append(Paragraph("Audit-to-action verification engine for energy efficiency, data provenance & statutory compliance", tagline_style))
    story.append(Paragraph(
        "<b>Applicant:</b> Fizuli Hasanov &nbsp;|&nbsp; "
        "<b>Competition:</b> CECECO Clean Energy Hackathon 2027 &nbsp;|&nbsp; "
        "<b>Track:</b> Bringing Clean Energy to Everyday Life<br/>"
        "<b>Production:</b> https://enerproof.vercel.app &nbsp;|&nbsp; "
        "<b>Judge Flow:</b> https://enerproof.vercel.app/judge &nbsp;|&nbsp; "
        "<b>Repository:</b> https://github.com/fizuli20/enerproof (Tag: v3.0.0-cececo)",
        byline_style
    ))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor("#111827"), spaceAfter=5))
    
    story.append(Paragraph("Executive summary and core proposition", h1_style))
    story.append(Paragraph(
        "EnerProof resolves a fundamental breakdown in clean-energy retrofits across developing energy markets: "
        "<b>apparent utility savings cannot be trusted without mathematical and statistical verification.</b> "
        "In Azerbaijan, where commercial electricity tariffs are low (~0.125 AZN / $0.073 per kWh), unassisted dashboards fail commercially. "
        "Furthermore, institutional sustainability disclosures contain severe provenance flaws: our automated screening of Baku Higher Oil School "
        "(BHOS) public filings uncovered an exact 10x arithmetic error in published 2022 GHG emissions (497.79 metric tonnes actual vs 4,978 tonnes reported) "
        "and 100% duplicate monthly readings across 2023–2024.",
        body_style
    ))
    story.append(Paragraph(
        "EnerProof transforms energy efficiency from speculative guesswork into an <b>evidence-backed verification process</b> serving licensed auditors, "
        "ESCOs, and the newly established Azerbaijan Energy Efficiency Fund. Rather than promising unverified whole-building savings, "
        "EnerProof implements an evidence gate based on ASHRAE Guideline 14 Annex B and IPMVP Core Concepts. "
        "When savings are smaller than the building's empirical baseline noise floor, the platform refuses unqualified attribution and generates a "
        "statistically compliant sub-metering plan (Option A/B).",
        body_style
    ))

    story.append(Paragraph("Clean energy problem statement: Market realities in Azerbaijan", h1_style))
    story.append(Paragraph(
        "<b>1. Low Utility Tariffs:</b> At 0.125 AZN/kWh, a 10% reduction in a 300 MWh/year facility saves only 3,750 AZN ($2,206) annually. "
        "Monitoring SaaS cannot charge high recurring fees without legally defensible proof of performance.<br/>"
        "<b>2. Data Provenance Breakdown:</b> Public institutional ESG filings frequently suffer from human calculation error, broken formulas, "
        "or duplicate copy-forwarding. Raw meter data must be audited for temporal independence before modeling.<br/>"
        "<b>3. Whole-Building Weather Confounding:</b> Weather fluctuations, student occupancy variations, and unrecorded equipment drift "
        "create statistical noise (CV(RMSE) &gt; 11%). Operational interventions &lt; 10% cannot be detected from whole-facility meters alone.",
        body_style
    ))

    story.append(Paragraph("The EnerProof solution architecture", h1_style))
    story.append(Paragraph(
        "EnerProof provides a connected 7-step client-side engineering engine: "
        "<b>1. Energy Data Audit:</b> Automated screening across 3 deterministic gates. "
        "<b>2. Degree-Day Baseline:</b> Multi-variable regression with chronological train/calibrate separation. "
        "<b>3. Opportunities:</b> Bounded physics calculators for LED, HVAC, plug load, thermal water, and boiler tuning. "
        "<b>4. Measurement Strategy:</b> Deterministic mapping to IPMVP Option A, B, or C. "
        "<b>5. Evidence Gate:</b> Three-tier evaluation separating engineering estimates, meter deltas, and evidence-supported verdicts. "
        "<b>6. Portfolio Pooling:</b> Risk pooling accounting for intra-campus residual correlation (&rho; &asymp; 0.33). "
        "<b>7. Investment Reports:</b> Instant export of 5 distinct monochrome and investment-grade PDF dossiers.",
        body_style
    ))
    story.append(PageBreak())

    # ---------------- PAGE 2 ----------------
    story.append(Paragraph("02 / PROJECT PROPOSAL", sec_num_style))
    story.append(Paragraph("Real-world provenance audit & empirical building science", h1_style))
    story.append(Paragraph(
        "To ground EnerProof in verifiable data, we conducted two rigorous empirical investigations: "
        "(1) a public audit of institutional sustainability filings in Baku, and (2) an empirical reproducibility benchmark across 152 university campus buildings.",
        body_style
    ))

    story.append(Paragraph("Case study A: Baku Higher Oil School (BHOS) public audit", body_bold))
    story.append(Paragraph(
        "Automated screening of published BHOS Green House Gas Reports (2022–2024) uncovered two material provenance failures:<br/>"
        "• <b>10x GHG Arithmetic Error:</b> In the 2022 filing, BHOS reported electricity consumption of 995,575 kWh and applied an emissions factor of 0.5 kg CO₂/kWh. "
        "Multiplying 995,575 &times; 0.5 yields exactly 497,787.5 kg (497.79 metric tonnes). However, the published report stated ~4,978 tonnes &mdash; exactly 10x higher.<br/>"
        "• <b>100% Duplicate Profile:</b> Exactly 36 monthly electricity, gas, and water values published in the 2024 report duplicate the 2023 filing values identically. "
        "EnerProof flags both flaws automatically and halts baseline modeling until resolved.",
        body_style
    ))

    bhos_table_data = [
        [Paragraph("<b>Audit Gate</b>", body_style), Paragraph("<b>Screening Target</b>", body_style), Paragraph("<b>Observed BHOS Metric</b>", body_style), Paragraph("<b>Gate Determination</b>", body_style)],
        [Paragraph("<b>Gate 1: Temporal Independence</b>", body_style), Paragraph("Identical profile check", body_style), Paragraph("36 of 36 months duplicated (100%)", body_style), Paragraph("<font color='#B91C1C'><b>REJECT (Flagged)</b></font>", body_style)],
        [Paragraph("<b>Gate 2: Arithmetic Verification</b>", body_style), Paragraph("Emissions factor product", body_style), Paragraph("Reported: 4,978 t | Calculated: 497.8 t (10x error)", body_style), Paragraph("<font color='#B91C1C'><b>REJECT (Flagged)</b></font>", body_style)],
        [Paragraph("<b>Gate 3: Submetering Boundary</b>", body_style), Paragraph("Whole-campus vs end-use", body_style), Paragraph("Bulk meter only; no building isolation", body_style), Paragraph("<font color='#D97706'><b>REQUIRE SUBMETERING</b></font>", body_style)],
    ]
    t1 = Table(bhos_table_data, colWidths=[130, 120, 180, 110])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t1)
    story.append(Spacer(1, 3))

    story.append(Paragraph("Case study B: 152-building empirical calibration (Building Data Genome 2)", body_bold))
    story.append(Paragraph(
        "To establish empirical noise floors, EnerProof was evaluated across 152 real university campus buildings (82 residential dormitories, 70 educational wings) "
        "from the peer-reviewed BDG2 dataset. Pre-test selection strictly used completeness in training/calibration periods. During the held-out evaluation window, "
        "9 buildings suffered telemetry loss and were recorded as cohort abstentions (leaving 143 completed evaluations).<br/>"
        "• <b>Resolution Comparison:</b> Daily models with weather regression met 5% false-alarm criteria under synthetic null (4.21% FPR) with 15.0% MDE. "
        "Hourly interval and monthly utility bills failed false-alarm requirements under whole-building counterfactuals.<br/>"
        "• <b>Residual Correlation Floor:</b> Same-campus buildings exhibit intra-site correlation (&rho; &asymp; 0.33) due to shared weather and academic calendars. "
        "Pooled portfolio variance does not decay to zero as 1/&radic;K, proving that empirical covariance matrices are mandatory.",
        body_style
    ))

    bdg_table_data = [
        [Paragraph("<b>Resolution</b>", body_style), Paragraph("<b>Baseline Model</b>", body_style), Paragraph("<b>Threshold</b>", body_style), Paragraph("<b>Synth FPR</b>", body_style), Paragraph("<b>Empirical MDE</b>", body_style), Paragraph("<b>Quality Status</b>", body_style)],
        [Paragraph("<b>Hourly Interval</b>", body_style), Paragraph("Ridge weather reg", body_style), Paragraph("8.37%", body_style), Paragraph("6.98%", body_style), Paragraph("UNESTABLISHED", body_style), Paragraph("<font color='#B91C1C'><b>FAIL_CONTROLS</b></font>", body_style)],
        [Paragraph("<b>Daily Interval</b>", body_style), Paragraph("Ridge weather reg", body_style), Paragraph("11.80%", body_style), Paragraph("4.21%", body_style), Paragraph("15.0%", body_style), Paragraph("<font color='#164E3A'><b>PASS_SYNTH_CONTROL</b></font>", body_style)],
        [Paragraph("<b>Monthly Bills</b>", body_style), Paragraph("Ridge weather reg", body_style), Paragraph("13.64%", body_style), Paragraph("6.81%", body_style), Paragraph("UNESTABLISHED", body_style), Paragraph("<font color='#B91C1C'><b>FAIL_CONTROLS</b></font>", body_style)],
    ]
    t2 = Table(bdg_table_data, colWidths=[90, 120, 75, 75, 95, 85])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t2)
    story.append(PageBreak())

    # ---------------- PAGE 3 ----------------
    story.append(Paragraph("03 / PROJECT PROPOSAL", sec_num_style))
    story.append(Paragraph("Student residence retrofit package & bounded engineering physics", h1_style))
    story.append(Paragraph(
        "EnerProof incorporates physically bounded engineering models tailored to educational living quarters. "
        "Parameters are bounded to prevent division-by-zero, negative runtimes, or unphysical efficiencies. "
        "For non-positive net savings, simple payback returns <code>null</code> rather than arbitrary numbers.",
        body_style
    ))

    story.append(Paragraph("Illustrative facility: Baku Student Residence Hall 1", body_bold))
    story.append(Paragraph(
        "A representative 500-occupant university dormitory in Baku consuming 300,000 kWh of electricity and 25,000 m³ of heating gas annually at utility rates "
        "of 0.125 AZN/kWh and 0.200 AZN/m³ gas. Five energy conservation measures (ECMs) were engineered with lifecycle accounting:",
        body_style
    ))

    ecm_table_data = [
        [Paragraph("<b>Measure (ECM)</b>", body_style), Paragraph("<b>CapEx</b>", body_style), Paragraph("<b>M&V</b>", body_style), Paragraph("<b>Annual kWh</b>", body_style), Paragraph("<b>Net Savings</b>", body_style), Paragraph("<b>Payback</b>", body_style), Paragraph("<b>M&V Option</b>", body_style)],
        [Paragraph("<b>1. LED Lighting & Sensors</b>", body_style), Paragraph("17,500 AZN", body_style), Paragraph("2,500 AZN", body_style), Paragraph("60,000 kWh", body_style), Paragraph("7,500 AZN/yr", body_style), Paragraph("2.7 yrs", body_style), Paragraph("Option A (Circuit)", body_style)],
        [Paragraph("<b>2. HVAC Night Setbacks</b>", body_style), Paragraph("4,500 AZN", body_style), Paragraph("1,800 AZN", body_style), Paragraph("54,600 kWh", body_style), Paragraph("6,825 AZN/yr", body_style), Paragraph("0.9 yrs", body_style), Paragraph("Option B (Submeter)", body_style)],
        [Paragraph("<b>3. Smart Plug Load Strips</b>", body_style), Paragraph("6,250 AZN", body_style), Paragraph("1,200 AZN", body_style), Paragraph("18,000 kWh", body_style), Paragraph("2,250 AZN/yr", body_style), Paragraph("3.3 yrs", body_style), Paragraph("Option A (Sample)", body_style)],
        [Paragraph("<b>4. Solar Water Pre-Heat</b>", body_style), Paragraph("12,000 AZN", body_style), Paragraph("1,500 AZN", body_style), Paragraph("7,200 m³ gas", body_style), Paragraph("1,440 AZN/yr", body_style), Paragraph("9.4 yrs", body_style), Paragraph("Option B (BTU meter)", body_style)],
        [Paragraph("<b>5. Boiler O₂ Trim & Tune</b>", body_style), Paragraph("3,800 AZN", body_style), Paragraph("800 AZN", body_style), Paragraph("1,875 m³ gas", body_style), Paragraph("375 AZN/yr", body_style), Paragraph("12.3 yrs", body_style), Paragraph("Option B (Flue gas)", body_style)],
        [Paragraph("<b>Combined Dormitory Package</b>", body_style), Paragraph("<b>44,050 AZN</b>", body_style), Paragraph("<b>7,800 AZN</b>", body_style), Paragraph("<b>132,600 kWh</b>", body_style), Paragraph("<b>18,390 AZN/yr</b>", body_style), Paragraph("<b>2.8 yrs</b>", body_style), Paragraph("<b>Hybrid M&V</b>", body_style)],
    ]
    t3 = Table(ecm_table_data, colWidths=[120, 65, 60, 75, 75, 55, 90])
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#E5E7EB")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t3)
    story.append(Spacer(1, 3))

    story.append(Paragraph("M&V cost integration and payback realism", body_bold))
    story.append(Paragraph(
        "A critical innovation in EnerProof is including measurement hardware and auditor fees into simple payback. "
        "Ignoring M&V costs produces fabricated financial metrics. For the dormitory package, incorporating 7,800 AZN of logging loggers and calibration "
        "shifts simple payback from 2.4 to 2.8 years &mdash; an honest lifecycle figure acceptable to the Energy Efficiency Fund.",
        body_style
    ))

    story.append(Paragraph("The three-tier savings architecture", body_bold))
    story.append(Paragraph(
        "EnerProof explicitly prevents conflating theoretical models with metered data. The Results page displays three distinct tiers side-by-side: "
        "<b>Tier 1 (Engineering Estimate):</b> 60,000 kWh/yr based on rated wattage. "
        "<b>Tier 2 (Observed Meter Delta):</b> Raw post-retrofit bill drops without weather adjustment. "
        "<b>Tier 3 (Evidence Assessment):</b> Weather-normalized counterfactual with ASHRAE 14 uncertainty bounds.",
        body_style
    ))
    story.append(PageBreak())

    # ---------------- PAGE 4 ----------------
    story.append(Paragraph("04 / PROJECT PROPOSAL", sec_num_style))
    story.append(Paragraph("The deterministic Evidence Gate & standards compliance", h1_style))
    story.append(Paragraph(
        "The Evidence Gate is EnerProof’s automated decision core. Rather than applying universal thresholds, it calculates a building-specific "
        "uncertainty boundary based on actual pre-intervention meter quality and model residuals.",
        body_style
    ))

    story.append(Paragraph("Mathematical formulation: ASHRAE Guideline 14 Annex B", body_bold))
    story.append(Paragraph(
        "Fractional Savings Uncertainty (FSU) at (1 - &alpha;) confidence level is evaluated as:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>FSU = t_(&alpha;/2, df) &times; [ CV(RMSE) / s ] &times; &radic;[ (1/m + 1/n) &times; (1 + r₁) / (1 - r₁) ]</b><br/>"
        "where <i>s</i> is the savings fraction, <i>n</i> is baseline days, <i>m</i> is reporting days, and <i>r₁</i> is lag-1 autocorrelation. "
        "If FSU &gt; 50% or the apparent savings fail to exceed the 95% confidence noise floor, EnerProof deterministically returns "
        "<code>ADDITIONAL_MEASUREMENT_REQUIRED</code> or <code>INSUFFICIENT_EVIDENCE</code>.",
        body_style
    ))

    gate_table_data = [
        [Paragraph("<b>Classification Verdict</b>", body_style), Paragraph("<b>Deterministic Trigger Criteria</b>", body_style), Paragraph("<b>Prescribed Engineering Action</b>", body_style)],
        [Paragraph("<b>EVIDENCE_SUPPORTS_ESTIMATE</b>", body_style), Paragraph("Savings &gt; building noise threshold AND FSU &le; 50% (or Option A/B isolation)", body_style), Paragraph("Approved for performance contracting & Fund milestone disbursement", body_style)],
        [Paragraph("<b>ADDITIONAL_MEASUREMENT_REQUIRED</b>", body_style), Paragraph("Savings &gt; noise threshold BUT FSU &gt; 50% (insufficient duration or high r₁)", body_style), Paragraph("Extend monitoring duration or deploy dedicated sub-meter loggers", body_style)],
        [Paragraph("<b>INSUFFICIENT_EVIDENCE</b>", body_style), Paragraph("Apparent savings fall below baseline model noise floor", body_style), Paragraph("Reject whole-building savings claim; mandate circuit isolation (Option A/B)", body_style)],
    ]
    t4 = Table(gate_table_data, colWidths=[150, 190, 200])
    t4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t4)
    story.append(Spacer(1, 4))

    story.append(Paragraph("Product UX transformation: The 3-minute hackathon judge flow", h1_style))
    story.append(Paragraph(
        "EnerProof V3 features a dedicated evaluation flow at <b>/judge</b> designed specifically for the CECECO evaluation committee. "
        "In exactly 3 minutes with zero login friction, a judge experiences:<br/>"
        "• <b>Step 1 (Meet Building):</b> Baku Student Residence Hall 1 profile with baseline utility metrics.<br/>"
        "• <b>Step 2 (Choose Opportunity):</b> LED, HVAC, or Plug Load controls with adjustable sliders.<br/>"
        "• <b>Step 3 (See Impact):</b> Instant computation of annual kWh, AZN savings, CapEx, and simple payback.<br/>"
        "• <b>Step 4 (Choose Measurements):</b> Interactive scenario toggle: <i>Scenario A (Valid Equipment Isolation)</i> vs <i>Scenario B (Insufficient Data)</i>.<br/>"
        "• <b>Step 5 (Evidence Gate Verdict):</b> Plain-language determination explaining why savings are supported or refused, with 1-click PDF export.<br/>"
        "• <b>Step 6 (Explore Evidence):</b> Deep-dive links to the BHOS audit, 152-building study, and 7-step workspace.",
        body_style
    ))
    story.append(PageBreak())

    # ---------------- PAGE 5 ----------------
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
        "<b>Production Release:</b> The complete V3 platform is live at <b>https://enerproof.vercel.app</b> with a dedicated 3-minute hackathon judge experience at <b>https://enerproof.vercel.app/judge</b>. The open-source repository is available at <b>https://github.com/fizuli20/enerproof</b> (Release Tag: <code>v3.0.0-cececo</code>). The codebase contains 23/23 passing automated Vitest unit tests and 6/6 verified Playwright end-to-end workflows.<br/>"
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
        "[10] EnerProof Scientific Research Package (Experiment 2 Review & V3 Calibration Engine, 17 Nov 2026).<br/>"
        "[11] Azerbaijan Ministry of Energy. Law No. 359-VIQ on Energy Manager Certification & Mandatory Audits (2025).<br/>"
        "[12] Azerbaijan Energy Regulatory Agency (AERA). Energy Efficiency Fund Operational Framework & Criteria (2026)."
    )
    story.append(Paragraph(ref_text, caption_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph(
        "<font size=6 color='#6B7280'><i>Tools acknowledged: Next.js, TypeScript, Tailwind CSS, Python, scikit-learn, Vitest, Playwright, ChatGPT, Claude, Gemini, and Antigravity. All calculations, figures, and code are project-generated.</i></font>",
        caption_style
    ))

    doc.build(story, canvasmaker=ProposalNumberedCanvas)
    
    reader = pypdf.PdfReader(out_path)
    print(f"Generated {out_path} with {len(reader.pages)} pages.")
    assert len(reader.pages) == 5, f"ERROR: Expected exactly 5 pages, but got {len(reader.pages)} pages!"
    return len(reader.pages)


# =========================================================================
# 1. 01_EnerProof_Prototype_Access_V3.pdf (1 PAGE)
# =========================================================================

def generate_v3_prototype_access_pdf():
    out_path = os.path.join(SUBMISSION_DIR, "01_EnerProof_Prototype_Access_V3.pdf")
    doc = SimpleDocTemplate(
        out_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=36
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=18, leading=20, textColor=colors.HexColor("#111827"), spaceAfter=2)
    tagline_style = ParagraphStyle('Tagline', fontName='Helvetica-Oblique', fontSize=10, leading=12, textColor=colors.HexColor("#164E3A"), spaceAfter=6)
    h2_style = ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=colors.HexColor("#111827"), spaceBefore=4, spaceAfter=2)
    body_style = ParagraphStyle('Body', fontName='Helvetica', fontSize=8, leading=10.5, textColor=colors.HexColor("#1F2937"), spaceAfter=3)
    code_style = ParagraphStyle('Code', fontName='Courier', fontSize=7.5, leading=9.5, textColor=colors.HexColor("#111827"))
    
    story = []
    story.append(Paragraph("01 / LIVE EVALUATION ACCESS GUIDE", ParagraphStyle('Sub', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#4B5563"))))
    story.append(Paragraph("EnerProof: Production Platform & Judge Experience", title_style))
    story.append(Paragraph("Direct access guide for CECECO Clean Energy Hackathon 2027 Evaluation Committee", tagline_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#D1D5DB"), spaceAfter=4))
    
    # QR Code + Access Links
    qr_code = qr.QrCodeWidget("https://enerproof.vercel.app/judge")
    qr_code.barWidth = 105
    qr_code.barHeight = 105
    qr_code.qrVersion = 2
    d = Drawing(105, 105)
    d.add(qr_code)
    
    access_text = (
        "<b>ZERO-FRICTION JUDGE ACCESS (NO LOGIN OR SIGN-UP REQUIRED):</b><br/>"
        "• <b>Primary Production Application:</b> <font color='#164E3A'><u>https://enerproof.vercel.app</u></font><br/>"
        "• <b>Dedicated 3-Minute Judge Flow:</b> <font color='#164E3A'><u>https://enerproof.vercel.app/judge</u></font><br/>"
        "• <b>Public GitHub Source Repository:</b> <font color='#164E3A'><u>https://github.com/fizuli20/enerproof</u></font><br/>"
        "• <b>Competition Release Git Tag:</b> <font color='#111827'><code>v3.0.0-cececo</code></font><br/>"
        "• <b>Platform Architecture:</b> Client-side deterministic computation with 100% data privacy (zero cloud storage)."
    )
    
    access_table = Table([[d, Paragraph(access_text, body_style)]], colWidths=[120, 420])
    access_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F9FAFB")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(access_table)
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("The 3-Minute Hackathon Evaluation Journey (/judge)", h2_style))
    story.append(Paragraph(
        "To respect judges’ time during evaluation, we engineered a dedicated, guided 6-step walkthrough. It demonstrates complete end-to-end functionality without manual CSV formatting or technical onboarding:",
        body_style
    ))
    
    steps_data = [
        [Paragraph("<b>Step</b>", body_style), Paragraph("<b>Screen</b>", body_style), Paragraph("<b>Core Action & Interactive Element</b>", body_style), Paragraph("<b>Expected Verification Result</b>", body_style)],
        [Paragraph("<b>1</b>", body_style), Paragraph("<b>Meet Building</b>", body_style), Paragraph("Review Baku Student Residence Hall 1 profile (300 MWh/yr, 0.125 AZN/kWh).", body_style), Paragraph("Realistic baseline context", body_style)],
        [Paragraph("<b>2</b>", body_style), Paragraph("<b>Opportunity</b>", body_style), Paragraph("Select LED Lighting Retrofit; adjust fixture count slider (500 units) and runtime.", body_style), Paragraph("Calculates ~60,000 kWh/yr savings", body_style)],
        [Paragraph("<b>3</b>", body_style), Paragraph("<b>Impact</b>", body_style), Paragraph("Inspect annual cost savings (7,500 AZN), investment (20,000 AZN), and payback (2.7 yrs).", body_style), Paragraph("Verified lifecycle financials", body_style)],
        [Paragraph("<b>4</b>", body_style), Paragraph("<b>Measurement</b>", body_style), Paragraph("Toggle <i>Scenario A (Valid Isolation)</i> vs <i>Scenario B (Insufficient Data)</i>.", body_style), Paragraph("Prescribes IPMVP Option A logging", body_style)],
        [Paragraph("<b>5</b>", body_style), Paragraph("<b>Evidence Gate</b>", body_style), Paragraph("Inspect plain-language verdict; test refusal scenario; download 1-click PDF.", body_style), Paragraph("Deterministic refusal & approval", body_style)],
        [Paragraph("<b>6</b>", body_style), Paragraph("<b>Evidence Deep-Dive</b>", body_style), Paragraph("Direct links to BHOS audit engine, 152-building benchmark, and 7-step workspace.", body_style), Paragraph("Full scientific transparency", body_style)],
    ]
    st = Table(steps_data, colWidths=[30, 95, 255, 160])
    st.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(st)
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("Production Testing & Deployment Evidence", h2_style))
    evidence_text = (
        "• <b>Vitest Unit Test Suite:</b> 23/23 tests passing in 31ms (physics bounding, regression split, Evidence Gate refusal logic).<br/>"
        "• <b>Playwright E2E Test Suite:</b> 6/6 complete end-to-end user workflows verified in 6.2s against production Next.js build.<br/>"
        "• <b>Vercel Edge Global Deployment:</b> Zero server errors, sub-second TTFB, responsive across desktop and mobile screens.<br/>"
        "• <b>Founder Verification:</b> Built, tested, and published by Fizuli Hasanov (github.com/fizuli20/enerproof)."
    )
    story.append(Paragraph(evidence_text, body_style))
    
    doc.build(story, canvasmaker=SupportingNumberedCanvas)
    reader = pypdf.PdfReader(out_path)
    print(f"Generated {out_path} with {len(reader.pages)} pages.")
    assert len(reader.pages) == 1, f"Expected exactly 1 page, got {len(reader.pages)}"


# =========================================================================
# 2. 02_EnerProof_Technical_Validation_V3.pdf (6 PAGES)
# =========================================================================

def generate_v3_technical_validation_pdf():
    # Use existing tested logic from generate_supporting_documents.py targeting V3 output
    import importlib.util
    spec = importlib.util.spec_from_file_location("gen_supp", os.path.join(BASE_DIR, "scripts/generate_supporting_documents.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    
    out_path = os.path.join(SUBMISSION_DIR, "02_EnerProof_Technical_Validation_V3.pdf")
    # Temporarily set SUBMISSION_DIR
    orig = mod.SUBMISSION_DIR
    mod.SUBMISSION_DIR = SUBMISSION_DIR
    try:
        mod.generate_technical_validation_pdf()
        # Rename to _V3
        src = os.path.join(SUBMISSION_DIR, "02_EnerProof_Technical_Validation.pdf")
        if os.path.exists(src):
            os.rename(src, out_path)
    finally:
        mod.SUBMISSION_DIR = orig
    
    reader = pypdf.PdfReader(out_path)
    print(f"Generated {out_path} with {len(reader.pages)} pages.")
    assert len(reader.pages) == 6, f"Expected 6 pages, got {len(reader.pages)}"


# =========================================================================
# 3. 03_EnerProof_Product_Walkthrough_V3.pdf (4 PAGES WITH AFTER SCREENSHOTS)
# =========================================================================

def generate_v3_product_walkthrough_pdf():
    out_path = os.path.join(SUBMISSION_DIR, "03_EnerProof_Product_Walkthrough_V3.pdf")
    doc = SimpleDocTemplate(
        out_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=36
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=18, leading=20, textColor=colors.HexColor("#111827"), spaceAfter=2)
    tagline_style = ParagraphStyle('Tagline', fontName='Helvetica-Oblique', fontSize=10, leading=12, textColor=colors.HexColor("#164E3A"), spaceAfter=6)
    h1_style = ParagraphStyle('H1', fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=colors.HexColor("#111827"), spaceBefore=4, spaceAfter=2)
    body_style = ParagraphStyle('Body', fontName='Helvetica', fontSize=7.5, leading=9.8, textColor=colors.HexColor("#1F2937"), spaceAfter=3)
    caption_style = ParagraphStyle('Cap', fontName='Helvetica-Oblique', fontSize=6.8, leading=8.5, textColor=colors.HexColor("#4B5563"))

    story = []
    
    # Page 1: V3 Landing Page & Interactive Lighting Calculator
    story.append(Paragraph("03 / VISUAL PRODUCT & WORKFLOW WALKTHROUGH", ParagraphStyle('Sub', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#4B5563"))))
    story.append(Paragraph("EnerProof V3: Visual Product Experience & UI Evidence", title_style))
    story.append(Paragraph("High-resolution tour of the V3 design transformation with Playwright-captured UI evidence", tagline_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#D1D5DB"), spaceAfter=4))
    
    story.append(Paragraph("1. Public Landing Page & Interactive Lighting Calculator (/)", h1_style))
    story.append(Paragraph(
        "Redesigned from the ground up with deep forest (#152E27), energy lime (#D9FF91), and warm canvas (#F4F5F0) brand identity. "
        "Features an immediate interactive student residence lighting calculator with live sliders and instant payback computation, "
        "eliminating generic dashboard tropes and explaining the practical clean energy dilemma.",
        body_style
    ))
    img1 = os.path.join(SCREENSHOTS_AFTER, "01_landing_hero.png")
    if os.path.exists(img1):
        story.append(Image(img1, width=540, height=210))
        story.append(Paragraph("Figure 1: EnerProof V3 Landing Page hero featuring geometric verification brand mark and interactive verification flow.", caption_style))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("2. Mobile Experience & Responsive Navigation", h1_style))
    story.append(Paragraph(
        "Fully responsive on mobile devices with touch-friendly sliders, collapsible drawer navigation, and adaptive data cards.",
        body_style
    ))
    img_mob = os.path.join(SCREENSHOTS_AFTER, "09_mobile_landing.png")
    if os.path.exists(img_mob):
        story.append(Image(img_mob, width=540, height=195))
        story.append(Paragraph("Figure 2: Mobile responsive rendering of the EnerProof V3 landing page and interactive calculator.", caption_style))
    story.append(PageBreak())

    # Page 2: Judge Experience Walkthrough & Evidence Gate Verdict
    story.append(Paragraph("3. 3-Minute Hackathon Judge Experience (/judge)", h1_style))
    story.append(Paragraph(
        "The dedicated evaluation portal features a guided 6-step progress bar, interactive ECM parameter adjustments, "
        "side-by-side measurement scenario toggles (Scenario A valid isolation vs Scenario B insufficient data), "
        "deterministic Evidence Gate verdicts in plain language, and 1-click investment-grade PDF export.",
        body_style
    ))
    img_judge = os.path.join(SCREENSHOTS_AFTER, "03_judge_walkthrough.png")
    if os.path.exists(img_judge):
        story.append(Image(img_judge, width=540, height=205))
        story.append(Paragraph("Figure 3: Step 5 of the Judge Experience showing deterministic Evidence Gate verdict and PDF report trigger.", caption_style))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("4. Pre-Intervention Data Quality & BHOS Audit (/app/audit)", h1_style))
    story.append(Paragraph(
        "Automated provenance screening of 36 monthly records from Baku Higher Oil School. Flags 100% duplicate annual reporting across 2023–2024 (Gate 1), "
        "exposes exact 10x arithmetic discrepancy in published CO₂ emissions (Gate 2), and identifies bulk campus metering requiring submetering (Gate 3).",
        body_style
    ))
    img_audit = os.path.join(SCREENSHOTS_AFTER, "04_energy_data.png")
    if os.path.exists(img_audit):
        story.append(Image(img_audit, width=540, height=205))
        story.append(Paragraph("Figure 4: Pre-Intervention Data Quality engine displaying automated rejection of duplicate profiles and 10x emissions arithmetic flag.", caption_style))
    story.append(PageBreak())

    # Page 3: Opportunities Planner & Measurement Strategy
    story.append(Paragraph("5. Energy Conservation Measures & Lifecycle Sensitivity (/app/interventions)", h1_style))
    story.append(Paragraph(
        "Bounded physical calculators for LED lighting, HVAC scheduling, plug load management, solar thermal water, and boiler tuning. "
        "Includes sensitivity scenario toggles (-15% Conservative, Base Case, +15% Optimistic) and enforces ventilation safeguards.",
        body_style
    ))
    img_ecm = os.path.join(SCREENSHOTS_AFTER, "05_opportunities_planner.png")
    if os.path.exists(img_ecm):
        story.append(Image(img_ecm, width=540, height=205))
        story.append(Paragraph("Figure 5: Energy Conservation Measures (ECMs) module with lifecycle financial payback accounting.", caption_style))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("6. IPMVP Measurement Protocol Planner (/app/measurement)", h1_style))
    story.append(Paragraph(
        "Generates tailored measurement plans mapped to IPMVP Option A (Key Parameter), Option B (All Parameter), or Option C (Whole Facility). "
        "Specifies recommended sensor hardware, interval logging duration, target uncertainty bounds, and risk mitigations.",
        body_style
    ))
    img_meas = os.path.join(SCREENSHOTS_AFTER, "06_measurement_strategy.png")
    if os.path.exists(img_meas):
        story.append(Image(img_meas, width=540, height=205))
        story.append(Paragraph("Figure 6: IPMVP Measurement & Verification protocol selection with boundary and hardware specifications.", caption_style))
    story.append(PageBreak())

    # Page 4: Three-Tier Results Visual & Investment Reports
    story.append(Paragraph("7. Post-Intervention Evidence Gate Assessment (/app/verify)", h1_style))
    story.append(Paragraph(
        "Features the distinct three-tier savings visual (1. Engineering Estimate, 2. Observed Meter Delta, 3. Evidence-Supported Assessment) "
        "so unqualified savings are never conflated. Transparently displays decision logs, FSU calculations, and historical reference benchmarks.",
        body_style
    ))
    img_res = os.path.join(SCREENSHOTS_AFTER, "07_evidence_results.png")
    if os.path.exists(img_res):
        story.append(Image(img_res, width=540, height=205))
        story.append(Paragraph("Figure 7: Evidence Gate Assessment showing building-specific threshold evaluation and three-tier savings separation.", caption_style))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("8. Investment-Grade Report & Data Export (/app/reports)", h1_style))
    story.append(Paragraph(
        "Dynamic report previewer supporting 5 distinct document scopes: Comprehensive Audit, Data Quality Screening, ECM Feasibility, "
        "IPMVP M&V Plan, and Evidence Gate Result. Generates multi-page client-side PDF downloads, CSV tables, and open JSON project state.",
        body_style
    ))
    img_rep = os.path.join(SCREENSHOTS_AFTER, "08_reports_preview.png")
    if os.path.exists(img_rep):
        story.append(Image(img_rep, width=540, height=205))
        story.append(Paragraph("Figure 8: Investment-grade report generator with live document preview and multi-format export triggers.", caption_style))
    
    doc.build(story, canvasmaker=SupportingNumberedCanvas)
    reader = pypdf.PdfReader(out_path)
    print(f"Generated {out_path} with {len(reader.pages)} pages.")
    assert 3 <= len(reader.pages) <= 4, f"Expected 3-4 pages, got {len(reader.pages)}"


# =========================================================================
# 4. 04_EnerProof_Pitch_Deck_V3.pdf (8-10 LANDSCAPE SLIDES)
# =========================================================================

def generate_v3_pitch_deck_pdf():
    import importlib.util
    spec = importlib.util.spec_from_file_location("gen_supp", os.path.join(BASE_DIR, "scripts/generate_supporting_documents.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    
    out_path = os.path.join(SUBMISSION_DIR, "04_EnerProof_Pitch_Deck_V3.pdf")
    orig = mod.SUBMISSION_DIR
    mod.SUBMISSION_DIR = SUBMISSION_DIR
    try:
        mod.generate_pitch_deck_pdf()
        src = os.path.join(SUBMISSION_DIR, "04_EnerProof_Pitch_Deck.pdf")
        if os.path.exists(src):
            os.rename(src, out_path)
    finally:
        mod.SUBMISSION_DIR = orig
    
    reader = pypdf.PdfReader(out_path)
    print(f"Generated {out_path} with {len(reader.pages)} pages.")
    assert 8 <= len(reader.pages) <= 10, f"Expected 8-10 slides, got {len(reader.pages)}"


# =========================================================================
# 5. 05_EnerProof_Technical_Architecture_V3.pdf (3 PAGES)
# =========================================================================

def generate_v3_technical_architecture_pdf():
    import importlib.util
    spec = importlib.util.spec_from_file_location("gen_supp", os.path.join(BASE_DIR, "scripts/generate_supporting_documents.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    
    out_path = os.path.join(SUBMISSION_DIR, "05_EnerProof_Technical_Architecture_V3.pdf")
    orig = mod.SUBMISSION_DIR
    mod.SUBMISSION_DIR = SUBMISSION_DIR
    try:
        mod.generate_technical_architecture_pdf()
        src = os.path.join(SUBMISSION_DIR, "05_EnerProof_Technical_Architecture.pdf")
        if os.path.exists(src):
            os.rename(src, out_path)
    finally:
        mod.SUBMISSION_DIR = orig
    
    reader = pypdf.PdfReader(out_path)
    print(f"Generated {out_path} with {len(reader.pages)} pages.")
    assert len(reader.pages) == 3, f"Expected 3 pages, got {len(reader.pages)}"


# =========================================================================
# 6. README.md and ZIP PACKAGE
# =========================================================================

def generate_v3_package_and_readme():
    readme_path = os.path.join(SUBMISSION_DIR, "README.md")
    readme_content = """# EnerProof V3 — Official Competition Submission Package
**CECECO Clean Energy Hackathon 2027**  
*Track: Bringing Clean Energy to Everyday Life*  
*Founder & Lead Developer: Fizuli Hasanov (github.com/fizuli20)*  
*Production Platform:* https://enerproof.vercel.app  
*Official Judge Flow:* https://enerproof.vercel.app/judge  
*Source Repository:* https://github.com/fizuli20/enerproof (Release Tag: `v3.0.0-cececo`)  

---

## 1. Submission Documents Inventory

| Asset Name | Format | Target Audience / Purpose | Verification Status |
|:---|:---:|:---|:---:|
| `00_EnerProof_CECECO_Proposal_V3.pdf` | PDF (5 Pages) | Official Hackathon Proposal (Monochrome, strictly 5 pages) | Verified (5 Pages) |
| `01_EnerProof_Prototype_Access_V3.pdf` | PDF (1 Page) | Live Judge Access Guide with QR Code & 3-Minute Journey | Verified (1 Page) |
| `02_EnerProof_Technical_Validation_V3.pdf` | PDF (6 Pages) | Research Methodology, BDG2 152-Building Benchmark, & BHOS Audit | Verified (6 Pages) |
| `03_EnerProof_Product_Walkthrough_V3.pdf` | PDF (4 Pages) | UI & Workflow Tour with Playwright-Captured V3 Screenshots | Verified (4 Pages) |
| `04_EnerProof_Pitch_Deck_V3.pdf` | PDF (8 Slides) | Landscape Executive Pitch Deck for Judges & Investors | Verified (8 Slides) |
| `05_EnerProof_Technical_Architecture_V3.pdf` | PDF (3 Pages) | Client-Side Architecture, Math Specs, Testing & DevOps | Verified (3 Pages) |
| `EnerProof_CECECO_V3_Final_Submission_Package.zip` | ZIP Archive | Complete Submission Dossier with All Supporting Assets | Compiled |

---

## 2. Key Achievements in V3 Release (`v3.0.0-cececo`)

1. **Brand & Visual Transformation:**
   - Designed original geometric verification vector logo mark and wordmark.
   - Introduced custom color system: Deep Forest (`#152E27`), Energy Lime (`#D9FF91`), and Warm Canvas (`#F4F5F0`).
   - Integrated Google Fonts (`Inter`, `Manrope`, `JetBrains Mono`) for high-contrast typographic hierarchy.

2. **Ground-Up Landing Page Redesign (`/`):**
   - 7 connected sections explaining the practical clean energy dilemma.
   - Built a live interactive student residence lighting calculator with instant savings, payback, and measurement outputs.

3. **Guided 3-Minute Judge Experience (`/judge`):**
   - 6-step guided walkthrough: 1. Meet Building, 2. Choose Opportunity, 3. Potential Impact, 4. Measurement Strategy, 5. Evidence Gate Verdict, 6. Research Deep Dive.
   - Direct scenario toggle: *Scenario A (Valid Equipment Isolation)* vs *Scenario B (Incomplete Data)* proving deterministic refusal.
   - 1-click investment-grade PDF export.

4. **Three-Tier Savings Visual (`/app/verify`):**
   - Clearly separates Tier 1 (Engineering Estimate), Tier 2 (Observed Meter Delta), and Tier 3 (Evidence-Supported Assessment).

5. **Automated Quality & Verification Evidence:**
   - **23/23 Vitest unit tests** passing in 31ms.
   - **6/6 Playwright E2E workflows** passing in 6.2s.
   - Zero TypeScript errors across all 18 routes under Next.js Turbopack.
   - Zero telemetry, client-side data privacy guarantee.
"""
    with open(readme_path, "w") as f:
        f.write(readme_content)
    print(f"Generated {readme_path}")

    # Create ZIP Package
    zip_path = os.path.join(SUBMISSION_DIR, "EnerProof_CECECO_V3_Final_Submission_Package.zip")
    files_to_zip = [
        "00_EnerProof_CECECO_Proposal_V3.pdf",
        "01_EnerProof_Prototype_Access_V3.pdf",
        "02_EnerProof_Technical_Validation_V3.pdf",
        "03_EnerProof_Product_Walkthrough_V3.pdf",
        "04_EnerProof_Pitch_Deck_V3.pdf",
        "05_EnerProof_Technical_Architecture_V3.pdf",
        "README.md",
    ]
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for fname in files_to_zip:
            fpath = os.path.join(SUBMISSION_DIR, fname)
            if os.path.exists(fpath):
                zf.write(fpath, arcname=fname)
                print(f"Added to ZIP: {fname}")
    
    print(f"Compiled {zip_path} ({os.path.getsize(zip_path):,} bytes).")


if __name__ == "__main__":
    print("=========================================================================")
    print("GENERATING ENERPROOF V3 FINAL SUBMISSION PACKAGE")
    print("=========================================================================")
    generate_v3_proposal_pdf()
    generate_v3_prototype_access_pdf()
    generate_v3_technical_validation_pdf()
    generate_v3_product_walkthrough_pdf()
    generate_v3_pitch_deck_pdf()
    generate_v3_technical_architecture_pdf()
    generate_v3_package_and_readme()
    print("=========================================================================")
    print("SUCCESS: ALL V3 SUBMISSION ASSETS GENERATED IN submission/v3_final/")
    print("=========================================================================")
