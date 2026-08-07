import type { Category, PlainRule, RuleMap } from "./types.js";
import { images } from "./images.js";
import { forms } from "./forms.js";
import { contrast } from "./contrast.js";
import { structure } from "./structure.js";
import { links } from "./links.js";
import { language } from "./language.js";
import { aria } from "./aria.js";
import { timing } from "./timing.js";

export type { Category, PlainRule } from "./types.js";

const REGISTRY: RuleMap[] = [images, forms, contrast, structure, links, language, aria, timing];

function buildIndex(): RuleMap {
  const index: RuleMap = {};
  for (const map of REGISTRY) {
    for (const [ruleId, rule] of Object.entries(map)) {
      if (ruleId in index) {
        throw new Error(`Duplicate rule id registered twice: ${ruleId}`);
      }
      index[ruleId] = rule;
    }
  }
  return index;
}

const RULES = buildIndex();

export function categoryOrder(): Category[] {
  return [
    "Images",
    "Forms",
    "Color & Contrast",
    "Page Structure",
    "Links & Buttons",
    "ARIA",
    "Timing & Motion",
    "Language & Meta",
    "Other",
  ];
}

export function ruleCount(): number {
  return Object.keys(RULES).length;
}

export function knownRuleIds(): string[] {
  return Object.keys(RULES).sort();
}

export function translate(ruleId: string, fallbackHelp: string): PlainRule {
  const known = RULES[ruleId];
  if (known) return known;
  return {
    category: "Other",
    title: fallbackHelp,
    why: "This affects how well assistive technology can understand or operate this part of the page.",
    fix: "See the linked WCAG reference for this rule for the recommended fix.",
  };
}
