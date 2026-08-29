import { When } from "@cucumber/cucumber";
import { HomePage } from "../../pages/home-page";
import { CustomWorld } from "../../support/world";

When("user initiates a new submission", async function (this: CustomWorld) {
  const home = new HomePage(this.page);
  await home.clickNewSubmission();
});

