import { Page } from "playwright/test";
import { GlobalData } from "../support/global-data";
import { expect } from "../support/hooks";

/**
 * Navigator navigates from a start page to a target page,
 * following the pre-defined page order. Each page must implement
 * `fillOutPageAndContinue(data)` to fill and proceed to the next page.
 *
 * Usage:
 * const navigator = new Navigator(page, [LoginPage, PolicyPage, ReviewPage]);
 * await navigator.navigate(LoginPage, ReviewPage, data);
 */
export class Navigator {
  readonly page: Page;
  private pageOrder: Array<any>;

  constructor(page: Page, pageOrder: Array<any>) {
    this.page = page;
    this.pageOrder = pageOrder;
  }

  async fillOutDataAndNavigate(startPageClass: any, targetPageClass: any, data: Record<string, any> = {}) {
    const startIdx = this.pageOrder.indexOf(startPageClass);
    const targetIdx = this.pageOrder.indexOf(targetPageClass);

    if (startIdx === -1) {
      throw new Error(`Start page ${startPageClass.name} not found in page order`);
    }
    if (targetIdx === -1) {
      throw new Error(`Target page ${targetPageClass.name} not found in page order`);
    }
    if (startIdx > targetIdx) {
      throw new Error(`Start page must come before target page in the order`);
    }

    // Navigate from start to target (inclusive)
    for (let i = startIdx; i <= targetIdx; i++) {
      const PageClass = this.pageOrder[i];
      const pageObj = new PageClass(this.page);

      if (typeof pageObj.fillOutPageAndContinue !== "function") {
        throw new Error(
          `Page ${PageClass.name || "<unknown>"} must implement fillOutPageAndContinue(data)`
        );
      }

      await pageObj.fillOutPageAndContinue(data);
    }
  }

  async navigate(startPageClass: any, targetPageClass: any) {
    const startIdx = this.pageOrder.indexOf(startPageClass);
    const targetIdx = this.pageOrder.indexOf(targetPageClass);

    if (startIdx === -1) {
      throw new Error(`Start page ${startPageClass.name} not found in page order`);
    }
    if (targetIdx === -1) {
      throw new Error(`Target page ${targetPageClass.name} not found in page order`);
    }
    if (startIdx > targetIdx) {
      throw new Error(`Start page must come before target page in the order`);
    }

    // Navigate from start to target (inclusive)
    for (let i = startIdx; i <= targetIdx; i++) {
      const PageClass = this.pageOrder[i];
      const pageObj = new PageClass(this.page);

      if (typeof pageObj.clickOnNext !== "function") {
        throw new Error(
          `Page ${PageClass.name || "<unknown>"} must implement clickOnNext()`
        );
      }

      await pageObj.clickOnNext();
    }
  }

  async fillOutCurrentPage(pageClass: any, data: Record<string, any> = {}) {
    const currentPage = this.pageOrder.indexOf(pageClass);
    
    if (currentPage === -1) {
      throw new Error(`Current page ${pageClass.name} not found in page order`);
    }
    const PageClass = this.pageOrder[currentPage];
    const pageObj = new PageClass(this.page);
    await pageObj.fillOutPage(data);
  }

  
  async navigateTo(tabName: string) {
    const tabLink = this.page.getByRole('link', { name: tabName}).first();
    await tabLink.waitFor({ state: "attached" });
    await tabLink.evaluate((el) => el.scrollIntoView({ block: "center", inline: "center" }));
    await tabLink.click();
    await expect(this.page.getByRole('heading', { name: tabName})).toBeVisible();
  }

  async searchTransaction(transaction: string) {
    const searchInput = this.page.getByPlaceholder('Search by policy number');
    let transactionNumber = '';
    if (transaction === "submission") {
      transactionNumber = GlobalData.getSubmissionNumber();
    } else if (transaction === "policy") {
      transactionNumber = GlobalData.getPolicyNumber();
    }
    await searchInput.pressSequentially(transactionNumber, { delay: 100 });
    const result = this.page.locator(`//span[text()="${transactionNumber}"]`).first();
    await expect(result).toBeVisible();
    console.log(`transaction: ${transactionNumber} found....`);
    await result.click();
    await expect(this.page.getByText(transactionNumber)).toBeVisible();
  }

}
