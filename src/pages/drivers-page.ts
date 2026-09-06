import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from "../support/hooks";
import { GlobalData } from "../support/global-data";

export class DriversPage extends BasePage {

    protected addDriver = this.page.getByRole('button', { name: 'Add Driver' });
    protected firstName = this.page.locator('//label[text()="First Name"]//following-sibling::input');
    protected lastName = this.page.locator('//label[text()="Last Name"]//following-sibling::input');
    protected dateOfBirth = this.page.locator('//label[text()="Date of Birth"]//following-sibling::input');
    protected gender: any = {
      male: this.page.getByLabel('Male', { exact: true }),
      female: this.page.getByLabel('Female', { exact: true }),
      other: this.page.getByLabel('Other', { exact: true })
    }
    protected licenseNumber = this.page.locator('//label[text()="License Number"]//following-sibling::input');
    protected licenseState = this.page.locator('//label[text()="License State"]//following-sibling::input');
    protected yearsLicensed = this.page.locator('//label[text()="Years Licensed"]//following-sibling::input');
    protected accidents = this.page.locator('//label[text()="Accidents (past 5 yrs)"]//following-sibling::input');
    protected violations = this.page.locator('//label[text()="Violations (past 5 yrs)"]//following-sibling::input');
    protected relationshipToInsured = this.page.locator('//label[text()="Relationship to Insured"]//following-sibling::select');
    protected chooseFile = this.page.locator('input[type=file]');
    protected saveDriverButton = this.page.getByRole('button', { name: 'Save Driver Details' });
    protected nextButton = this.page.getByRole('button', { name: 'Next' });
    protected pageName = this.page.getByRole('heading', { name: 'Vehicles' });
    protected inputField = (fieldName: string) => this.page.locator(`//label[contains(text(),"${fieldName}")]//following-sibling::input`);
    protected deleteDriverButton = this.page.locator(`//button[contains(@class,"btn btn-ghost danger")]`);

    constructor(page: Page) {
        super(page);
        
    }

    async fillOutPage(autoGraystoneData: any) {
        console.log(`filling out the ${GlobalData.currentPage()} page....`);
        // Adding drivers details
        await this.fillDriverDetails(autoGraystoneData);
        console.log(`${GlobalData.currentPage()} page filled successfully...`);
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        await this.fillOutPage(autoGraystoneData);
        await this.nextButton.click();
        console.log('Navigating to next page...');
        await expect(this.pageName).toBeVisible();
        GlobalData.setCurrentPage('Vehicles');
    }

    async fillDriverDetails(autoGraystoneData: any) {

        // get the number of drivers
        const numberOfDrivers = parseInt(autoGraystoneData.numberOfDrivers);

        for (let i = 1; i <= numberOfDrivers; i++) {
            console.log('Clicking on Add Driver button...');
            await this.addDriver.click();
            console.log(`Adding Driver ${i} details...`);

            // get driver object based on index
            const driverData = autoGraystoneData.Drivers[`Driver${i}`];

            // fill out details
            console.log('Entering first name...');
            await this.firstName.fill(driverData.firstName);
            console.log('Entering last name...');
            await this.lastName.fill(driverData.lastName);
            console.log('Entering date of birth...');
            await this.dateOfBirth.fill(driverData.dateOfBirth);
            console.log('selecting gender...');
            await this.gender[driverData.gender.toLowerCase()].click();
            console.log('Entering license number...');
            await this.licenseNumber.fill(driverData.licenseNumber);

            if (driverData.licenseState) {
                console.log('Entering license state...');
                await this.licenseState.fill(driverData.licenseState);
            }
            if (driverData.yearsLicensed) {
                console.log('Entering years licensed...');
                await this.yearsLicensed.fill(driverData.yearsLicensed);
            }
            if (driverData.accidents) {
                console.log('Entering accidents...');
                await this.accidents.fill(driverData.accidents);
            }
            if (driverData.violations) {
                console.log('Entering violations...');
                await this.violations.fill(driverData.violations);
            }
            console.log('selecting the relationshio to insured...');
            await this.relationshipToInsured.selectOption(driverData.relationshipToInsured || 'Insured');
            await this.saveDriverButton.click();
            console.log(`Driver${i} details saved successfully...`);
        }
        
    }

    async clickOnNext() {
      await this.nextButton.click();
    }

    async removeDriver(driverIndex: number) {
        console.log(`Removing Insured${driverIndex}...`);
        await this.deleteDriverButton.nth(driverIndex - 1).click();
        console.log(`Insured${driverIndex} removed successfully...`);
    }
}