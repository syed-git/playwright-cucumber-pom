import { Locator, Page } from "playwright/test";

export class BasePage {

    private _page: Page;

    constructor(page: Page) {
        this._page = page;
        this._page.setDefaultNavigationTimeout(90000);
        this._page.setDefaultTimeout(90000);
    }

    get page(): Page {
        return this._page;
    }
    set page(page: Page) {
        this._page = page;
    }

    /**
     * Scrolls the element to the vertical center of the viewport so it is not
     * hidden behind sticky headers/footers or floating overlays before acting on it.
     */
    protected async scrollTo(locator: Locator): Promise<void> {
        await locator.waitFor({ state: "attached" });
        await locator.evaluate((el) => el.scrollIntoView({ block: "center", inline: "center" }));
    }

    protected async safeClick(locator: Locator): Promise<void> {
        await this.scrollTo(locator);
        await locator.click();
    }

    protected async safeCheck(locator: Locator): Promise<void> {
        await this.scrollTo(locator);
        await locator.check();
    }

    protected async safeUncheck(locator: Locator): Promise<void> {
        await this.scrollTo(locator);
        await locator.uncheck();
    }

    protected async safeFill(locator: Locator, value: string): Promise<void> {
        await this.scrollTo(locator);
        await locator.fill(value);
    }

    protected async safeSelectOption(locator: Locator, value: string): Promise<void> {
        await this.scrollTo(locator);
        await locator.selectOption(value);
    }
}
