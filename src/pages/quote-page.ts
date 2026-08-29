import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from "../support/hooks";
import { GlobalData } from "../support/global-data";

export class QuotePage extends BasePage {

    protected entity = (name: string) => this.page.locator(`//div[text()="${name}"]//following-sibling::div`).last();
    protected totalPremium = this.page.locator(`div[class=amount]`);
    protected reviewButton = this.page.getByRole('button', { name:'Review Details →' });
    protected reviewAllDetails = this.page.getByText('Review all submission details below before proceeding to risk analysis.');

    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(autoGraystoneData: any) {
        console.log(`Policy quoted successfully...`);
        await expect(this.entity('Insureds')).toHaveText(autoGraystoneData.numberOfInsured);
        await expect(this.entity('Drivers')).toHaveText(autoGraystoneData.numberOfDrivers);
        await expect(this.entity('Vehicles')).toHaveText(autoGraystoneData.numberOfVehicles);
        await expect(this.entity('Coverages Selected')).toHaveText(String(Object.keys(autoGraystoneData.Coverages).length)); 
        console.log(`Policy Summary...\n\n
            INSURED:         ${await this.entity('Insureds').innerText()}\n
            DRIVERS:         ${await this.entity('Drivers').innerText()}\n
            VEHICLES:        ${await this.entity('Vehicles').innerText()}\n
            EFFECTIVE DATE:  ${await this.entity('Effective Date').innerText()}\n
            Expiration Date: ${await this.entity('Expiration Date').innerText()}\n\n
            Total Term Premium (12 months): ${await this.totalPremium.innerText()}
        `);
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.reviewButton);
        console.log('Navigating to next page...');
        await expect(this.reviewAllDetails).toContainText('Review all submission details');
        console.log('user is on Review page...');
        GlobalData.setCurrentPage('Review');
    }
    
}