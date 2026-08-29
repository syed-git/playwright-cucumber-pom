import { When } from "@cucumber/cucumber";
import * as fs from "fs";
import * as path from "path";
import { LoginPage } from "../../pages/login-page";
import { CustomWorld } from "../../support/world";
const environment = process.env.ENV || "uat1";
const envDetails = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, `../../config/${environment}.json`), "utf-8")
);

When("{string} logs in to policy center", async function (this: CustomWorld, userRole: string) {
  const loginPage = new LoginPage(this.page);
  const baseUrl = envDetails.baseUrl;
  const userName = envDetails[userRole].username;
  const password = envDetails[userRole].password;
  await loginPage.loginAs(userName, password, baseUrl);
});

When("user logs out from policy center", async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.logout();
});

