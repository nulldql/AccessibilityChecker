import type { RuleMap } from "./types.js";

export const contrast: RuleMap = {
  "color-contrast": {
    category: "Color & Contrast",
    title: "Text doesn't have enough contrast against its background",
    why: "People with low vision or color blindness may not be able to read this text at all.",
    fix: "Darken the text or lighten the background until the contrast ratio is at least 4.5:1 (3:1 for large text).",
  },
  "color-contrast-enhanced": {
    category: "Color & Contrast",
    title: "Text doesn't meet the stricter (AAA) contrast standard",
    why: "This text is readable for most people but falls short of the highest accessibility bar.",
    fix: "Aim for a 7:1 contrast ratio (4.5:1 for large text) if you're targeting WCAG AAA.",
  },
  "link-in-text-block": {
    category: "Color & Contrast",
    title: "Link is only distinguishable from surrounding text by color",
    why: "Someone who can't perceive color differences won't notice this is a link.",
    fix: "Add an underline or other non-color styling to links inside paragraphs.",
  },
};
