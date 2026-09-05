import { Locator, Page } from "playwright/test";
import { BasePage } from "./base-page";
import { expect } from '../support/hooks';

export class LoginPage extends BasePage {

  protected usernameInput: Locator = this.page.getByPlaceholder("Enter username");;
  protected passwordInput: Locator = this.page.getByPlaceholder("Enter password");;
  protected loginButton: Locator = this.page.getByRole("button", { name: "Sign In" });
  protected logoutButton: Locator = this.page.getByTitle("Sign out");
  
  constructor(page: Page) {
    super(page);
  }

  async loginAs(username: string, password: string, baseUrl: string) {
    console.log(`Logging in with url: ${baseUrl}, username: ${username}`);
    await this.page.goto(baseUrl, { waitUntil: "networkidle" });
    console.log(`Filling username and password...`);
    await this.safeFill(this.usernameInput, username);
    await this.safeFill(this.passwordInput, password);
    console.log(`Clicking on login button...`);
    await this.safeClick(this.loginButton);
    console.log(`Waiting for the page to load...`);
    await expect(this.page).toHaveTitle(/PolicyCenter — Personal Auto/);
    console.log(`Login successful for user: ${username}`); 
  }

  async logout () {
    console.log(`Logging out from policy center...`);
    await this.safeClick(this.logoutButton);
    await expect(this.loginButton).toBeVisible();
    console.log(`Logout successful...`);
  }
}