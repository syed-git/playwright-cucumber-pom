import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { GlobalData } from "../support/global-data";
import { expect } from "../support/hooks";

export class ReviewPage extends BasePage {

    protected issuePolicy = this.page.getByRole('button', { name: 'Issue Policy' });
    protected numberAndStatus = this.page.locator('//h1[text()="New Submission"]//parent::div');

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
        await this.safeClick(this.issuePolicy);
        console.log('Navigating to next page...');
        await expect(this.numberAndStatus).toContainText('In Force');
        GlobalData.setCurrentPage('Policy Summary');
    }
    

    async clickOnNext() {
      await this.issuePolicy.click();
    }
}