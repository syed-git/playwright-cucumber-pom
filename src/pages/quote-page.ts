import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from "../support/hooks";
import { GlobalData } from "../support/global-data";

export class QuotePage extends BasePage {

    protected entity = (name: string) => this.page.locator(`//span[contains(text(),"${name}")]//following-sibling::span`).last();
    protected nextButton = this.page.getByRole('button', { name:'Next' });
    protected reviewAllDetails = this.page.getByText('Review all submission details below before proceeding to risk analysis.');
    protected pageName = this.page.getByRole('heading', { name: 'Risk Analysis'});

    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(autoGraystoneData: any) {
        console.log(`Policy quoted successfully...`); 
        console.log(`Policy Summary...\n\n
            DRIVERS:          ${await this.entity('Driver factors').innerText()}\n
            VEHICLES:         ${await this.entity('Vehicle base').innerText()}\n
            Subtotal:         ${await this.entity('Subtotal').innerText()}\n
            Taxes & fee (6%): ${await this.entity('Taxes & fees').innerText()}\n
            Total Premium:    ${await this.entity('Total Premium').innerText()}\n
        `);
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.nextButton);
        console.log('Navigating to next page...');
        await expect(this.pageName).toContainText('Risk Analysis');
        GlobalData.setCurrentPage('Risk Analysis');
    }

    async clickOnNext() {
        await this.nextButton.click();
    }
    
}