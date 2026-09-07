import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from "../support/hooks";
import { GlobalData } from "../support/global-data";

export class RsikAnalysisPage extends BasePage {

    protected nextButton = this.page.getByRole('button', { name: 'Next'});
    protected underwritingIssue = this.page.getByText('Blocking — underwriter approval required').first()
    protected submitForUnderwriting = this.page.getByRole('button', { name: 'Submit for Approval'});
    protected submittedMessage = this.page.getByText('Submitted for approval — pending underwriter review.');
    protected pageName = this.page.getByRole('heading', { name: 'Review'});
    
    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(_autoGraystoneData: any) {
        // isVisible() returns immediately; give the page a moment to render the issue banner
        const hasUnderwritingIssue = await this.underwritingIssue.isVisible({ timeout: 5000 }).catch(() => false);
        if (hasUnderwritingIssue) {
            console.log('Underwriting issue detected, submitting for approval...');
            await this.safeClick(this.submitForUnderwriting);
            await expect(this.submittedMessage).toBeVisible();
            console.log('Submitted for approval, waiting for underwriter review...');
        } else {
            console.log('No underwriting issue detected, proceeding to next page...');
        }
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.nextButton);
        console.log('Navigating to next page...');
        await expect(this.pageName).toContainText('Review');
        GlobalData.setCurrentPage('Review');
    }

    async clickOnNext() {
      await this.nextButton.click();
    }
    
}