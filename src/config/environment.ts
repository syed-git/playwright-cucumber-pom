// export interface EnvironmentConfig {
//   baseUrl: string;
//   headless: boolean;
// }

// const environments: Record<string, EnvironmentConfig> = {
//   dev: {
//     baseUrl: "https://www.saucedemo.com",
//     headless: true
//   },
//   qa: {
//     baseUrl: "http://localhost:5173/login",
//     headless: true
//   }
// };

// const environmentName = process.env.ENV || "qa";
// const selected = environments[environmentName];

// if (!selected) {
//   throw new Error(`Unknown environment: ${environmentName}`);
// }

// export const environment = {
//   name: environmentName,
//   ...selected,
//   headless: process.env.HEADLESS
//     ? process.env.HEADLESS.toLowerCase() === "true"
//     : selected.headless
// };