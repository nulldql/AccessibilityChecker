export type WcagLevel = "A" | "AA" | "AAA";

export type WcagCriterion = {
  criterion: string;
  name: string;
  level: WcagLevel;
};

const CRITERIA: Record<string, WcagCriterion> = {
  wcag111: { criterion: "1.1.1", name: "Non-text Content", level: "A" },
  wcag121: { criterion: "1.2.1", name: "Audio-only and Video-only (Prerecorded)", level: "A" },
  wcag122: { criterion: "1.2.2", name: "Captions (Prerecorded)", level: "A" },
  wcag123: { criterion: "1.2.3", name: "Audio Description or Media Alternative (Prerecorded)", level: "A" },
  wcag131: { criterion: "1.3.1", name: "Info and Relationships", level: "A" },
  wcag132: { criterion: "1.3.2", name: "Meaningful Sequence", level: "A" },
  wcag133: { criterion: "1.3.3", name: "Sensory Characteristics", level: "A" },
  wcag134: { criterion: "1.3.4", name: "Orientation", level: "AA" },
  wcag135: { criterion: "1.3.5", name: "Identify Input Purpose", level: "AA" },
  wcag141: { criterion: "1.4.1", name: "Use of Color", level: "A" },
  wcag142: { criterion: "1.4.2", name: "Audio Control", level: "A" },
  wcag143: { criterion: "1.4.3", name: "Contrast (Minimum)", level: "AA" },
  wcag144: { criterion: "1.4.4", name: "Resize Text", level: "AA" },
  wcag1410: { criterion: "1.4.10", name: "Reflow", level: "AA" },
  wcag1411: { criterion: "1.4.11", name: "Non-text Contrast", level: "AA" },
  wcag1412: { criterion: "1.4.12", name: "Text Spacing", level: "AA" },
  wcag1413: { criterion: "1.4.13", name: "Content on Hover or Focus", level: "AA" },
  wcag146: { criterion: "1.4.6", name: "Contrast (Enhanced)", level: "AAA" },
  wcag211: { criterion: "2.1.1", name: "Keyboard", level: "A" },
  wcag212: { criterion: "2.1.2", name: "No Keyboard Trap", level: "A" },
  wcag221: { criterion: "2.2.1", name: "Timing Adjustable", level: "A" },
  wcag222: { criterion: "2.2.2", name: "Pause, Stop, Hide", level: "A" },
  wcag231: { criterion: "2.3.1", name: "Three Flashes or Below Threshold", level: "A" },
  wcag241: { criterion: "2.4.1", name: "Bypass Blocks", level: "A" },
  wcag242: { criterion: "2.4.2", name: "Page Titled", level: "A" },
  wcag243: { criterion: "2.4.3", name: "Focus Order", level: "A" },
  wcag244: { criterion: "2.4.4", name: "Link Purpose (In Context)", level: "A" },
  wcag246: { criterion: "2.4.6", name: "Headings and Labels", level: "AA" },
  wcag247: { criterion: "2.4.7", name: "Focus Visible", level: "AA" },
  wcag2411: { criterion: "2.4.11", name: "Focus Not Obscured (Minimum)", level: "AA" },
  wcag251: { criterion: "2.5.1", name: "Pointer Gestures", level: "A" },
  wcag253: { criterion: "2.5.3", name: "Label in Name", level: "A" },
  wcag258: { criterion: "2.5.8", name: "Target Size (Minimum)", level: "AA" },
  wcag311: { criterion: "3.1.1", name: "Language of Page", level: "A" },
  wcag312: { criterion: "3.1.2", name: "Language of Parts", level: "AA" },
  wcag321: { criterion: "3.2.1", name: "On Focus", level: "A" },
  wcag322: { criterion: "3.2.2", name: "On Input", level: "A" },
  wcag325: { criterion: "3.2.5", name: "Change on Request", level: "AAA" },
  wcag331: { criterion: "3.3.1", name: "Error Identification", level: "A" },
  wcag332: { criterion: "3.3.2", name: "Labels or Instructions", level: "A" },
  wcag411: { criterion: "4.1.1", name: "Parsing", level: "A" },
  wcag412: { criterion: "4.1.2", name: "Name, Role, Value", level: "A" },
  wcag413: { criterion: "4.1.3", name: "Status Messages", level: "AA" },
};

export function criteriaFromTags(tags: string[]): WcagCriterion[] {
  const found: WcagCriterion[] = [];
  for (const tag of tags) {
    const criterion = CRITERIA[tag];
    if (criterion) found.push(criterion);
  }
  return found.sort((a, b) => a.criterion.localeCompare(b.criterion, undefined, { numeric: true }));
}

export function formatCriteria(criteria: WcagCriterion[]): string {
  return criteria.map((c) => `${c.criterion} ${c.name} (${c.level})`).join(", ");
}
