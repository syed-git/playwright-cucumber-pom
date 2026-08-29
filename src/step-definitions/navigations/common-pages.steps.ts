import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { PolicyInfoPage } from "../../pages/policy-info-page";
import { DriversPage } from "../../pages/drivers-page";
import { Navigator } from "../../pages/navigator";
import { GlobalData } from "../../support/global-data";
import { VehiclesPage } from "../../pages/vehicles-page";
import { CoveragesPage } from "../../pages/coverages-page";
import { QuotePage } from "../../pages/quote-page";
import { ReviewPage } from "../../pages/review-page"
import { RsikAnalysisPage } from "../../pages/risk-analysis-page";
import { PolicySummaryPage } from "../../pages/policy-summary-page";
import { ViewFullPolicyPage } from "../../pages/view-full-policy-page";

const pages: any = {
  "Policy Info": PolicyInfoPage,
  "Drivers": DriversPage,
  "Vehicles": VehiclesPage,
  "Coverages": CoveragesPage,
  "Quote": QuotePage,
  "Review": ReviewPage,
  "Risk Analysis": RsikAnalysisPage,
  "Policy Summary": PolicySummaryPage,
  "View Full Policy": ViewFullPolicyPage
};


When("user navigates from {string} to {string} page", async function (this: CustomWorld, startPage: string, targetPage: string) {
    const autoGraystoneData = GlobalData.getData();
    const pageNames = Object.keys(pages);
    const targetIndex = pageNames.indexOf(targetPage);
    const prevPage = pageNames[targetIndex - 1];
    const navigator = new Navigator(this.page, [PolicyInfoPage, DriversPage, VehiclesPage, CoveragesPage, QuotePage, ReviewPage, RsikAnalysisPage, PolicySummaryPage, ViewFullPolicyPage]);
    await navigator.navigate(pages[startPage], pages[prevPage], autoGraystoneData);
});

When("user fills the {string} page", async function (this: CustomWorld, pageName: string) {
    const autoGraystoneData = GlobalData.getData();
    const navigator = new Navigator(this.page, [PolicyInfoPage, DriversPage, VehiclesPage, CoveragesPage, QuotePage, ReviewPage, RsikAnalysisPage, PolicySummaryPage, ViewFullPolicyPage]);
    await navigator.fillOutCurrentPage(pages[pageName], autoGraystoneData);
});

When("user navigates to {string} tab", async function (this: CustomWorld, tabName: string) {
    const autoGraystoneData = GlobalData.getData();
    const navigator = new Navigator(this.page, [PolicyInfoPage, DriversPage, VehiclesPage, CoveragesPage, QuotePage, ReviewPage, RsikAnalysisPage, PolicySummaryPage, ViewFullPolicyPage]);
    await navigator.navigateTo(tabName);
});

