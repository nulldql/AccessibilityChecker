import type { RuleMap } from "./types.js";

export const structure: RuleMap = {
  "heading-order": {
    category: "Page Structure",
    title: "Heading levels skip a level",
    why: "Screen reader users navigate by heading level, so skipping from H2 to H4 makes the page structure confusing.",
    fix: "Use heading levels in order (H1, then H2, then H3) without skipping.",
  },
  "page-has-heading-one": {
    category: "Page Structure",
    title: "Page has no H1",
    why: "There's no top-level heading for a screen reader user to identify what this page is about.",
    fix: "Add exactly one <h1> that describes the page's main content.",
  },
  "empty-heading": {
    category: "Page Structure",
    title: "Heading has no text content",
    why: "A screen reader announces \"heading\" with nothing after it, a dead end for navigation.",
    fix: "Give the heading real text, or remove it if it's not actually needed.",
  },
  "landmark-one-main": {
    category: "Page Structure",
    title: "Page has no main landmark",
    why: "Screen reader users can't jump straight to the primary content of the page.",
    fix: "Wrap the primary content in a <main> element.",
  },
  region: {
    category: "Page Structure",
    title: "Content isn't inside a landmark region",
    why: "Screen reader users navigating by region will miss this content entirely.",
    fix: "Wrap content in a landmark element like <main>, <nav>, <header>, or <footer>.",
  },
  list: {
    category: "Page Structure",
    title: "List markup is broken",
    why: "A <ul> or <ol> contains something other than <li> children, so assistive tech won't announce it as a list.",
    fix: "Only put <li> elements directly inside <ul>/<ol>.",
  },
  listitem: {
    category: "Page Structure",
    title: "List item isn't inside a list",
    why: "An <li> outside a <ul>/<ol> loses its list context for screen reader users.",
    fix: "Make sure every <li> is a direct child of a <ul> or <ol>.",
  },
  "definition-list": {
    category: "Page Structure",
    title: "Definition list markup is broken",
    why: "A <dl> contains elements other than properly grouped <dt>/<dd> pairs, so its structure won't be announced correctly.",
    fix: "Only use <dt> and <dd> elements (optionally wrapped in <div>) directly inside <dl>.",
  },
  dlitem: {
    category: "Page Structure",
    title: "Definition term or description isn't inside a definition list",
    why: "A <dt> or <dd> outside a <dl> loses its meaning for screen reader users.",
    fix: "Make sure every <dt>/<dd> is inside a <dl>.",
  },
  "landmark-unique": {
    category: "Page Structure",
    title: "Multiple landmarks of the same type aren't distinguishable",
    why: "Screen reader users navigating by landmark will hear two identical announcements and can't tell them apart.",
    fix: "Give each landmark a unique aria-label, e.g. aria-label=\"Primary\" vs aria-label=\"Footer\".",
  },
  "landmark-no-duplicate-main": {
    category: "Page Structure",
    title: "Page has more than one main landmark",
    why: "Screen reader users expect exactly one main landmark as the entry point to primary content.",
    fix: "Use only one <main> element per page.",
  },
  "landmark-no-duplicate-banner": {
    category: "Page Structure",
    title: "Page has more than one top-level banner landmark",
    why: "There should be exactly one site header landmark, otherwise navigation by landmark becomes ambiguous.",
    fix: "Use only one top-level <header> (banner) element per page.",
  },
  "landmark-no-duplicate-contentinfo": {
    category: "Page Structure",
    title: "Page has more than one top-level contentinfo landmark",
    why: "There should be exactly one site footer landmark for the same reason as duplicate banners.",
    fix: "Use only one top-level <footer> (contentinfo) element per page.",
  },
  bypass: {
    category: "Page Structure",
    title: "Page has no way to skip repeated content",
    why: "Keyboard users have to tab through the entire navigation on every single page load to reach the main content.",
    fix: "Add a skip link at the top of the page, or a landmark/heading structure that lets assistive tech jump past navigation.",
  },
  "scrollable-region-focusable": {
    category: "Page Structure",
    title: "Scrollable content isn't reachable by keyboard",
    why: "A keyboard-only user can't scroll this region because it was never given a way to receive focus.",
    fix: "Add tabindex=\"0\" to the scrollable container so it can be focused and scrolled with arrow keys.",
  },
  tabindex: {
    category: "Page Structure",
    title: "Element has a positive tabindex",
    why: "Positive tabindex values override the page's natural reading order, which usually makes keyboard navigation confusing rather than better.",
    fix: "Use tabindex=\"0\" (or remove it) and rely on natural DOM order for the correct tab sequence.",
  },
  "target-size": {
    category: "Page Structure",
    title: "Clickable element is too small",
    why: "People with limited fine motor control or using a touchscreen may struggle to tap this accurately.",
    fix: "Make interactive elements at least 24x24 CSS pixels, or add enough spacing around smaller ones.",
  },
};
