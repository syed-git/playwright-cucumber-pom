import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { PolicyInfoPage } from "../../pages/policy-info-page";

Given("user removes insured {int}", async function (this: CustomWorld, insuredIndex: number) {
  const policyInfo = new PolicyInfoPage(this.page);
  await policyInfo.removeInsured(insuredIndex);
});


