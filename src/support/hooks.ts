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
  const browserType = process.env.BROWSER || "chromium";

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
  });
  this.page = await this.context.newPage();
  this.environment = environment;
  console.log(`Browser started for environment: ${environment}, headless: ${isHeadless}, browser: ${browserType}`);
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, "image/png");
  }
  if (!process.env.LEAVE_BROWSER_OPEN || process.env.LEAVE_BROWSER_OPEN.toLowerCase() !== "true") {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
});

AfterAll(async function () {
    // serial mode: run report in-process via beforeExit - Console.log prints to terminal normally
    if (!process.env.CUCUMBER_WORKER_ID) {
      process.on('beforeExit', () =>{
        try {
          // call generateReport();
        } catch (e) {
          console.log('Report generation failed:', e);
        }
      });
      return;
    }

    //parallel mode
    if (process.env.CUCUMBER_WORKER_ID === '0') {
      require('child_process').spawn(process.execPath, ['-r', 'ts-node/register', '-e', `const cpid=${process.ppid};const iv=setInterval(()=>{try{process.kill(cpid,0);}catch{clearInterval(iv);setTimeout(()=>{require('./playwright/support/report-generator').generateHtmlDashboard();process.exit(0);},500);}},500);setTimeout(()=>process.exit(1),600000);}})`])
    }
});