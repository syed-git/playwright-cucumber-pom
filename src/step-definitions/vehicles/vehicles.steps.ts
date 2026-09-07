import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { VehiclesPage } from "../../pages/vehicles-page";

Given("user removes vehicle {int}", async function (this: CustomWorld, insuredIndex: number) {
  const vehiclesPage = new VehiclesPage(this.page);
  await vehiclesPage.removeVehicle(insuredIndex);
});


