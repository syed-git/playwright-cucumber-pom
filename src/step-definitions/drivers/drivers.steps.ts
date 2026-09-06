import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { DriversPage } from "../../pages/drivers-page";

Given("user removes driver {int}", async function (this: CustomWorld, insuredIndex: number) {
  const driverPage = new DriversPage(this.page);
  await driverPage.removeDriver(insuredIndex);
});


