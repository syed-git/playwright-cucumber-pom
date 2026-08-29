import { Page } from "playwright/test";
import { BasePage } from "./base-page";

export class DriversPage extends BasePage {

    protected addDriver = this.page.getByRole('button', { name: '+ Add Driver' });
    protected firstName = this.page.locator('//label[text()="First Name *"]//following-sibling::input');
    protected lastName = this.page.locator('//label[text()="Last Name *"]//following-sibling::input');
    protected dateOfBirth = this.page.locator('//label[text()="Date of Birth *"]//following-sibling::input');
    protected gender = this.page.locator('//label[text()="Gender *"]//following-sibling::select');
    protected licenseNumber = this.page.locator('//label[text()="License Number *"]//following-sibling::input');
    protected licenseState = this.page.locator('//label[text()="License State *"]//following-sibling::input');
    protected yearsLicensed = this.page.locator('//label[text()="Years Licensed"]//following-sibling::input');
    protected accidents = this.page.locator('//label[text()="Accidents (5 yrs)"]//following-sibling::input');
    protected violations = this.page.locator('//label[text()="Violations (5 yrs)"]//following-sibling::input');
    protected relationshipToInsured = this.page.locator('//label[text()="Relationship to Insured"]//following-sibling::select');
    protected saveDriverButton = this.page.getByRole('button', { name: 'Save Driver' });
    protected nextButton = this.page.getByRole('button', { name: 'Next →' });
  
    constructor(page: Page) {
        super(page);
        
    }

    async fillOutPage(autoGraystoneData: any) {
        // Adding drivers details
        await this.fillDriverDetails(autoGraystoneData);
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        console.log('user is on the Drivers Page...');
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.nextButton);
        console.log('Navigating to next page...');
    }

    async fillDriverDetails(autoGraystoneData: any) {

        // get the number of drivers
        const numberOfDrivers = parseInt(autoGraystoneData.numberOfDrivers);

        for (let i = 1; i <= numberOfDrivers; i++) {
            console.log('Clicking on Add Driver button...');
            await this.safeClick(this.addDriver);
            console.log(`Adding Driver ${i} details...`);

            // get driver object based on index
            const driverData = autoGraystoneData.Drivers[`Driver${i}`];

            // fill out details
            console.log('Entering first name...');
            await this.safeFill(this.firstName, driverData.firstName);
            console.log('Entering last name...');
            await this.safeFill(this.lastName, driverData.lastName);
            console.log('Entering date of birth...');
            await this.safeFill(this.dateOfBirth, driverData.dateOfBirth);
            console.log('selecting gender...');
            await this.safeSelectOption(this.gender, driverData.gender);
            console.log('Entering license number...');
            await this.safeFill(this.licenseNumber, driverData.licenseNumber);

            if (driverData.licenseState) {
                console.log('Entering license state...');
                await this.safeFill(this.licenseState, driverData.licenseState);
            }
            if (driverData.yearsLicensed) {
                console.log('Entering years licensed...');
                await this.safeFill(this.yearsLicensed, driverData.yearsLicensed);
            }
            if (driverData.accidents) {
                console.log('Entering accidents...');
                await this.safeFill(this.accidents, driverData.accidents);
            }
            if (driverData.violations) {
                console.log('Entering violations...');
                await this.safeFill(this.violations, driverData.violations);
            }
            console.log('selecting the relationshio to insured...');
            await this.safeSelectOption(this.relationshipToInsured, driverData.relationshipToInsured || 'Insured');
            await this.safeClick(this.saveDriverButton);
            console.log(`Driver${i} details saved successfully...`);
        }
        
    }
}