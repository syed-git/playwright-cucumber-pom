import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { CoveragesPage } from "../../pages/coverages-page";

Given("verify total premium as sum of individual coverages", async function (this: CustomWorld) {
  const coveragePage = new CoveragesPage(this.page);
  await coveragePage.verifyTotalPremium();
});


