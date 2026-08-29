import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { GlobalData } from "../support/global-data";
import { expect } from "../support/hooks";

export class PolicySummaryPage extends BasePage {

    protected viewFullPolicy = this.page.getByRole('button', { name: 'View Full Policy'});
    protected entity = (name: string) => this.page.locator(`//div[text()="${name}"]//following-sibling::div`).last();
    protected totalPremium = this.page.locator(`div[class=amount]`);
    protected transactionText = this.page.getByRole('heading', { name: 'Transaction History'});
    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(_autoGraystoneData: any) {
        console.log(`Policy Summary:\n
            POLICY #:       ${await this.entity('Policy #').innerText()}\n
            STATUS:         ${await this.entity('Status').innerText()}\n
            EFFECTIVE DATE: ${await this.entity('Effective').innerText()}\n
            EXPIRATION:     ${await this.entity('Expiration').innerText()}\n
            DRIVERS:        ${await this.entity('Drivers').innerText()}\n
            VEHICLES:       ${await this.entity('Vehicles').innerText()}\n\n
            Total Term Premium (12 months): ${await this.totalPremium.innerText()}
        `);
        GlobalData.setPolicyNumber(await this.entity('Policy #').innerText());
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.viewFullPolicy);
        console.log('Navigating to next page...');
        await expect(this.transactionText).toBeVisible();
        GlobalData.setCurrentPage('View Full Policy');
    }
    
}