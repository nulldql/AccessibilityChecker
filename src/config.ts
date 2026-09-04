import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { WcagLevel } from "./wcag.js";

export type Severity = "minor" | "moderate" | "serious" | "critical";

export const SEVERITY_ORDER: Severity[] = ["minor", "moderate", "serious", "critical"];
export const WCAG_LEVELS: WcagLevel[] = ["A", "AA", "AAA"];

export type Config = {
  urls: string[];
  json: boolean;
  verbose: boolean;
  color: boolean;
  failOn: Severity;
  ignore: string[];
  categories: string[];
  wcagLevel: WcagLevel | null;
  timeout: number;
};

const DEFAULTS: Omit<Config, "urls"> = {
  json: false,
  verbose: false,
  color: true,
  failOn: "minor",
  ignore: [],
  categories: [],
  wcagLevel: null,
  timeout: 30000,
};

type FileConfig = Partial<Omit<Config, "urls">>;

function isSeverity(value: string): value is Severity {
  return (SEVERITY_ORDER as string[]).includes(value);
}

function isWcagLevel(value: string): value is WcagLevel {
  return (WCAG_LEVELS as string[]).includes(value);
}

export function validateFileConfig(config: FileConfig): void {
  if (config.failOn !== undefined && !isSeverity(config.failOn)) {
    throw new Error(
      `.plaina11yrc.json: "failOn" must be one of ${SEVERITY_ORDER.join(", ")}, got "${config.failOn}"`,
    );
  }
  if (config.wcagLevel !== undefined && config.wcagLevel !== null && !isWcagLevel(config.wcagLevel)) {
    throw new Error(
      `.plaina11yrc.json: "wcagLevel" must be one of ${WCAG_LEVELS.join(", ")}, got "${config.wcagLevel}"`,
    );
  }
  if (config.timeout !== undefined) {
    const value = config.timeout;
    if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
      throw new Error(`.plaina11yrc.json: "timeout" must be a positive number of milliseconds, got ${JSON.stringify(value)}`);
    }
  }
  if (config.ignore !== undefined && (!Array.isArray(config.ignore) || !config.ignore.every((v) => typeof v === "string"))) {
    throw new Error(`.plaina11yrc.json: "ignore" must be an array of rule id strings`);
  }
  if (
    config.categories !== undefined &&
    (!Array.isArray(config.categories) || !config.categories.every((v) => typeof v === "string"))
  ) {
    throw new Error(`.plaina11yrc.json: "categories" must be an array of category name strings`);
  }
  if (config.json !== undefined && typeof config.json !== "boolean") {
    throw new Error(`.plaina11yrc.json: "json" must be true or false`);
  }
  if (config.verbose !== undefined && typeof config.verbose !== "boolean") {
    throw new Error(`.plaina11yrc.json: "verbose" must be true or false`);
  }
  if (config.color !== undefined && typeof config.color !== "boolean") {
    throw new Error(`.plaina11yrc.json: "color" must be true or false`);
  }
}

async function loadConfigFile(): Promise<FileConfig> {
  const path = resolve(process.cwd(), ".plaina11yrc.json");
  let parsed: FileConfig;
  try {
    const raw = await readFile(path, "utf-8");
    parsed = JSON.parse(raw) as FileConfig;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") return {};
    throw new Error(`couldn't read .plaina11yrc.json: ${err instanceof Error ? err.message : String(err)}`);
  }
  validateFileConfig(parsed);
  return parsed;
}

export function printHelp() {
  console.log(`
plain-a11y <url> [urls...] [options]

Options:
  --json               Output machine-readable JSON instead of a report
  --verbose            Show every affected element, not just one example
  --no-color           Disable ANSI colors in the report
  --fail-on <level>    Only exit non-zero for this severity or above
                        (minor | moderate | serious | critical, default: minor)
  --ignore <ruleId>    Skip a specific axe-core rule (repeatable)
  --category <name>    Only report this category (repeatable), e.g. "Images"
  --wcag-level <level> Only report issues tagged at this WCAG level (A | AA | AAA)
  --timeout <ms>       Page load timeout in milliseconds (default: 30000)
  --list-rules         Print every rule id this tool understands and exit
  --help               Show this message
  --version            Print the installed version

Config file:
  Any of the above (except urls) can be set as defaults in a
  .plaina11yrc.json file in the current directory. CLI flags win
  over the config file.

Examples:
  plain-a11y https://example.com
  plain-a11y https://example.com --json > report.json
  plain-a11y https://a.com https://b.com --fail-on serious
  plain-a11y https://example.com --category Forms --category Images
  plain-a11y https://example.com --wcag-level AA
`);
}

export async function readPackageVersion(): Promise<string> {
  const pkg = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf-8"),
  );
  return pkg.version;
}

export async function parseArgs(argv: string[]): Promise<Config | null> {
  const fileConfig = await loadConfigFile();
  const urls: string[] = [];
  let json = fileConfig.json ?? DEFAULTS.json;
  let verbose = fileConfig.verbose ?? DEFAULTS.verbose;
  let color = fileConfig.color ?? DEFAULTS.color;
  let failOn = fileConfig.failOn ?? DEFAULTS.failOn;
  let timeout = fileConfig.timeout ?? DEFAULTS.timeout;
  let wcagLevel = fileConfig.wcagLevel ?? DEFAULTS.wcagLevel;
  const ignore = [...(fileConfig.ignore ?? DEFAULTS.ignore)];
  const categories = [...(fileConfig.categories ?? DEFAULTS.categories)];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      return null;
    }
    if (arg === "--version" || arg === "-v") {
      console.log(await readPackageVersion());
      return null;
    }
    if (arg === "--list-rules") {
      const { knownRuleIds } = await import("./rules/index.js");
      for (const id of knownRuleIds()) console.log(id);
      return null;
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--verbose") {
      verbose = true;
      continue;
    }
    if (arg === "--no-color") {
      color = false;
      continue;
    }
    if (arg === "--fail-on") {
      const value = argv[++i];
      if (!value || !isSeverity(value)) {
        throw new Error(`--fail-on needs one of: ${SEVERITY_ORDER.join(", ")}`);
      }
      failOn = value;
      continue;
    }
    if (arg === "--ignore") {
      const value = argv[++i];
      if (!value) throw new Error("--ignore needs a rule id");
      ignore.push(value);
      continue;
    }
    if (arg === "--category") {
      const value = argv[++i];
      if (!value) throw new Error("--category needs a category name");
      categories.push(value);
      continue;
    }
    if (arg === "--wcag-level") {
      const value = argv[++i];
      if (!value || !isWcagLevel(value)) {
        throw new Error(`--wcag-level needs one of: ${WCAG_LEVELS.join(", ")}`);
      }
      wcagLevel = value;
      continue;
    }
    if (arg === "--timeout") {
      const value = argv[++i];
      const parsed = Number(value);
      if (!value || Number.isNaN(parsed) || parsed <= 0) {
        throw new Error("--timeout needs a positive number of milliseconds");
      }
      timeout = parsed;
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    urls.push(arg);
  }

  if (urls.length === 0) {
    printHelp();
    return null;
  }

  return { urls, json, verbose, color, failOn, ignore, categories, wcagLevel, timeout };
}
