import { After, AfterAll, Before, setDefaultTimeout, Status } from "@cucumber/cucumber";
import { chromium, firefox, webkit } from "@playwright/test";
import { CustomWorld } from "./world";
import { expect as baseExpect} from '@playwright/test'
// import { generateReport } from "../../src/support/report-generator";
export const expect = baseExpect.configure({timeout: 90000});
setDefaultTimeout(120 * 1000); // Set default timeout to 60 seconds

Before(async function (this: CustomWorld) {
  // Clear test data for fresh scenario
  this.data = {};
  const environment = process.env.ENV || "uat1";
  const isHeadless = process.env.HEADLESS ? process.env.HEADLESS.toLowerCase() === "true" : true || false;
  const supportedBrowsers = ["chromium", "firefox", "webkit"];
  const browserType = supportedBrowsers.includes(process.env.BROWSER || "") ? (process.env.BROWSER as string) : "chromium";

  switch (browserType) {
    case "chromium":
      this.browser = await chromium.launch({ headless: isHeadless});
      break;
    case "firefox":
      this.browser = await firefox.launch({ headless: isHeadless });
      break;
    case "webkit":
      this.browser = await webkit.launch({ headless: isHeadless });
      break;
    default:
      throw new Error(`Unsupported browser type: ${browserType}`);
  }

  this.context = await this.browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
  });
  // Floating overlays (e.g. the Netlify badge iframe) sit on top of the page and
  // intercept pointer events after Playwright auto-scrolls an element into view.
  // Disable pointer events on them so clicks on scrolled-to elements succeed.
  await this.context.addInitScript(() => {
    const injectStyle = () => {
      const style = document.createElement("style");
      style.textContent = "#nl-badge-frame, #nl-badge, [id^='nl-badge'] { display: none !important; pointer-events: none !important; }";
      (document.head || document.documentElement).appendChild(style);
    };
    if (document.documentElement) {
      injectStyle();
    } else {
      document.addEventListener("DOMContentLoaded", injectStyle);
    }
  });
  this.page = await this.context.newPage();
  this.environment = environment;
  console.log(`Browser started for environment: ${environment}, headless: ${isHeadless}, browser: ${browserType}`);
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot();
    this.attach(`📷 Failure — ${scenario.pickle.name}`, "text/plain");
    this.attach(screenshot, "image/png");
  }
  if (!process.env.LEAVE_BROWSER_OPEN || process.env.LEAVE_BROWSER_OPEN.toLowerCase() !== "true") {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
});

// HTML dashboard generation is handled by src/support/generate-report-latest.ts,
// which wraps the cucumber-js run (see the "test" script in package.json) and works
// for both serial and parallel executions.