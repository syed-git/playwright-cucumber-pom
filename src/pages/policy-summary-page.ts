import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { GlobalData } from "../support/global-data";
import { expect } from "../support/hooks";

export class PolicySummaryPage extends BasePage {

    protected numberAndStatus = this.page.locator('//p[contains(text(),"Personal Auto")]');
    protected viewPolicy = this.page.getByRole('button', { name: 'View Policy'});
    protected entity = (name: string) => this.page.locator(`//span[text()="${name}"]//following-sibling::span`).last();
    protected totalPremium = this.page.locator(`div[class=amount]`);
    protected transactionHistoryText = this.page.getByText('Transaction History');
    
    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(_autoGraystoneData: any) {
        const text = await this.numberAndStatus.innerText();
        const policyNumber = text.match(/PA-\d+/)?.[0];
        GlobalData.setPolicyNumber(policyNumber || '');

        console.log(`Policy Summary:\n
            POLICY #:       ${GlobalData.getPolicyNumber()}\n
            STATUS:         In Force\n
            EFFECTIVE DATE: ${await this.entity('Effective Date').innerText()}\n
            EXPIRATION:     ${await this.entity('Expiration Date').innerText()}\n
            TERM:           ${await this.entity('Term').innerText()}\n\n
            Total Premium:  ${await this.entity('Total Premium').innerText()}
        `);
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.viewPolicy);
        console.log('Navigating to next page...');
        await expect(this.transactionHistoryText).toBeVisible();
        GlobalData.setCurrentPage('View Full Policy');
    }

    async clickOnNext() {
      await this.viewPolicy.click();
    }
    
}