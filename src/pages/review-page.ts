import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { GlobalData } from "../support/global-data";
import { expect } from "../support/hooks";

export class ReviewPage extends BasePage {

    protected rsikAnalysisButton = this.page.getByRole('button', { name: 'Risk Analysis →'});
    protected pageName = this.page.locator('div[class=panel-header]').first();

    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(_autoGraystoneData: any) {
        // do nothing
        console.log(`filling out the ${GlobalData.currentPage()}...`);
        console.log(`${GlobalData.currentPage()} filled successfully....`);
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.rsikAnalysisButton);
        console.log('Navigating to next page...');
        await expect(this.pageName).toContainText('Risk Analysis');
        GlobalData.setCurrentPage('Risk Analysis');
    }
    
}