import { Locator, Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from "../support/hooks";
import { GlobalData } from "../support/global-data";

export class UWApprovalsPage extends BasePage {

  protected uwApprovalTab: Locator = this.page.getByRole('link', { name: 'UW Approvals' });
  protected approve: Locator = this.page.getByRole('button', { name: "Approve"});
  protected decision = (policyNumber: string) => this.page.locator(`//strong[text()="${policyNumber}"]//ancestor::td//following-sibling::td[3]`);

  constructor(page: Page) {
    super(page);
  }

  async approvaAllUnderwritingIssues() {
    console.log('navigating to UW Approvals...');
    await this.safeClick(this.uwApprovalTab);

    console.log('Checking if any approval is pending...');
    const approvalPending = await this.approve
      .waitFor({ state: "visible", timeout: 10000 })
      .then(() => true)
      .catch(() => false);
    if (approvalPending) {
      console.log('Approving the issues....')
      await this.safeClick(this.approve);
    } else {
      console.log('No approvals are pending.....');
    }
    await expect(this.decision(GlobalData.getPolicyNumber())).toHaveText('Approved');
    console.log('All underwriting issues approved....');
  }
}