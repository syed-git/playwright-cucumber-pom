import { Page } from "playwright/test";
import { BasePage } from "./base-page";

export class ViewFullPolicyPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(_autoGraystoneData: any) {
        //
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        console.log('user is on View Full Policy Page...');
        await this.fillOutPage(autoGraystoneData);
        console.log('Navigating to next page...');
    }
    
}