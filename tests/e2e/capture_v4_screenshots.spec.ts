import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test.describe("EnerProof V4 High-Resolution Screenshot Capture", () => {
  test.beforeAll(() => {
    const dirs = [
      path.join(process.cwd(), "public/screenshots/after_v4"),
      path.join(process.cwd(), "public/screenshots/after"),
    ];
    for (const d of dirs) {
      if (!fs.existsSync(d)) {
        fs.mkdirSync(d, { recursive: true });
      }
    }
  });

  test("Capture Desktop V4 Screenshots", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Landing Page
    await page.goto("/");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/01_landing_editorial_hero.png",
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
    await page.screenshot({
      path: "public/screenshots/after_v4/02_landing_full.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "public/screenshots/after/01_landing_hero.png",
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
    await page.screenshot({
      path: "public/screenshots/after/02_landing_full.png",
      fullPage: true,
    });

    // 2. Judge Walkthrough
    await page.goto("/judge");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/03_judge_walkthrough.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "public/screenshots/after/03_judge_walkthrough.png",
      fullPage: true,
    });

    // 3. Application Dashboard & Cutaway
    await page.goto("/app");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/04_facility_cutaway_workspace.png",
      fullPage: true,
    });

    // 4. Pre-Intervention Data Quality & Forensic Diff
    await page.goto("/app/audit");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/05_audit_forensic_diff.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "public/screenshots/after/04_energy_data.png",
      fullPage: true,
    });

    // 5. Opportunities & Physical Visualizer
    await page.goto("/app/interventions");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/06_interventions_visualizer.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "public/screenshots/after/05_opportunities_planner.png",
      fullPage: true,
    });

    // 6. Measurement Boundary & Smart Meter Diagram
    await page.goto("/app/measurement");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/07_smart_metering_flow.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "public/screenshots/after/06_measurement_strategy.png",
      fullPage: true,
    });

    // 7. Results & Three-Tier Visual
    await page.goto("/app/verify");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/08_three_tier_results.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "public/screenshots/after/07_evidence_results.png",
      fullPage: true,
    });

    // 8. Portfolio Aggregator & Campus Map
    await page.goto("/app/portfolio");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/09_campus_portfolio_map.png",
      fullPage: true,
    });

    // 9. Research Dossier & Benchmark Hero Visual
    await page.goto("/research");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/10_research_hero_dossier.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "public/screenshots/after/12_research_dossier.png",
      fullPage: true,
    });

    // 10. Reports Preview
    await page.goto("/app/reports");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after/08_reports_preview.png",
      fullPage: true,
    });
  });

  test("Capture Mobile V4 Screenshots", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Mobile Landing
    await page.goto("/");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/11_mobile_landing.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "public/screenshots/after/09_mobile_landing.png",
      fullPage: true,
    });

    // Mobile Judge
    await page.goto("/judge");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "public/screenshots/after_v4/12_mobile_judge.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "public/screenshots/after/10_mobile_judge.png",
      fullPage: true,
    });
  });
});
