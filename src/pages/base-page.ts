import { Page } from "playwright/test";

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
}
