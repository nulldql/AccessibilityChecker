import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { parseArgs } from "./config.js";
import {
  filterViolations,
  meetsFailThreshold,
  printReport,
  toJson,
} from "./report.js";

function normalizeUrl(input: string): string {
  return new URL(input).toString();
}

async function scanUrl(browser: import("playwright").Browser, url: string, timeout: number) {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout });
  } catch (err) {
    await context.close();
    throw new Error(`Couldn't load ${url}: ${(err as Error).message}`);
  }

  const results = await new AxeBuilder({ page }).analyze();
  await context.close();
  return results.violations;
}

async function main() {
  let config;
  try {
    config = await parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }

  if (!config) {
    process.exit(0);
  }

  const browser = await chromium.launch();
  let shouldFail = false;
  const jsonResults: unknown[] = [];
  const scannedTargets: string[] = [];

  for (const rawUrl of config.urls) {
    let target: string;
    try {
      target = normalizeUrl(rawUrl);
    } catch {
      console.error(`"${rawUrl}" isn't a valid URL. Include the protocol, e.g. https://example.com`);
      shouldFail = true;
      continue;
    }

    let violations;
    try {
      violations = await scanUrl(browser, target, config.timeout);
    } catch (err) {
      console.error((err as Error).message);
      shouldFail = true;
      continue;
    }

    scannedTargets.push(target);

    violations = filterViolations(violations, {
      ignore: config.ignore,
      categories: config.categories,
      wcagLevel: config.wcagLevel,
    });

    if (meetsFailThreshold(violations, config.failOn)) {
      shouldFail = true;
    }

    if (config.json) {
      jsonResults.push(toJson(target, violations));
    } else {
      printReport(target, violations, config);
    }
  }

  await browser.close();

  if (config.json) {
    console.log(JSON.stringify(scannedTargets.length === 1 ? jsonResults[0] : jsonResults, null, 2));
  }

  process.exit(shouldFail ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
