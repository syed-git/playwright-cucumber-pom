import { Locator, Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from '../support/hooks';
import { GlobalData } from "../support/global-data";

export class PoliciesPage extends BasePage {

  protected policyNumnbeInput: Locator = this.page.getByPlaceholder("Policy number or insured name…");
  protected result = (policyNumber: string) => this.page.locator(`//strong[text()="${policyNumber}"]//parent::a`);
  protected loginButton: Locator = this.page.getByRole("button", { name: "Sign In" });
  protected logoutButton: Locator = this.page.getByRole("button", { name: "Sign Out" });
  
  constructor(page: Page) {
    super(page);
  }

  async retrievePolicy() {
    const policyNumber = GlobalData.getPolicyNumber();
    await this.policyNumnbeInput.pressSequentially(policyNumber, { delay: 100});
    await this.result(policyNumber).waitFor({ state: "visible", timeout:10000});
    await this.result(policyNumber).click();
  }

  async logout () {
    await this.logoutButton.click();
    await expect(this.loginButton).toBeVisible();
  }
}