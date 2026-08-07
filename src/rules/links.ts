import type { RuleMap } from "./types.js";

export const links: RuleMap = {
  "link-name": {
    category: "Links & Buttons",
    title: "Link has no accessible text",
    why: "A screen reader announces \"link\" with nothing after it, useless for navigation.",
    fix: "Add descriptive text inside the link, or an aria-label if it's icon-only.",
  },
  "button-name": {
    category: "Links & Buttons",
    title: "Button has no accessible text",
    why: "A screen reader user hears \"button\" with no idea what pressing it does.",
    fix: "Add text inside the button, or an aria-label for icon-only buttons.",
  },
  "aria-command-name": {
    category: "Links & Buttons",
    title: "Interactive element has no accessible name",
    why: "This element (button, link, or menu item) is focusable but announces nothing.",
    fix: "Add visible text, an aria-label, or aria-labelledby.",
  },
  "nested-interactive": {
    category: "Links & Buttons",
    title: "Interactive element is nested inside another interactive element",
    why: "Screen readers and browsers handle nested controls (like a button inside a link) inconsistently, and keyboard focus often lands on the wrong one.",
    fix: "Keep interactive elements like links, buttons, and inputs as siblings, not nested inside each other.",
  },
};
