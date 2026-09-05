import { Locator, Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from "../support/hooks";
import { GlobalData } from "../support/global-data";

export class UWApprovalsPage extends BasePage {

  protected uwApprovalTab: Locator = this.page.getByRole('link', { name: 'UW Approvals' });
  protected approve: Locator = this.page.getByRole('button', { name: "Approve"}).last();
  protected approvedMessage = this.page.getByText('Approved by');
  protected submittedForApprovalMessage = this.page.getByText('Submitted for approval — pending underwriter review.');

  constructor(page: Page) {
    super(page);
  }

  async approvaAllUnderwritingIssues() {

    console.log('Checking if any approval is pending...');
    const approvalPending = await this.submittedForApprovalMessage.isVisible({ timeout: 5000 }).catch(() => false);
    if (approvalPending) {
      console.log('Approving the issues....')
      await this.safeClick(this.approve);
    } else {
      console.log('No approvals are pending.....');
    }
    await expect(this.submittedForApprovalMessage).toBeHidden();
    console.log('All underwriting issues approved....');
  }
}