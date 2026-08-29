module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["src/support/**/*.ts", "src/pages/**/*.ts", "src/step-definitions/**/*.ts"],
    paths: ["src/features/**/*.feature"],
    format: [
      "progress-bar",
      ["message", "reports/cucumber-messages.ndjson"],
      ["html", "repports/html-formatter.html"],
      ["json", "reports/cucumber-report.json"],
    ],
    retry: 1,
    retryTagFilter: "@flaky",
    publishQuiet: true,
    timeout: 60000,
    
  }
};