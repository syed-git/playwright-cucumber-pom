import { When } from "@cucumber/cucumber";
import { PoliciesPage } from "../../pages/policies-page";
import { CustomWorld } from "../../support/world";

When("user retrieves the policy", async function (this: CustomWorld) {
  const policiesPage = new PoliciesPage(this.page);
  await policiesPage.retrievePolicy();
});

