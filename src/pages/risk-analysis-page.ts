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

    async fillOutPage(_autoGraystoneData: any) {
        // isVisible() returns immediately; give the page a moment to render the issue banner
        const hasUnderwritingIssue = await this.underwritingIssue
            .waitFor({ state: "visible", timeout: 10000 })
            .then(() => true)
            .catch(() => false);
        if (hasUnderwritingIssue) {
            await this.safeClick(this.submitForUnderwriting);
            await expect(this.awaitingMessage).toBeVisible();
        }
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        console.log('user is on Risk Analysis page...');
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.issuePolicy);
        console.log('Navigating to next page...');
    }
    
}