import { Locator, Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from "../support/hooks";

export class HomePage extends BasePage {

  protected newSubmissionButton: Locator = this.page.getByRole('link', { name: '+ New Submission' });;
  protected heading: Locator = this.page.locator('//h1[contains(text(), "New Submission — Personal Auto")]');;

  constructor(page: Page) {
    super(page);
  }

  async clickNewSubmission() {
    console.log('Starting a new submission....');
    await this.safeClick(this.newSubmissionButton);
    await expect(this.heading).toBeVisible();
    console.log('New submission started....');
  }
}