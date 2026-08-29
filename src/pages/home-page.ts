import { Locator, Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from "../support/hooks";
import { GlobalData } from "../support/global-data";

export class HomePage extends BasePage {

  protected newSubmissionButton: Locator = this.page.getByRole('link', { name: '+ New Submission' });
  protected heading: Locator = this.page.locator('//h1[contains(text(), "New Submission — Personal Auto")]');
  protected pageName = this.page.locator('div[class=panel-header]').first();
  constructor(page: Page) {
    super(page);
  }

  async clickNewSubmission() {
    console.log('Starting a new submission....');
    await this.safeClick(this.newSubmissionButton);
    await expect(this.heading).toBeVisible();
    await expect(this.pageName, `page name is not as expected`).toHaveText('Policy Information');
    console.log('New submission started....');
    console.log('user is on the Policy Info Page...');
    GlobalData.setCurrentPage('Policy Info');
  }
}