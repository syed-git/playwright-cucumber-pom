import { expect, Page } from "playwright/test";
import { BasePage } from "./base-page";
import moment from "moment";
import { GlobalData } from "../support/global-data";

export class ViewFullPolicyPage extends BasePage {

    protected policyChangeButton = this.page.getByRole("button", { name: "Policy Change" });
    protected startPolicyChangeText = this.page.getByText("Start Policy Change");
    protected policyChangeEffectiveDateInput = this.page.locator('//label[text()="Change Effective Date "]//following-sibling::input');
    protected cotinueButton = this.page.getByRole("button", { name: "Continue" });
    protected pageName = this.page.getByRole('heading', { name: 'Policy Information' });
    protected cancelButton = this.page.getByRole("button", { name: "Cancel Policy" });
    protected cancellationType = (type: string) => this.page.locator(`//strong[contains(text(),"${type}")]//ancestor::label//child::input`); 
    protected reasonForCancellationInput = this.page.getByPlaceholder('e.g. Insured request — sold vehicle');
    protected confirmCancellationButton = this.page.getByRole("button", { name: "Confirm Cancellation" });
    protected reinstateButton = this.page.getByRole("button", { name: "Reinstate" });

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

    async initiatePolicyChange(autoGraystoneData: any) {
        console.log('Initiating policy change...');
        // Implement the logic to initiate the policy change here
        await this.policyChangeButton.click();
        await expect(this.startPolicyChangeText).toBeVisible();
        await this.policyChangeEffectiveDateInput.fill(autoGraystoneData.effectiveDate || moment().add(1, 'days').format('YYYY-MM-DD'));
        await this.cotinueButton.click();
        await expect(this.pageName).toContainText('Policy Information');
        console.log('Policy change initiated successfully...');
        GlobalData.setCurrentPage('Policy Info');
    }

    async initiatePolicyCancellation(cancellationType: string) {
        console.log('Initiating policy cancellation...');
        await this.cancelButton.click();
        await this.cancellationType(cancellationType).click();
        await this.reasonForCancellationInput.fill('Insured request — sold vehicle');
        await this.confirmCancellationButton.click();
        await expect(this.reinstateButton).toBeVisible();
        console.log('Policy cancellation initiated successfully...');
    }

    async reinstatePolicy() {
        console.log('Reinstating policy...');
        await this.reinstateButton.click();
        await expect(this.cancelButton).toBeVisible();
        console.log('Policy reinstated successfully...');
    }
    
}