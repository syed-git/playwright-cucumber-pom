import { Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from "../support/hooks";
import { GlobalData } from "../support/global-data";

export class CoveragesPage extends BasePage {

    protected coverageCheckbox = (name: string) => this.page.locator(`//strong[text()="${name}"]//parent::td//preceding-sibling::td//input`);
    protected coverageLimit = (name: string) => this.page.locator(`//strong[text()="${name}"]/parent::td//following-sibling::td//select`);
    protected generaQuote = this.page.getByRole('button', { name: 'Generate Quote' });
    protected quoteSumary = this.page.getByRole('heading', {name: 'Quote Summary'});

    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(autoGraystoneData: any) {
        
        console.log(`filling out ${GlobalData.currentPage()} page...`);
        await this.fillBodilyInjury(autoGraystoneData);
        await this.fillPropertyDamage(autoGraystoneData);
        await this.fillUninsuredMotorist(autoGraystoneData);
        await this.fillMedicalPayments(autoGraystoneData);
        await this.fillComprehensive(autoGraystoneData);
        await this.fillCollision(autoGraystoneData);
        await this.fillRentalReimbursement(autoGraystoneData);
        await this.fillRoadSideAssistance(autoGraystoneData);
        console.log(`'${GlobalData.currentPage()} page filled successfully...`);
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        await this.fillOutPage(autoGraystoneData);
        await this.generaQuote.click();
        console.log('Navigating to next page...');
        await expect(this.quoteSumary).toContainText('Quote Summary');
        GlobalData.setCurrentPage('Quote');
    }

           
    async fillBodilyInjury(autoGraystoneData: any) {
        const bodilyInjury = autoGraystoneData.Coverages.bodilyInjuryLiability;

        if (bodilyInjury) {
            console.log(`selecting Bodily Injury Liability coverage with value: ${bodilyInjury}...`);
            await this.coverageCheckbox('Bodily Injury Liability').check();
            await this.coverageLimit('Bodily Injury Liability').selectOption(bodilyInjury);
        }
    }

    async fillPropertyDamage(autoGraystoneData: any) {
        const propertyDamage = autoGraystoneData.Coverages.propertyDamageLiability;

        if (propertyDamage) {
            console.log(`selecting Property Damage Liability with value: ${propertyDamage}`);
            await this.coverageCheckbox('Property Damage Liability').check();
            await this.coverageLimit('Property Damage Liability').selectOption(propertyDamage);
        }
    }

    async fillUninsuredMotorist(autoGraystoneData: any) {
        const uninsuredMotorist = autoGraystoneData.Coverages.uninsuredMotorist;

        if (uninsuredMotorist) {
            console.log(`selecting uninsured Motorist with value: ${uninsuredMotorist}`);
            await this.coverageCheckbox('Uninsured Motorist').check();
            await this.coverageLimit('Uninsured Motorist').selectOption(uninsuredMotorist);
        } else {
            console.log(`deselecting uninsured Motorist`);
            await this.coverageCheckbox('Uninsured Motorist').uncheck();
        }
    }

    async fillMedicalPayments(autoGraystoneData: any) {
        const medicalPayments = autoGraystoneData.Coverages.medicalPayments;

        if (medicalPayments) {
            console.log(`selecting Medical Payments with value: ${medicalPayments}`);
            await this.coverageCheckbox('Medical Payments').check();
            await this.coverageLimit('Medical Payments').selectOption(medicalPayments);
        }
    }

    async fillComprehensive(autoGraystoneData: any) {
        const comprehensive = autoGraystoneData.Coverages.comprehensive;

        if (comprehensive) {
            console.log(`selecting Comprehensive with value: ${comprehensive}`);
            await this.coverageCheckbox('Comprehensive').check();
            await this.coverageLimit('Comprehensive').selectOption(comprehensive);
        } else {
            console.log(`deselecting Comprehensive coverage`);
            await this.coverageCheckbox('Comprehensive').uncheck();
        }
    }

    async fillCollision(autoGraystoneData: any) {
        const collision = autoGraystoneData.Coverages.collision;

        if (collision) {
            console.log(`selecting collison with value: ${collision}`);
            await this.coverageCheckbox('Collision').check();
            await this.coverageLimit('Collision').selectOption(collision);
        }
    }

    async fillRentalReimbursement(autoGraystoneData: any) {
        const rentalReimbursement = autoGraystoneData.Coverages.rentalReimbursement;

        if (rentalReimbursement) {
            console.log(`selecting Rental Reimbursement with value: ${rentalReimbursement}`);
            await this.coverageCheckbox('Rental Reimbursement').check();
            await this.coverageLimit('Rental Reimbursement').selectOption(rentalReimbursement);
        }
    }

    async fillRoadSideAssistance(autoGraystoneData: any) {
        const roadSideAssistance = autoGraystoneData.Coverages.roadSideAssitance;

        if (roadSideAssistance) {
            console.log(`selecting Roadside Assistance with value: ${roadSideAssistance}`);
            await this.coverageCheckbox('Roadside Assistance').check();
        }
    }

    
}