import { test, expect } from "@playwright/test";

test.describe("EnerProof V2 Production E2E Workflows", () => {
  test("Workflow A: Judge 3-Minute Interactive Flow", async ({ page }) => {
    await page.goto("/judge");
    await expect(page).toHaveTitle(/EnerProof/i);

    // Check header & 3-minute badge
    await expect(page.locator("h1")).toContainText("Explore EnerProof in 3 Minutes");

    // Demo B (Main Demo is active by default)
    await expect(page.locator("text=EVIDENCE_SUPPORTS_ESTIMATE").first()).toBeVisible();

    // Toggle Negative Refusal Scenario in Demo B
    await page.click("button:has-text('Scenario: Valid Equipment Isolation')");
    await page.waitForTimeout(400);
    await expect(page.locator("text=ADDITIONAL_MEASUREMENT_REQUIRED").first()).toBeVisible();

    // Toggle back
    await page.click("button:has-text('Scenario: Insufficient Data')");
    await page.waitForTimeout(400);
    await expect(page.locator("text=EVIDENCE_SUPPORTS_ESTIMATE").first()).toBeVisible();

    // Switch to Demo A (BHOS Public Data Audit)
    await page.click("button:has-text('Demo A: Real Azerbaijani Energy Data Audit')");
    await page.waitForTimeout(400);
    await expect(page.getByText(/10x Arithmetic Error/i).first()).toBeVisible();
    await expect(page.getByText(/100% Identical Duplicate/i).first()).toBeVisible();

    // Switch to Demo C (Scientific Research)
    await page.click("button:has-text('Demo C: Scientific Research & Portfolio Noise Floor')");
    await page.waitForTimeout(400);
    await expect(page.getByText(/Building Data Genome 2/i).first()).toBeVisible();

    // Switch back to Demo B for screenshot
    await page.click("button:has-text('Demo B: Practical Clean Energy Retrofit')");
    await page.waitForTimeout(500);

    await page.screenshot({
      path: "public/screenshots/01_judge_experience.png",
      fullPage: true,
    });
  });

  test("Workflow B: Pre-Intervention Data Quality & BHOS Audit", async ({ page }) => {
    await page.goto("/app/audit");
    await expect(page.locator("h1").first()).toContainText("Pre-Intervention Data Quality");

    // Wait for async CSV load and table render
    await page.waitForSelector("table tbody tr");

    // Check Audit Gates
    await expect(page.locator("text=Temporal Independence & Duplication")).toBeVisible();
    await expect(page.locator("text=Emissions Factor Arithmetic")).toBeVisible();
    await expect(page.getByText(/10x Error Flag/i).first()).toBeVisible();

    // Check data table
    await expect(page.locator("table")).toBeVisible();

    await page.screenshot({
      path: "public/screenshots/02_audit_module.png",
      fullPage: true,
    });
  });

  test("Workflow C: Degree-Day Baseline Regression", async ({ page }) => {
    await page.goto("/app/baseline");
    await expect(page.locator("h1")).toContainText("Baseline Regression");

    // Check Chronological Split
    await expect(page.locator("text=Chronological Split Architecture")).toBeVisible();
    await expect(page.locator("text=In-Sample Training")).toBeVisible();
    await expect(page.locator("text=2. Independent Calibration")).toBeVisible();

    // Check regression equation & metrics
    await expect(page.locator("text=Trained Degree-Day Baseline Equation")).toBeVisible();
    await expect(page.locator("text=E_pred (kWh)")).toBeVisible();

    await page.screenshot({
      path: "public/screenshots/03_baseline_module.png",
      fullPage: true,
    });
  });

  test("Workflow D: Energy Conservation Measures (ECMs) & Sensitivity", async ({ page }) => {
    await page.goto("/app/interventions");
    await expect(page.locator("h1")).toContainText("Energy Conservation Measures");

    // Check Tariff settings
    await expect(page.locator("text=Utility Tariffs & Sensitivity Scenario")).toBeVisible();

    // Toggle scenario
    await page.click("button:has-text('Conservative (-15%)')");
    await page.waitForTimeout(300);
    await page.click("button:has-text('Optimistic (+15%)')");
    await page.waitForTimeout(300);
    await page.click("button:has-text('Base Case')");
    await page.waitForTimeout(300);

    // Check ECM cards
    await expect(page.locator("text=LED Lighting Retrofit & Sensors")).toBeVisible();
    await expect(page.locator("text=HVAC Scheduling & Night Setbacks")).toBeVisible();

    await page.screenshot({
      path: "public/screenshots/04_interventions_module.png",
      fullPage: true,
    });
  });

  test("Workflow E: Post-Intervention Evidence Gate Assessment", async ({ page }) => {
    // First visit baseline to initialize baseline model in localStorage
    await page.goto("/app/baseline");
    await page.waitForTimeout(500);

    // Now visit verify
    await page.goto("/app/verify");
    await expect(page.locator("h1")).toContainText("Post-Intervention Evidence Gate Assessment");

    // Check Historical Benchmark Box (labeled as exploratory reference)
    await expect(page.locator("text=Historical Research Benchmark Reference")).toBeVisible();

    // Check Decision Rationale Log
    await expect(page.locator("text=Evidence Gate Evaluation Log & Decision Path")).toBeVisible();

    await page.screenshot({
      path: "public/screenshots/05_verify_module.png",
      fullPage: true,
    });
  });

  test("Workflow F: Portfolio Aggregation & Investment-Grade Reports", async ({ page }) => {
    // 1. Portfolio Page
    await page.goto("/app/portfolio");
    await expect(page.locator("h1")).toContainText("Multi-Building Portfolio Aggregation");

    // Tab 1: User Portfolio Calculator
    await expect(page.locator("text=User Portfolio Calculator")).toBeVisible();
    await expect(page.getByText("Portfolio Statistical Uncertainty", { exact: true })).toBeVisible();

    // Switch to Tab 2: Research Benchmark Explorer
    await page.click("button:has-text('Research Benchmark Explorer')");
    await expect(page.locator("text=Archived Empirical Benchmark")).toBeVisible();
    await expect(page.locator("text=Cross-Building Residual Correlation Floor")).toBeVisible();

    // 2. Reports Page
    await page.goto("/app/reports");
    await expect(page.locator("h1").first()).toContainText("Investment-Grade Report & Data Export");

    // Check 5 distinct report buttons
    await expect(page.locator("button:has-text('Comprehensive Audit')")).toBeVisible();
    await expect(page.locator("button:has-text('Data Quality Screening')")).toBeVisible();
    await expect(page.locator("button:has-text('ECM Feasibility')")).toBeVisible();
    await expect(page.locator("button:has-text('IPMVP M&V Plan')")).toBeVisible();
    await expect(page.locator("button:has-text('Evidence Gate Result')")).toBeVisible();

    await page.screenshot({
      path: "public/screenshots/06_reports_module.png",
      fullPage: true,
    });
  });
});
