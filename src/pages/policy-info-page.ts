import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { GlobalData } from "../support/global-data";

export class PolicyInfoPage extends BasePage {

    protected submissionNumber = this.page.locator(`//h1[text()="New Submission — Personal Auto"]//parent::div//following-sibling::div`);
    protected effectiveDateInput = this.page.locator('//label[text()="Effective Date *"]//following-sibling::input');
    protected addInsuredButton = this.page.getByRole('button', { name: 'Add Insured' });
    protected firstName = this.page.locator('//label[text()="First Name *"]//following-sibling::input');
    protected lastName = this.page.locator('//label[text()="Last Name *"]//following-sibling::input');
    protected dateOfBirth = this.page.locator('//label[text()="Date of Birth *"]//following-sibling::input');
    protected gender = this.page.locator('//label[text()="Gender *"]//following-sibling::select');
    protected email = this.page.locator('//label[text()="Email"]//following-sibling::input');
    protected phone = this.page.locator('//label[text()="Phone"]//following-sibling::input');
    protected address = this.page.locator('//label[text()="Address"]//following-sibling::input');
    protected city = this.page.locator('//label[text()="City"]//following-sibling::input');
    protected state = this.page.locator('//label[text()="State"]//following-sibling::input');
    protected zip = this.page.locator('//label[text()="ZIP"]//following-sibling::input');
    protected primaryInsured = this.page.locator('//label[text()="Primary Insured"]//following-sibling::select');
    protected saveInsuredButton = this.page.getByRole('button', { name: 'Save Insured' });
    protected nextButton = this.page.getByRole('button', { name: 'Next →' });
  
    constructor(page: Page) {
        super(page);
    }

  async fillOutPage(autoGraystoneData: any) {

    // store the policy number
    const text = await this.submissionNumber.innerText();
    const match = text.match(/PA-\d+/);
    const policyNumber = match ? match[0] : "";
    GlobalData.setPolicyNumber(policyNumber);
    
    // fill out effective date
    await this.fillEffectiveDate(autoGraystoneData.effectiveDate);

    // fill out Insured details
    await this.fillInsuredDetails(autoGraystoneData);
  }

  async fillOutPageAndContinue(autoGraystoneData: any) {
    console.log('user is on T=the POlicy Infor page..');
    await this.fillOutPage(autoGraystoneData);
    await this.nextButton.click();
    console.log('navigating to next page...')
  }

  async fillEffectiveDate(effectiveDate: string) {
    console.log('Entering effective date....');
    await this.effectiveDateInput.fill(effectiveDate);
  }

  async fillInsuredDetails(autoGraystoneData: any) {
    // get the number of insured 
    const numberOfInsured = parseInt(autoGraystoneData.numberOfInsured);

    // add all insured based on number of insured
    for (let i = 1; i <= numberOfInsured; i++) {
        console.log(`Adding Insured${i} details...`);

        // Get Insured object based on index
        const insuredData = autoGraystoneData.Insured[`NamedInsured${i}`];
        
        console.log('Clicking on Add Insured button...');
        await this.addInsuredButton.click();
        console.log('Entering first name...');
        await this.firstName.fill(insuredData.firstName);
        console.log('Entering last name...');
        await this.lastName.fill(insuredData.lastName);
        console.log('Entering date of birth...');
        await this.dateOfBirth.fill(insuredData.dateOfBirth);
        console.log('selecting the gender....');
        await this.gender.selectOption(insuredData.gender);

        if (insuredData.email) {
          console.log('Entering email...');
          await this.email.fill(insuredData.email);
        }
        if (insuredData.phone) {
          console.log('Entering phone...');
          await this.phone.fill(insuredData.phone);
        }
        if (insuredData.address) {
          console.log('Entering address...');
          await this.address.fill(insuredData.address);
        }
        if (insuredData.city) {
          console.log('Entering city...');
            await this.city.fill(insuredData.city);
        }
        if (insuredData.state) {
          console.log('Entering state...');
            await this.state.fill(insuredData.state);
        }
        if (insuredData.zip) {
          console.log('Entering zip...');
            await this.zip.fill(insuredData.zip);
        }
        console.log('selecting is primary inusred option...');
        await this.primaryInsured.selectOption(insuredData.isPrimaryInsured ? 'Yes' : 'No');
        await this.saveInsuredButton.click();
        console.log(`Insured${i} details saved successfully....`);
    }    
  }

}