import { Page } from 'playwright/test';
import { BasePage } from "./base-page";
import { expect } from '../support/hooks';
import { GlobalData } from '../support/global-data';

export class VehiclesPage extends BasePage {

    protected addVehicle = this.page.getByRole('button', { name: '+ Add Vehicle' });
    protected year = this.page.locator('//label[text()="Year *"]//following-sibling::input');
    protected make = this.page.locator('//label[text()="Make *"]//following-sibling::input');
    protected model = this.page.locator('//label[text()="Model *"]//following-sibling::input');
    protected vin = this.page.locator('//label[text()="VIN *"]//following-sibling::input');
    protected ownership = this.page.locator('//label[text()="Ownership *"]//following-sibling::select');
    protected usage =this.page.locator('//label[text()="Usage"]//following-sibling::select');
    protected annualMileage = this.page.locator('//label[text()="Annual Mileage"]//following-sibling::input');
    protected costNew = this.page.locator('//label[text()="Cost New ($)"]//following-sibling::input');
    protected primaryDriver =this.page.locator('//label[text()="Primary Driver"]//following-sibling::select');
    protected saveVehicleButton = this.page.getByRole('button', { name: 'Save Vehicle' });
    protected nextButton = this.page.getByRole('button', { name: 'Next →' });
    protected pageName = this.page.locator('div[class=panel-header]').first();

    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(autoGraystoneData: any) {
        // Adding drivers details
        console.log(`filling out the ${GlobalData.currentPage()} page....`);
        await this.fillVehicleDetails(autoGraystoneData);
        console.log('Vehicles page filled out successfully...');
        console.log(`'${GlobalData.currentPage()} page filled successfully...`);
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        await this.fillOutPage(autoGraystoneData);
        await this.safeClick(this.nextButton);
        console.log('naviagting to next page...');
        await expect(this.pageName).toContainText('Coverages');
        console.log('user is on Coverages page...');
        GlobalData.setCurrentPage('Coverages');
    }

    async fillVehicleDetails(autoGraystoneData: any) {

        // get the number of drivers
        const numberOfVehicles = parseInt(autoGraystoneData.numberOfVehicles);

        for (let i = 1; i <= numberOfVehicles; i++) {
            console.log('clicking on Add Vehicle button...');
            await this.safeClick(this.addVehicle);
            console.log(`Adding Vehicle ${i} details...`);

            // get driver object based on index
            const vehicleData = autoGraystoneData.Vehicles[`Vehicle${i}`];

            // fill out details
            console.log('Entering year...');
            await this.safeFill(this.year, vehicleData.year);
            console.log('Entering make...');
            await this.safeFill(this.make, vehicleData.make);
            console.log('Entering model...');
            await this.safeFill(this.model, vehicleData.model);
            console.log('Entering vin...');
            await this.safeFill(this.vin, vehicleData.vin);
            console.log('selecting ownership...');
            await this.safeSelectOption(this.ownership, vehicleData.ownership);

            if (vehicleData.usage) {
                console.log('selecting usage....');
                await this.safeSelectOption(this.usage, vehicleData.usage);
            }
            if (vehicleData.annualMileage) {
                console.log('enetring annual mileage....');
                await this.safeFill(this.annualMileage, vehicleData.annualMileage);
            }
            if (vehicleData.costNew) {
                console.log('entering cost new....');
                await this.safeFill(this.costNew, vehicleData.costNew);
            }
            if (vehicleData.primaryDriver) {
                console.log('selecting primary driver....');
                const driverNum = parseInt(vehicleData.primaryDriver);
                const driverName = `${autoGraystoneData.Drivers[`Driver${driverNum}`].firstName} ${autoGraystoneData.Drivers[`Driver${driverNum}`].lastName}`;
                console.log('<<<<<<<<<<<<>>>>>>>>>>>>>>', driverName)
                await this.safeSelectOption(this.primaryDriver, driverName);
            }
            
            await this.safeClick(this.saveVehicleButton);
            console.log(`vehicle${1} details saved successfully...`);
        }
        
    }
}