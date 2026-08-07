import type { Result } from "axe-core";
import { categoryOrder, translate, type Category } from "./rules/index.js";
import { criteriaFromTags, formatCriteria, type WcagLevel } from "./wcag.js";
import { SEVERITY_ORDER, type Config, type Severity } from "./config.js";

type AxeViolation = Result;

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";

const IMPACT_COLOR: Record<string, string> = {
  critical: RED,
  serious: RED,
  moderate: YELLOW,
  minor: CYAN,
};

function style(code: string, useColor: boolean): string {
  return useColor ? code : "";
}

function groupByCategory(violations: AxeViolation[]) {
  const groups = new Map<Category, AxeViolation[]>();
  for (const violation of violations) {
    const plain = translate(violation.id, violation.help);
    const list = groups.get(plain.category) ?? [];
    list.push(violation);
    groups.set(plain.category, list);
  }
  return groups;
}

export function filterViolations(
  violations: AxeViolation[],
  options: { ignore?: string[]; categories?: string[]; wcagLevel?: WcagLevel | null },
): AxeViolation[] {
  const ignore = new Set(options.ignore ?? []);
  const categories = new Set(options.categories ?? []);
  const wcagLevel = options.wcagLevel ?? null;

  return violations.filter((v) => {
    if (ignore.has(v.id)) return false;

    if (categories.size > 0) {
      const plain = translate(v.id, v.help);
      if (!categories.has(plain.category)) return false;
    }

    if (wcagLevel) {
      const criteria = criteriaFromTags(v.tags ?? []);
      if (!criteria.some((c) => c.level === wcagLevel)) return false;
    }

    return true;
  });
}

export function severityCounts(violations: AxeViolation[]): Record<Severity, number> {
  const counts: Record<Severity, number> = {
    minor: 0,
    moderate: 0,
    serious: 0,
    critical: 0,
  };
  for (const violation of violations) {
    const impact = (violation.impact ?? "minor") as Severity;
    if (impact in counts) counts[impact] += 1;
  }
  return counts;
}

export function worstSeverity(violations: AxeViolation[]): Severity | null {
  let worst: Severity | null = null;
  for (const violation of violations) {
    const impact = (violation.impact ?? "minor") as Severity;
    if (!worst || SEVERITY_ORDER.indexOf(impact) > SEVERITY_ORDER.indexOf(worst)) {
      worst = impact;
    }
  }
  return worst;
}

export function meetsFailThreshold(violations: AxeViolation[], failOn: Severity): boolean {
  const threshold = SEVERITY_ORDER.indexOf(failOn);
  return violations.some((v) => SEVERITY_ORDER.indexOf((v.impact ?? "minor") as Severity) >= threshold);
}

export function toJson(url: string, violations: AxeViolation[]) {
  return {
    url,
    issueCount: violations.length,
    elementCount: violations.reduce((sum, v) => sum + v.nodes.length, 0),
    severityCounts: severityCounts(violations),
    issues: violations.map((violation) => {
      const plain = translate(violation.id, violation.help);
      const criteria = criteriaFromTags(violation.tags ?? []);
      return {
        ruleId: violation.id,
        category: plain.category,
        title: plain.title,
        why: plain.why,
        fix: plain.fix,
        impact: violation.impact ?? "minor",
        helpUrl: violation.helpUrl,
        wcag: criteria,
        elements: violation.nodes.map((n) => ({ html: n.html, target: n.target })),
      };
    }),
  };
}

export function printReport(url: string, violations: AxeViolation[], config: Config) {
  const color = config.color;
  const lines: string[] = [];

  const c = (code: string) => style(code, color);

  lines.push("");
  lines.push(`${c(BOLD)}plain-a11y:${c(RESET)} accessibility report`);
  lines.push(`${c(DIM)}${url}${c(RESET)}`);
  lines.push("");

  if (violations.length === 0) {
    lines.push(`${c(GREEN)}No issues found by the checks this tool runs.${c(RESET)}`);
    lines.push(`${c(DIM)}That doesn't mean the page is fully accessible, automated tools only catch part of it.${c(RESET)}`);
    lines.push("");
    console.log(lines.join("\n"));
    return;
  }

  const totalElements = violations.reduce((sum, v) => sum + v.nodes.length, 0);
  const counts = severityCounts(violations);
  const summary = SEVERITY_ORDER
    .slice()
    .reverse()
    .filter((sev) => counts[sev] > 0)
    .map((sev) => `${c(IMPACT_COLOR[sev])}${counts[sev]} ${sev}${c(RESET)}`)
    .join(", ");

  lines.push(
    `${c(BOLD)}${violations.length}${c(RESET)} issue type${violations.length === 1 ? "" : "s"} found, affecting ${c(BOLD)}${totalElements}${c(RESET)} element${totalElements === 1 ? "" : "s"}. (${summary})`,
  );
  lines.push("");

  const groups = groupByCategory(violations);

  for (const category of categoryOrder()) {
    const items = groups.get(category);
    if (!items || items.length === 0) continue;

    lines.push(`${c(BOLD)}${category}${c(RESET)}`);

    for (const violation of items) {
      const plain = translate(violation.id, violation.help);
      const impact = violation.impact ?? "minor";
      const impactColor = c(IMPACT_COLOR[impact] ?? CYAN);
      const criteria = criteriaFromTags(violation.tags ?? []);

      lines.push(
        `  ${impactColor}●${c(RESET)} ${plain.title} ${c(DIM)}(${impact}, ${violation.nodes.length} element${violation.nodes.length === 1 ? "" : "s"}, rule: ${violation.id})${c(RESET)}`,
      );
      lines.push(`    ${plain.why}`);
      lines.push(`    ${c(DIM)}Fix:${c(RESET)} ${plain.fix}`);
      if (criteria.length > 0) {
        lines.push(`    ${c(DIM)}WCAG:${c(RESET)} ${formatCriteria(criteria)}`);
      }

      const nodesToShow = config.verbose ? violation.nodes : violation.nodes.slice(0, 1);
      for (const node of nodesToShow) {
        const snippet = node.html.length > 100 ? node.html.slice(0, 100) + "…" : node.html;
        lines.push(`    ${c(DIM)}Example: ${snippet}${c(RESET)}`);
      }
      if (!config.verbose && violation.nodes.length > 1) {
        lines.push(`    ${c(DIM)}+${violation.nodes.length - 1} more element${violation.nodes.length - 1 === 1 ? "" : "s"} (use --verbose to see all)${c(RESET)}`);
      }
      lines.push("");
    }
  }

  console.log(lines.join("\n"));
}
