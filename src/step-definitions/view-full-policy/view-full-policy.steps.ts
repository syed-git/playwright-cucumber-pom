import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { ViewFullPolicyPage } from "../../pages/view-full-policy-page";
import { GlobalData } from "../../support/global-data";

Given("user initiates the policy change", async function (this: CustomWorld) {
  const autoGraystoneData = GlobalData.getData();
  const viewFullPolicy = new ViewFullPolicyPage(this.page);
  await viewFullPolicy.initiatePolicyChange(autoGraystoneData);
});

Given("user initiates {string} policy cancellation", async function (this: CustomWorld, cancellationType: string) {
  const autoGraystoneData = GlobalData.getData();
  const viewFullPolicy = new ViewFullPolicyPage(this.page);
  await viewFullPolicy.initiatePolicyCancellation(cancellationType, autoGraystoneData);
});

Given("user reinstate the policy", async function (this: CustomWorld) {
  const viewFullPolicy = new ViewFullPolicyPage(this.page);
  await viewFullPolicy.reinstatePolicy();
});

