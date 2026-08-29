import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "playwright/test";

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  environment!: string;
  data: any = {};
  currentPage!: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);