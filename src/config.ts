import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export type Severity = "minor" | "moderate" | "serious" | "critical";

export const SEVERITY_ORDER: Severity[] = ["minor", "moderate", "serious", "critical"];

export type Config = {
  urls: string[];
  json: boolean;
  verbose: boolean;
  color: boolean;
  failOn: Severity;
  ignore: string[];
  timeout: number;
};

const DEFAULTS: Omit<Config, "urls"> = {
  json: false,
  verbose: false,
  color: true,
  failOn: "minor",
  ignore: [],
  timeout: 30000,
};

type FileConfig = Partial<Omit<Config, "urls">>;

async function loadConfigFile(): Promise<FileConfig> {
  const path = resolve(process.cwd(), ".plaina11yrc.json");
  try {
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw) as FileConfig;
  } catch {
    return {};
  }
}

function isSeverity(value: string): value is Severity {
  return (SEVERITY_ORDER as string[]).includes(value);
}

export function printHelp() {
  console.log(`
plain-a11y <url> [urls...] [options]

Options:
  --json              Output machine-readable JSON instead of a report
  --verbose           Show every affected element, not just one example
  --no-color          Disable ANSI colors in the report
  --fail-on <level>   Only exit non-zero for this severity or above
                       (minor | moderate | serious | critical, default: minor)
  --ignore <ruleId>   Skip a specific axe-core rule (repeatable)
  --timeout <ms>      Page load timeout in milliseconds (default: 30000)
  --help              Show this message
  --version           Print the installed version

Config file:
  Any of the above (except urls) can be set as defaults in a
  .plaina11yrc.json file in the current directory. CLI flags win
  over the config file.

Examples:
  plain-a11y https://example.com
  plain-a11y https://example.com --json > report.json
  plain-a11y https://a.com https://b.com --fail-on serious
  plain-a11y https://example.com --ignore color-contrast --verbose
`);
}

export async function parseArgs(argv: string[]): Promise<Config | null> {
  const fileConfig = await loadConfigFile();
  const urls: string[] = [];
  let json = fileConfig.json ?? DEFAULTS.json;
  let verbose = fileConfig.verbose ?? DEFAULTS.verbose;
  let color = fileConfig.color ?? DEFAULTS.color;
  let failOn = fileConfig.failOn ?? DEFAULTS.failOn;
  let timeout = fileConfig.timeout ?? DEFAULTS.timeout;
  const ignore = [...(fileConfig.ignore ?? DEFAULTS.ignore)];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      return null;
    }
    if (arg === "--version" || arg === "-v") {
      const pkg = JSON.parse(
        await readFile(new URL("../package.json", import.meta.url), "utf-8"),
      );
      console.log(pkg.version);
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

  return { urls, json, verbose, color, failOn, ignore, timeout };
}
