import { Given, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { mergeWithDefaults } from "../../support/test-data-schema";
import { GlobalData } from "../../support/global-data";
import moment from 'moment';

/**
 * Helper to set a value deep in an object using dotted paths.
 * e.g., "Insured.NamedInsured1.firstName" -> {Insured: {NamedInsured1: {firstName: value}}}
 */
function setDeep(obj: any, pathStr: string, val: any) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === parts.length - 1) {
      cur[p] = val;
    } else {
      if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {};
      cur = cur[p];
    }
  }
}

Given("user sets {string} to {string}", async function (this: CustomWorld, key: string, value: string) {
  setDeep(this.data, key, value);
  console.log(`setting ${key} to ${value}`);
});

Given("user sets {string} to past {int} days", async function (this: CustomWorld, key: string, days: number) {
  if (key.includes('effectiveDate')) {
    const value = moment().subtract(days, 'days').format('YYYY-MM-DD');
    setDeep(this.data, key, value);
    console.log(`setting ${key} to ${value}`);
  }
});

Then("user requests the graystoneData", async function (this: CustomWorld) {
  const testData = mergeWithDefaults(this.data);
  
  // Store in global data
  GlobalData.setData(testData);
  console.log(`Data requested`, JSON.stringify(testData, null, 2));
});

Then("I retrieve value for key {string}", async function (this: CustomWorld, key: string) {
  const value = GlobalData.getValue(key);
  console.log(`Retrieved value for "${key}": ${value}`);
});
