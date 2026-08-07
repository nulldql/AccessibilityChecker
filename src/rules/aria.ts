import type { RuleMap } from "./types.js";

export const aria: RuleMap = {
  "aria-allowed-attr": {
    category: "ARIA",
    title: "ARIA attribute isn't allowed on this element's role",
    why: "Browsers ignore ARIA attributes that don't apply to an element's role, so assistive tech won't see what you intended.",
    fix: "Check the ARIA spec for which attributes are valid on this role, and remove the rest.",
  },
  "aria-allowed-role": {
    category: "ARIA",
    title: "ARIA role isn't allowed on this element",
    why: "The browser will ignore an invalid role, so the element falls back to its default (possibly wrong) accessible role.",
    fix: "Use a role that's valid for this element, or switch to an element that natively supports the role you want.",
  },
  "aria-required-attr": {
    category: "ARIA",
    title: "Element is missing a required ARIA attribute",
    why: "This role needs specific attributes to be meaningful to assistive tech, and without them it's incomplete.",
    fix: "Add the required attribute(s) for this role, e.g. aria-checked for role=\"checkbox\".",
  },
  "aria-required-children": {
    category: "ARIA",
    title: "Element is missing required child roles",
    why: "Some composite ARIA roles (like a listbox) are meaningless without specific child roles (like option) inside them.",
    fix: "Add the required child elements/roles this pattern expects.",
  },
  "aria-required-parent": {
    category: "ARIA",
    title: "Element needs a specific parent role it doesn't have",
    why: "Some ARIA roles only make sense inside a matching parent role, e.g. a listitem inside a list.",
    fix: "Wrap the element in an ancestor with the required role.",
  },
  "aria-roles": {
    category: "ARIA",
    title: "ARIA role value isn't valid",
    why: "An unrecognized role is ignored entirely, so the element gets no special accessible meaning at all.",
    fix: "Use a valid ARIA role from the WAI-ARIA specification.",
  },
  "aria-valid-attr": {
    category: "ARIA",
    title: "ARIA attribute name isn't valid",
    why: "Misspelled or nonexistent aria-* attributes are silently ignored by assistive tech.",
    fix: "Double-check the attribute name against the ARIA spec, e.g. aria-label, not arialabel or aria-labeled.",
  },
  "aria-valid-attr-value": {
    category: "ARIA",
    title: "ARIA attribute has an invalid value",
    why: "Assistive tech expects specific values (like true/false, or an element ID) and won't know what to do with anything else.",
    fix: "Use a valid value for this attribute, e.g. aria-expanded should be \"true\" or \"false\", not \"yes\".",
  },
  "aria-hidden-body": {
    category: "ARIA",
    title: "aria-hidden is set on the document body",
    why: "This hides the entire page from every screen reader user at once.",
    fix: "Remove aria-hidden from <body>. It's almost never intentional.",
  },
  "aria-hidden-focus": {
    category: "ARIA",
    title: "Focusable element is hidden from assistive tech",
    why: "A keyboard user can tab to this element, but a screen reader user won't know it exists.",
    fix: "Remove aria-hidden from focusable elements, or make them unfocusable too.",
  },
  "aria-toggle-field-name": {
    category: "ARIA",
    title: "Toggle field (checkbox, switch) has no accessible name",
    why: "A screen reader announces the control's state but not what it's toggling.",
    fix: "Add a label, aria-label, or aria-labelledby describing what the toggle controls.",
  },
  "aria-tooltip-name": {
    category: "ARIA",
    title: "Tooltip element has no accessible name",
    why: "A screen reader user who reaches this tooltip hears nothing describing its content.",
    fix: "Add text content or an aria-label to the tooltip.",
  },
  "duplicate-id-active": {
    category: "ARIA",
    title: "Duplicate ID on an interactive element",
    why: "Duplicate IDs break label associations and can make assistive tech target the wrong element.",
    fix: "Make sure every id attribute on the page is unique.",
  },
  "duplicate-id-aria": {
    category: "ARIA",
    title: "Duplicate ID referenced by an ARIA attribute",
    why: "aria-labelledby and similar attributes reference IDs directly, so a duplicate means the reference is ambiguous.",
    fix: "Make sure every id attribute referenced by an ARIA attribute is unique on the page.",
  },
};
