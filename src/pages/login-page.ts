import { Locator, Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from '../support/hooks';

export class LoginPage extends BasePage {

  protected usernameInput: Locator = this.page.getByPlaceholder("Enter username");;
  protected passwordInput: Locator = this.page.getByPlaceholder("Enter password");;
  protected loginButton: Locator = this.page.getByRole("button", { name: "Sign In" });
  protected logoutButton: Locator = this.page.getByRole("button", { name: "Sign Out" });
  
  constructor(page: Page) {
    super(page);
  }

  async loginAs(username: string, password: string, baseUrl: string) {
    await this.page.goto(baseUrl, { waitUntil: "networkidle" });
    await this.safeFill(this.usernameInput, username);
    await this.safeFill(this.passwordInput, password);
    await this.safeClick(this.loginButton);
    await expect(this.page).toHaveTitle(/PolicyCenter — Personal Auto/); 
  }

  async logout () {
    await this.safeClick(this.logoutButton);
    await expect(this.loginButton).toBeVisible();
  }
}