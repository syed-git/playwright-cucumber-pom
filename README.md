# Basic BDD Cucumber + Playwright + TypeScript + POM

This framework demonstrates:

- Playwright for browser automation
- Cucumber for BDD
- TypeScript
- Page Object Model
- Step definitions organized by page name
- Page classes organized by page name
- `fillOutCurrentPage()` and `fillOutCurrentPageAndContinue()` methods
- Environment configuration
- Cucumber HTML/JSON reporting
- Screenshot attachment on failure
- A basic `PageNavigator`

## Folder structure

```text
playwright-cucumber-pom/
├── cucumber.js
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── config/
    │   └── environment.ts
    ├── features/
    │   └── login.feature
    ├── pages/
    │   ├── LoginPage.ts
    │   ├── ProductsPage.ts
    │   └── PageNavigator.ts
    ├── step-definitions/
    │   ├── LoginPage/
    │   │   └── login.steps.ts
    │   └── ProductsPage/
    │       └── products.steps.ts
    └── support/
        ├── hooks.ts
        ├── report.ts
        └── world.ts
```

## Install

```bash
npm install
npx playwright install
```

## Run tests

```bash
npm test
```

Filter by tags and/or run in parallel:

```bash
npm run test -- --tags "@currentDatePolicy"
npm run test -- --tags "@smoke" --parallel 3
```

Every run generates a timestamped HTML dashboard under `reports/dashboard/`
(plus a stable `execution-report-latest.html` copy). To regenerate the
dashboard from the last run without re-running tests:

```bash
npm run report:latest
```

Headed:

```bash
npm run test:headed
```

Specific environment:

```bash
cross-env ENV=qa npm test
```

## Add a new page

For example, create:

```text
src/pages/CheckoutPage.ts
src/step-definitions/CheckoutPage/checkout.steps.ts
```

Keep the step definitions and page object grouped by the same page name.

## Page object convention

Each page should expose:

```ts
async fillOutCurrentPage(): Promise<void> {
  // fill fields on this page
}

async fillOutCurrentPageAndContinue(): Promise<void> {
  await this.fillOutCurrentPage();
  // click Next/Continue
}
```

For pages with parameters:

```ts
async fillOutCurrentPage(name: string): Promise<void> {
  // fill fields
}

async fillOutCurrentPageAndContinue(name: string): Promise<void> {
  await this.fillOutCurrentPage(name);
  // continue
}
```

## Notes

The sample uses Sauce Demo so the framework can be executed immediately. Replace the URL and locators in the page classes with your application under test.
