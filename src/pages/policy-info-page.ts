import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { GlobalData } from "../support/global-data";
import { expect } from "../support/hooks";

export class PolicyInfoPage extends BasePage {

    protected effectiveDateInput = this.page.locator('//label[text()="Effective Date "]//following-sibling::input');
    protected expirationDate = this.page.locator('//label[text()="Expiration Date"]//following-sibling::input');
    protected addInsuredButton = this.page.getByRole('button', { name: 'Add Insured' });
    protected firstName = this.page.locator('//label[text()="First Name"]//following-sibling::input');
    protected lastName = this.page.locator('//label[text()="Last Name"]//following-sibling::input');
    protected dateOfBirth = this.page.locator('//label[text()="Date of Birth"]//following-sibling::input');
    protected gender: any = {
      male: this.page.getByLabel('Male', { exact: true }),
      female: this.page.getByLabel('Female', { exact: true}),
      other: this.page.getByLabel('Other', { exact: true})
    }
    protected email = this.page.locator('//label[text()="Email"]//following-sibling::input');
    protected phone = this.page.locator('//label[text()="Phone"]//following-sibling::input');
    protected address = this.page.locator('//label[text()="Address"]//following-sibling::input');
    protected city = this.page.locator('//label[text()="City"]//following-sibling::input');
    protected state = this.page.locator('//label[text()="State"]//following-sibling::input');
    protected zip = this.page.locator('//label[text()="ZIP"]//following-sibling::input');
    protected primaryInsured = this.page.getByLabel('This person is the primary insured');
    protected saveInsuredButton = this.page.getByRole('button', { name: 'Save Insured Details' });
    protected nextButton = this.page.getByRole('button', { name: 'Next' });
    protected pageName = this.page.getByRole('heading', { name: 'Drivers'});
    protected numberAndStatus = this.page.locator('//p[contains(text(),"Personal Auto")]');
    protected deleteInsuredButton = this.page.locator(`//button[contains(@class,"btn btn-ghost danger")]`);
    protected inputField = (fieldName: string) => this.page.locator(`//label[contains(text(),"${fieldName}")]//following-sibling::input`);

    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(autoGraystoneData: any) {
      console.log(`filling out the ${GlobalData.currentPage()} page....`);
      
      // fill out effective date
      await this.fillEffectiveDate(autoGraystoneData.effectiveDate);

      // fill out Insured details
      await this.fillInsuredDetails(autoGraystoneData);
      console.log(`'${GlobalData.currentPage()} page filled successfully...`);
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
      await this.fillOutPage(autoGraystoneData);
      await this.clickOnNext();
      console.log('navigating to next page...');
      await expect(this.pageName, 'page name is not expected').toContainText('Drivers');
      console.log('user is on the Drivers page....');
      GlobalData.setCurrentPage('Drivers');
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
          await this.gender[insuredData.gender.toLowerCase()].click();

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
          if (insuredData.isPrimaryInsured) {
            await this.primaryInsured.click();
          }
          await this.saveInsuredButton.click();
          console.log(`Insured${i} details saved successfully....`);
      }    
    }

    async clickOnNext() {
      await this.nextButton.click();
      await expect(this.pageName).toContainText('Drivers');
      
      // get the submission number
      const text = await this.numberAndStatus.innerText();
      const submissionNumber = text.match(/PA-\d+/)?.[0];
      GlobalData.setSubmissionNumber(submissionNumber || '');
    }

    async removeInsured(insuredIndex: number) {
      console.log(`Removing Insured${insuredIndex}...`);
      await this.deleteInsuredButton.nth(insuredIndex - 1).click();
      console.log(`Insured${insuredIndex} removed successfully...`);
    }

}