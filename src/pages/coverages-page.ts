import { Page } from "playwright/test";
import { BasePage } from "./base-page";

export class CoveragesPage extends BasePage {

    protected coverageCheckbox = (name: string) => this.page.locator(`//strong[text()="${name}"]//parent::td//preceding-sibling::td//input`);
    protected coverageLimit = (name: string) => this.page.locator(`//strong[text()="${name}"]/parent::td//following-sibling::td//select`);
    protected generaQuote = this.page.getByRole('button', { name: 'Generate Quote' });
  
    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(autoGraystoneData: any) {
        await this.fillBodilyInjury(autoGraystoneData);
        await this.fillPropertyDamage(autoGraystoneData);
        await this.fillUninsuredMotorist(autoGraystoneData);
        await this.fillMedicalPayments(autoGraystoneData);
        await this.fillComprehensive(autoGraystoneData);
        await this.fillCollision(autoGraystoneData);
        await this.fillRentalReimbursement(autoGraystoneData);
        await this.fillRoadSideAssistance(autoGraystoneData);
        console.log('All coverages have been selected....')
        
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        console.log('user is on Coverages page...');
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.generaQuote);
        console.log('Navigating to next page...');
    }

           
    async fillBodilyInjury(autoGraystoneData: any) {
        const bodilyInjury = autoGraystoneData.Coverages.bodilyInjuryLiability;

        if (bodilyInjury) {
            console.log(`selecting Bodily Injury Liability coverage with value: ${bodilyInjury}...`);
            await this.safeCheck(this.coverageCheckbox('Bodily Injury Liability'));
            await this.safeSelectOption(this.coverageLimit('Bodily Injury Liability'), bodilyInjury);
        }
    }

    async fillPropertyDamage(autoGraystoneData: any) {
        const propertyDamage = autoGraystoneData.Coverages.propertyDamageLiability;

        if (propertyDamage) {
            console.log(`selecting Property Damage Liability with value: ${propertyDamage}`);
            await this.safeCheck(this.coverageCheckbox('Property Damage Liability'));
            await this.safeSelectOption(this.coverageLimit('Property Damage Liability'), propertyDamage);
        }
    }

    async fillUninsuredMotorist(autoGraystoneData: any) {
        const uninsuredMotorist = autoGraystoneData.Coverages.uninsuredMotorist;

        if (uninsuredMotorist) {
            console.log(`selecting uninsured Motorist with value: ${uninsuredMotorist}`);
            await this.safeCheck(this.coverageCheckbox('Uninsured Motorist'));
            await this.safeSelectOption(this.coverageLimit('Property Damage Liability'), uninsuredMotorist);
        } else {
            console.log(`deselecting uninsured Motorist`);
            await this.safeUncheck(this.coverageCheckbox('Uninsured Motorist'));
        }
    }

    async fillMedicalPayments(autoGraystoneData: any) {
        const medicalPayments = autoGraystoneData.Coverages.medicalPayments;

        if (medicalPayments) {
            console.log(`selecting Medical Payments with value: ${medicalPayments}`);
            await this.safeCheck(this.coverageCheckbox('Medical Payments'));
            await this.safeSelectOption(this.coverageLimit('Medical Payments'), medicalPayments);
        }
    }

    async fillComprehensive(autoGraystoneData: any) {
        const comprehensive = autoGraystoneData.Coverages.comprehensive;

        if (comprehensive) {
            console.log(`selecting Comprehensive with value: ${comprehensive}`);
            await this.safeCheck(this.coverageCheckbox('Comprehensive'));
            await this.safeSelectOption(this.coverageLimit('Comprehensive'), comprehensive);
        } else {
            console.log(`deselecting Comprehensive coverage`);
            await this.safeUncheck(this.coverageCheckbox('Comprehensive'));
        }
    }

    async fillCollision(autoGraystoneData: any) {
        const collision = autoGraystoneData.Coverages.collision;

        if (collision) {
            console.log(`selecting collison with value: ${collision}`);
            await this.safeCheck(this.coverageCheckbox('Collision'));
            await this.safeSelectOption(this.coverageLimit('Collision'), collision);
        }
    }

    async fillRentalReimbursement(autoGraystoneData: any) {
        const rentalReimbursement = autoGraystoneData.Coverages.rentalReimbursement;

        if (rentalReimbursement) {
            console.log(`selecting Rental Reimbursement with value: ${rentalReimbursement}`);
            await this.safeCheck(this.coverageCheckbox('Rental Reimbursement'));
            await this.safeSelectOption(this.coverageLimit('Rental Reimbursement'), rentalReimbursement);
        }
    }

    async fillRoadSideAssistance(autoGraystoneData: any) {
        const roadSideAssistance = autoGraystoneData.Coverages.roadSideAssitance;

        if (roadSideAssistance) {
            console.log(`selecting Roadside Assistance with value: ${roadSideAssistance}`);
            await this.safeCheck(this.coverageCheckbox('Roadside Assistance'));
        }
    }

    
}