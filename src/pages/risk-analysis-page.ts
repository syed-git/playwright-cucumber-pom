import { expect, Page } from "playwright/test";
import { BasePage } from "./base-page";

export class RsikAnalysisPage extends BasePage {

    protected issuePolicy = this.page.getByRole('button', { name: 'Issue Policy'});
    protected underwritingIssue = this.page.getByText('This submission must be referred to underwriting. Submit for approval below — you will not be able to issue this policy until the underwriter approves it.')
    protected submitForUnderwriting = this.page.getByRole('button', { name: 'Submit for UW Approval'});
    protected awaitingMessage = this.page.getByText('Awaiting underwriter approval. Sign in as an underwriter to approve this submission from the UW Approvals screen.');
    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(autoGraystoneData: any) {
        if (await this.underwritingIssue.isVisible()) {
            await this.submitForUnderwriting.click();
            await expect(this.awaitingMessage).toBeVisible();
        }
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        console.log('user is on Risk Analysis page...');
        await this.fillOutPage(autoGraystoneData);
        await this.issuePolicy.click();
        console.log('Navigating to next page...');
    }
    
}