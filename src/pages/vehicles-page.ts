import { Page } from 'playwright/test';
import { BasePage } from "./base-page";

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
  
    constructor(page: Page) {
        super(page);
    }

    async fillOutPage(autoGraystoneData: any) {
        // Adding drivers details
        await this.fillVehicleDetails(autoGraystoneData);
    }

    async fillOutPageAndContinue(autoGraystoneData: any) {
        console.log('user is on Vehicles page...');
        await this.fillOutPage(autoGraystoneData);
        await this.nextButton.click();
        console.log('naviagting to next page...');
    }

    async fillVehicleDetails(autoGraystoneData: any) {

        // get the number of drivers
        const numberOfVehicles = parseInt(autoGraystoneData.numberOfVehicles);

        for (let i = 1; i <= numberOfVehicles; i++) {
            console.log('clicking on Add Vehicle button...');
            await this.addVehicle.click();
            console.log(`Adding Vehicle ${i} details...`);

            // get driver object based on index
            const vehicleData = autoGraystoneData.Vehicles[`Vehicle${i}`];

            // fill out details
            console.log('Entering year...');
            await this.year.fill(vehicleData.year);
            console.log('Entering make...');
            await this.make.fill(vehicleData.make);
            console.log('Entering model...');
            await this.model.fill(vehicleData.model);
            console.log('Entering vin...');
            await this.vin.fill(vehicleData.vin);
            console.log('selecting ownership...');
            await this.ownership.selectOption(vehicleData.ownership);

            if (vehicleData.usage) {
                console.log('selecting usage....');
                await this.usage.selectOption(vehicleData.usage);
            }
            if (vehicleData.annualMileage) {
                console.log('enetring annual mileage....');
                await this.annualMileage.fill(vehicleData.annualMileage);
            }
            if (vehicleData.costNew) {
                console.log('entering cost new....');
                await this.costNew.fill(vehicleData.costNew);
            }
            if (vehicleData.primaryDriver) {
                console.log('selecting primary driver....');
                const driverNum = parseInt(vehicleData.primaryDriver);
                const driverName = `${autoGraystoneData.Drivers[`Driver${driverNum}`].firstName} ${autoGraystoneData.Drivers[`Driver${driverNum}`].lastName}`;
                console.log('<<<<<<<<<<<<>>>>>>>>>>>>>>', driverName)
                await this.primaryDriver.selectOption(driverName);
            }
            
            await this.saveVehicleButton.click();
            console.log(`vehicle${1} details saved successfully...`);
        }
        
    }
}