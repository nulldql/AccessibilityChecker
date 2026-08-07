import type { RuleMap } from "./types.js";

export const language: RuleMap = {
  "html-has-lang": {
    category: "Language & Meta",
    title: "Page has no language declared",
    why: "Screen readers won't know which pronunciation rules to use, and translation tools may guess wrong.",
    fix: "Add lang=\"en\" (or the correct language code) to the <html> element.",
  },
  "html-lang-valid": {
    category: "Language & Meta",
    title: "Declared language isn't a valid code",
    why: "Assistive tech can't act on a language code it doesn't recognize.",
    fix: "Use a valid BCP 47 language code, e.g. \"en\", \"es\", \"fr-CA\".",
  },
  "html-xml-lang-mismatch": {
    category: "Language & Meta",
    title: "lang and xml:lang attributes don't match",
    why: "Different parts of the rendering pipeline may pick different languages, causing inconsistent pronunciation or translation.",
    fix: "Make sure the lang and xml:lang attributes on <html> declare the same language.",
  },
  "valid-lang": {
    category: "Language & Meta",
    title: "A lang attribute elsewhere on the page is invalid",
    why: "A screen reader will fail to switch pronunciation rules for this section of content.",
    fix: "Use a valid BCP 47 language code for every lang attribute on the page, not just on <html>.",
  },
  "document-title": {
    category: "Language & Meta",
    title: "Page has no <title>",
    why: "Screen reader users hear the page title first when a page loads, and with none, they get nothing.",
    fix: "Add a descriptive <title> in the document <head>.",
  },
  "frame-title": {
    category: "Language & Meta",
    title: "Embedded frame has no title",
    why: "A screen reader user can't tell what an <iframe> contains before entering it.",
    fix: "Add a title attribute describing the frame's content.",
  },
  "meta-viewport": {
    category: "Language & Meta",
    title: "Viewport meta tag disables zoom",
    why: "Low-vision users who rely on pinch-to-zoom to read content are locked out.",
    fix: "Remove user-scalable=no and maximum-scale restrictions from the viewport meta tag.",
  },
};
