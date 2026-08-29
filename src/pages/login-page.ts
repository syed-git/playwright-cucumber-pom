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
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.page).toHaveTitle(/PolicyCenter — Personal Auto/); 
  }

  async logout () {
    await this.logoutButton.click();
    await expect(this.loginButton).toBeVisible();
  }
}