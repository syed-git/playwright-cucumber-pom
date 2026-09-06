import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { PolicyInfoPage } from "../../pages/policy-info-page";
import { GlobalData } from "../../support/global-data";

Given("user removes insured {int}", async function (this: CustomWorld, insuredIndex: number) {
  const autoGraystoneData = GlobalData.getData();
  const policyInfo = new PolicyInfoPage(this.page);
  await policyInfo.removeInsured(insuredIndex);
});


