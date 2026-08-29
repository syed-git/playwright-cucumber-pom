import { Page } from "playwright/test";
import { BasePage } from "./base-page";

export class ReviewPage extends BasePage {

    protected rsikAnalysisButton = this.page.getByRole('button', { name: 'Risk Analysis →'});
    
    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(_autoGraystoneData: any) {
        // do nothing
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        console.log('user is on Review page...');
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.rsikAnalysisButton);
        console.log('Navigating to next page...');
    }
    
}