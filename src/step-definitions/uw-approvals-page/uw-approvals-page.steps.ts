import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { UWApprovalsPage } from "../../pages/uw-approvals-page";

Given("user approves all the underwriting issues", async function (this: CustomWorld) {
  const uwApproval = new UWApprovalsPage(this.page);
  await uwApproval.approvaAllUnderwritingIssues();
});

